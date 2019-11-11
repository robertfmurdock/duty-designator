package internal

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type presentationDuty struct {
	Pioneer   pioneerRecord `json:"pioneer"`
	Chore     choreRecord   `json:"chores"`
	Completed bool          `json:"completed"`
}

type dutyRosterRecord struct {
	Date       string             `json:"date"`
	Duties     []presentationDuty `json:"duties"`
	Timestamp  time.Time
	RecordType recordType
}

func saveRoster(dutyRoster dutyRosterRecord, hc *handlerContext) error {
	dutyCollection := hc.dutyDb().Collection("rosters")
	_, err := dutyCollection.InsertOne(context.Background(), dutyRoster)
	return err
}

func loadRosterRecord(date string, hc *handlerContext) (*dutyRosterRecord, error) {
	dutyCollection := hc.dutyDb().Collection("rosters")
	result := dutyCollection.FindOne(context.Background(), bson.M{"date": date},
		&options.FindOneOptions{Sort: bson.M{"timestamp": -1}})

	var roster dutyRosterRecord
	if err := result.Decode(&roster); err != nil {
		return nil, err
	}

	return &roster, nil
}
