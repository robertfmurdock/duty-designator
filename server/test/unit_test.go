package test

import (
	"duty-designator/server/src"
	"testing"
)

func TestGetDBClient_ReturnsClient(t *testing.T) {
	client, _ := src.GetDBClient()

	if client == nil {
		t.Fail()
	}
}
