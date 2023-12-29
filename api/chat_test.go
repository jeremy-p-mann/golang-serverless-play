package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestChat(t *testing.T) {
	// Create a request
	payload := `{"recipient": "AI", "messages": [{"content": "Hi", "role": "Human"}]}`
	req, err := http.NewRequest("POST", "/api/chat", strings.NewReader(payload))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()

	Chat(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}

	expectedResponse := `{"message":"I am AI."}`
	if rr.Body.String() != expectedResponse {
		t.Errorf("Expected response %s, but got %s", expectedResponse, rr.Body.String())
	}
}
