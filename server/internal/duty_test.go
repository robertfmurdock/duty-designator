package internal

import (
	"context"
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"testing"
)

func Test_saveDutiesWillInsertRecordsInCollection(t *testing.T) {
	duty := presentationDuty{
		Completed: false,
		Pioneer:   pioneerRecord{Id: stringUuid()},
		Chore:     choreRecord{Id: stringUuid()},
	}

	duty2 := presentationDuty{
		Completed: false,
		Pioneer:   pioneerRecord{Id: stringUuid()},
		Chore:     choreRecord{Id: stringUuid()},
	}

	dutyRoster := dutyRosterRecord{
		Date:   "10/11/10",
		Duties: []presentationDuty{duty, duty2},
	}

	if err := saveDuties(dutyRoster, &handlerContext{dbClient: client}); err != nil {
		t.Errorf("Could not save roster %v", err)
	}

	loadedDuties := loadRosterFromDb(t)
	assertDutyListContains(loadedDuties, duty, t)
	assertDutyListContains(loadedDuties, duty2, t)
}

func stringUuid() string {
	return uuid.New().String()
}

func loadRosterFromDb(t *testing.T) dutyRosterRecord {
	collection := client.Database("dutyDB").Collection("rosters")
	result := collection.FindOne(context.Background(), bson.M{"Date": "10/11/10"})

	var row dutyRosterRecord
	err := result.Decode(&row)

	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}

	return row
}

func assertDutyListContains(duties []presentationDuty, record presentationDuty, t *testing.T) {
	if !dutyArrayContains(duties, record) {
		t.Errorf("Loaded duties did not contain %v.\n%v", record, duties)
	}
}

func dutyArrayContains(s []presentationDuty, e presentationDuty) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}
