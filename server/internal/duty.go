package internal

import (
	"context"
	"time"
)

type presentationDuty struct {
	Pioneer   pioneerRecord `json:"pioneer"`
	Chore     choreRecord   `json:"chores"`
	Completed bool          `json:"completed"`
}

type dutyRosterRecord struct {
	Date      string             `json:"date"`
	Duties    []presentationDuty `json:"duties"`
	Timestamp time.Time
	RecordType recordType
}

func saveDuties(dutyRoster dutyRosterRecord, hc *handlerContext) error {
	dutyCollection := hc.dutyDb().Collection("rosters")
	_, err := dutyCollection.InsertOne(context.Background(), dutyRoster)
	return err
}
