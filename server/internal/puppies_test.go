package internal

import (
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"net/http/httptest"
	"testing"
)

func TestPostingPuppyPutsPittsInThePound(t *testing.T) {
	puppy := puppyRecord{
		Name: "Butch",
		Id:   uuid.New().String(),
	}
	request, err := requestWithJsonBody(puppy)

	if err != nil {
		t.Errorf("Could not produce request %v", err)
	}

	hC := handlerContext{dbClient: client}

	if err := puppyPostHandler(httptest.NewRecorder(), request, &hC); err != nil {
		t.Errorf("post error %v", err)
	}

	puppyRecords := loadPuppiesFromDb(t)

	if !containsPuppy(puppyRecords, puppy) {
		t.Error("DB didn't have the puppy... HE MUST HAVE ESCAPED!!!")
	}
}

func TestGettingPuppySavesSweetieFromTheMill(t *testing.T) {
	puppy := puppyRecord{
		Name: "Snoopy",
		Id:   uuid.New().String(),
	}
	if err := savePuppy(dutyDB(), puppy); err != nil {
		t.Error("Could not save, so setup incomplete.")
	}

	context := handlerContext{dbClient: client}
	puppies, err := getPuppies(context.dutyDb())
	if err != nil {
		t.Errorf("Could not get pups, so sad. %v", err)
	}

	if !puppyArrayContains(puppies, puppy) {
		t.Errorf("Puppy not found in pound... ruh roh raggy. %v did not contain %v", puppies, puppy)
	}
}

func loadPuppiesFromDb(t *testing.T) []puppyRecord {
	var puppyRecords []puppyRecord
	loadRecordsFromCollection(t, "pound", &puppyRecords)
	return puppyRecords
}

func containsPuppy(s []puppyRecord, e puppyRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func puppyArrayContains(s []puppyRecord, e puppyRecord) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}
