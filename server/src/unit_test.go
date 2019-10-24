package src

import (
	"testing"
)

func TestGetDBClient_ReturnsClient(t *testing.T) {
	client, _ := getDBClient()

	if client == nil {
		t.Fail()
	}
}
