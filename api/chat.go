package handler

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

type Response struct {
	Message string `json:"message"`
}

func Chat(w http.ResponseWriter, r *http.Request) {
	var data map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	actor := data["actor"].(string)

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

