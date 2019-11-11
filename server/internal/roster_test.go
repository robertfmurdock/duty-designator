package internal

import (
	"context"
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"testing"
	"time"
)

func Test_saveDutyRosterWillInsertRecordsInCollection(t *testing.T) {
	duty := dutyRecord{
		Completed: false,
		Pioneer:   pioneerRecord{Id: stringUuid()},
		Chore:     choreRecord{Id: stringUuid()},
	}

	duty2 := dutyRecord{
		Completed: false,
		Pioneer:   pioneerRecord{Id: stringUuid()},
		Chore:     choreRecord{Id: stringUuid()},
	}

	dutyRoster := dutyRosterRecord{
		Date:      "10/11/10",
		Duties:    []dutyRecord{duty, duty2},
		Timestamp: time.Now().Round(time.Millisecond),
	}

	if err := saveRoster(dutyRoster, &handlerContext{dbClient: client}); err != nil {
		t.Errorf("Could not save roster %v", err)
	}

	loadedRoster := loadRosterFromDb(t, dutyRoster.Date)
	assertRosterContains(loadedRoster, dutyRoster, t)
}

func Test_saveRosterWithSameDateMultipleTimesWillNotRemovePriorRecords(t *testing.T) {
	dutyRosterEarlier, dutyRosterLater := generateRosterWithSameDateDifferentData("12/15/99")

	if err := saveRoster(dutyRosterEarlier, &handlerContext{dbClient: client}); err != nil {
		t.Errorf("Could not save roster %v", err)
	}

	if err := saveRoster(dutyRosterLater, &handlerContext{dbClient: client}); err != nil {
		t.Errorf("Could not save roster %v", err)
	}

	loadedRoster := loadRosterFromDb(t, dutyRosterEarlier.Date)
	assertRosterContains(loadedRoster, dutyRosterEarlier, t)
	assertRosterContains(loadedRoster, dutyRosterLater, t)
}

func generateRosterWithSameDateDifferentData(date string) (dutyRosterRecord, dutyRosterRecord) {
	nowish := time.Now().Round(time.Millisecond)
	duty := dutyRecord{
		Completed: false,
		Pioneer:   pioneerRecord{Id: stringUuid()},
		Chore:     choreRecord{Id: stringUuid()},
	}
	duty2 := dutyRecord{
		Completed: false,
		Pioneer:   pioneerRecord{Id: stringUuid()},
		Chore:     choreRecord{Id: stringUuid()},
	}
	dutyRosterEarlier := dutyRosterRecord{
		Date:      date,
		Duties:    []dutyRecord{duty, duty2},
		Timestamp: nowish,
	}
	dutyRosterLater := dutyRosterRecord{
		Date:      date,
		Duties:    []dutyRecord{duty},
		Timestamp: nowish.Add(time.Millisecond),
	}
	return dutyRosterEarlier, dutyRosterLater
}

func Test_loadRosterWhenMultipleRecordsWithDateExist_WillPresentTheRecordWithLatestTimestamp(t *testing.T) {
	dutyRosterEarlier, dutyRosterLater := generateRosterWithSameDateDifferentData("11/11/11")

	hc := &handlerContext{dbClient: client}
	if err := saveRoster(dutyRosterEarlier, hc); err != nil {
		t.Errorf("Could not save roster %v", err)
	}
	if err := saveRoster(dutyRosterLater, hc); err != nil {
		t.Errorf("Could not save roster %v", err)
	}

	loadedRoster, err := loadRosterRecord(dutyRosterEarlier.Date, hc)
	if err != nil {
		t.Errorf("Load failed, yo %v\n", err)
	}

	if !cmp.Equal(dutyRosterLater, *loadedRoster) {
		t.Errorf("Did not load correct roster:\n %v", cmp.Diff(dutyRosterLater, *loadedRoster))
	}
}

func stringUuid() string {
	return uuid.New().String()
}

func loadRosterFromDb(t *testing.T, date string) []dutyRosterRecord {
	collection := client.Database("dutyDB").Collection("rosters")
	cursor, err := collection.Find(context.Background(), bson.M{"date": date})

	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}

	var records []dutyRosterRecord
	err = cursor.All(context.Background(), &records)

	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}

	return records
}

func assertRosterContains(rosters []dutyRosterRecord, record dutyRosterRecord, t *testing.T) {
	if !dutyArrayContains(rosters, record) {
		t.Errorf("Loaded duties did not contain %v.\n%v", record, rosters)
	}
}

func dutyArrayContains(s []dutyRosterRecord, e dutyRosterRecord) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}
