package internal

import "time"

type corralRecord struct {
	Date       string          `json:"date"`
	Pioneers   []pioneerRecord `json:"pioneers"`
	Chores     []choreRecord   `json:"chores"`
	Timestamp  time.Time
	RecordType recordType
}

type recordType int

//noinspection GoUnusedConst
const (
	active  recordType = iota
	removed recordType = iota
)

type presentationCorral struct {
	Date     string          `json:"date"`
	Pioneers []pioneerRecord `json:"pioneers"`
	Chores   []choreRecord   `json:"chores"`
}


func toPresentationCorral(record *corralRecord) presentationCorral {
	return presentationCorral{
		Date:     record.Date,
		Pioneers: record.Pioneers,
		Chores:   record.Chores,
	}
}