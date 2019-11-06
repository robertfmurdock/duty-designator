package internal

import (
	"context"
	"github.com/google/go-cmp/cmp"
	"go.mongodb.org/mongo-driver/bson"
	"testing"
	"time"
)

func Test_saveCorralWillInsertRecordInCollection(t *testing.T) {
	corral := corralRecord{
		Date:     "whenever",
		Pioneers: []pioneerRecord{},
		Chores:   []choreRecord{},
	}
	if err := saveCorral(corral, &handlerContext{dbClient: client}); err != nil {
		t.Errorf("Could not save corral %v", err)
	}

	loadedCorrals := loadCorralsFromDb(t)
	assertCorralListContains(loadedCorrals, corral, t)
}

func Test_saveCorralWithSameDateMultipleTimesWillNotRemovePriorRecords(t *testing.T) {
	corralEarlier, corralLater := generateCorralWithSameDateDifferentData()
	hc := &handlerContext{dbClient: client}
	if err := saveCorral(corralEarlier, hc); err != nil {
		t.Errorf("Could not save corral %v", err)
	}
	if err := saveCorral(corralLater, hc); err != nil {
		t.Errorf("Could not save corral %v", err)
	}

	loadedCorrals := loadCorralsFromDb(t)
	assertCorralListContains(loadedCorrals, corralEarlier, t)
	assertCorralListContains(loadedCorrals, corralLater, t)
}

func generateCorralWithSameDateDifferentData() (corralRecord, corralRecord) {
	nowish := time.Date(2019, time.November, 6, 10, 36, 21, 4000000, time.UTC)
	corralEarlier := corralRecord{
		Date:      "whenever",
		Pioneers:  []pioneerRecord{},
		Chores:    []choreRecord{},
		Timestamp: nowish,
	}
	corralLater := corralRecord{
		Date: corralEarlier.Date,
		Pioneers: []pioneerRecord{{
			Name: "Bill",
			Id:   "ill",
		}},
		Chores:    []choreRecord{},
		Timestamp: nowish.Add(time.Millisecond),
	}
	return corralEarlier, corralLater
}

func Test_getCorralWhenMultipleRecordsWithDateExistWillPresentTheLatestTimestampOne(t *testing.T) {
	corralEarlier, corralLater := generateCorralWithSameDateDifferentData()
	hc := &handlerContext{dbClient: client}
	if err := saveCorral(corralEarlier, hc); err != nil {
		t.Errorf("Could not save corral %v", err)
	}
	if err := saveCorral(corralLater, hc); err != nil {
		t.Errorf("Could not save corral %v", err)
	}

	loadedCorral, err := loadCorralRecord(corralEarlier.Date, hc)
	if err != nil {
		t.Errorf("Could not load corral\n %v", err)
		return
	}

	if !cmp.Equal(corralLater, *loadedCorral) {
		t.Errorf("loaded corral was not the latest:\n%v", cmp.Diff(corralLater, *loadedCorral))
		return
	}
}

func assertCorralListContains(corrals []corralRecord, record corralRecord, t *testing.T) {
	if !corralArrayContains(corrals, record) {
		t.Errorf("Loaded corrals did not contain %v.\n%v", record, corrals)
	}
}

func loadCorralsFromDb(t *testing.T) []corralRecord {
	collection := client.Database("dutyDB").Collection("corrals")
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}
	var records []corralRecord
	err = cursor.All(context.Background(), &records)
	if err != nil {
		t.Errorf("MongoDB load error: %s", err)
	}
	return records
}

func corralArrayContains(s []corralRecord, e corralRecord) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}
