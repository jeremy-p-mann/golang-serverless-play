package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"time"
)

type ChatMessage struct {
	Content string `json:"content"`
	Sender  string `json:"role"`
}

type ChatRequest struct {
	Messages  []ChatMessage `json:"messages"`
	Recipient string        `json:"recipient"`
}

type Response struct {
	Message string `json:"message"`
}

func Chat(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	var chatRequest ChatRequest

	err = json.Unmarshal(body, &chatRequest)
	if err != nil {
		// handle error, maybe respond with a 400 Bad Request
		http.Error(w, "Error unmarshaling JSON", http.StatusBadRequest)
		return
	}

	actor := chatRequest.Recipient

	responseChan := make(chan string, 1)
	go simulateAsyncActorResponse(actor, responseChan)
	fmt.Printf("Running endpoint")

	select {
	case message := <-responseChan:
		response := Response{Message: message}
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	case <-time.After(3 * time.Second):
		http.Error(w, "Timeout occurred", http.StatusInternalServerError)
	}
}

func simulateAsyncActorResponse(actor string, responseChan chan string) {
	randomTime := time.Duration(rand.Intn(2000)+1000) * time.Millisecond
	shouldFail := rand.Float64() < 0.5

	time.Sleep(randomTime)

	if shouldFail {
		responseChan <- fmt.Sprintf("Request failed: it's just random yo. Actor: %s", actor)
	} else {
		responseChan <- fmt.Sprintf("I am %s.", actor)
	}
}
