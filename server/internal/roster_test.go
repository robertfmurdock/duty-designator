package internal

import (
	"context"
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"net/http/httptest"
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

func Test_removeRosterShouldInsertRemoveRecord(t *testing.T) {
	now := time.Now().Round(time.Millisecond)
	hc := &handlerContext{dbClient: client}

	recordDate := "Today"
	if err := insertRemoveRosterRecord(recordDate, now, hc); err != nil {
		t.Errorf("Could not insert Remove Record %v", err)
		return
	}

	loadedRosters := loadRosterFromDb(t, recordDate)
	expectedRemoveRecord := dutyRosterRecord{
		Date:       recordDate,
		Timestamp:  now,
		RecordType: removed,
	}

	assertRosterContains(loadedRosters, expectedRemoveRecord, t)
}

func Test_handleGetRosterWillReturn404WhenNoRecordsExist(t *testing.T) {
	dutyCollection := client.Database("dutyDb").Collection("roster")
	if err := dutyCollection.Drop(context.Background()); err != nil {
		t.Errorf("Drop problems %v", err)
	}

	hc := &handlerContext{dbClient: client}

	recorder := httptest.NewRecorder()
	if err := getRosterHandler(recorder, httptest.NewRequest("Meh", "/wherever", nil), hc); err != nil {
		t.Errorf("Could not load corral\n %v", err)
	}

	if recorder.Code != http.StatusNotFound {
		t.Errorf("Status code should have been not found but was %v", recorder.Code)
	}
}

func Test_loadRecordListWillGiveYouLatestVersionOfEachRecord(t *testing.T) {
	if err := client.Database("dutyDB").Collection("rosters").Drop(context.Background()); err != nil {
		t.Errorf("Failed to drop. %v", err)
		return
	}
	dutyRoster1Earlier, dutyRoster1Later := generateRosterWithSameDateDifferentData("12/15/99")
	dutyRoster2Earlier, dutyRoster2Later := generateRosterWithSameDateDifferentData("theYear3000")
	hc := &handlerContext{dbClient: client}
	for _, record := range []dutyRosterRecord{dutyRoster1Earlier, dutyRoster2Earlier, dutyRoster1Later, dutyRoster2Later} {
		if err := saveRoster(record, hc); err != nil {
			t.Errorf("Failed to save %v", err)
			return
		}
	}

	records, err := loadRosterRecordList(hc)
	if err != nil {
		t.Errorf("Failed to load %v", err)
	}

	expectedRecords := []dutyRosterRecord{dutyRoster1Later, dutyRoster2Later}
	if !cmp.Equal(records, expectedRecords) {
		t.Errorf("Expected records were incorrect %v", cmp.Diff(records, expectedRecords))
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
