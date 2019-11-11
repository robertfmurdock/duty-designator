package internal

import "time"

type dutyRecord struct {
	Pioneer   pioneerRecord `json:"pioneer"`
	Chore     choreRecord   `json:"chore"`
	Completed bool          `json:"completed"`
}

type dutyRosterRecord struct {
	Date       string       `json:"date"`
	Duties     []dutyRecord `json:"duties"`
	Timestamp  time.Time
	RecordType recordType
}

type presentationDutyRoster struct {
	Date   string       `json:"date"`
	Duties []dutyRecord `json:"duties"`
}

func (presentation presentationDutyRoster) toRecord() dutyRosterRecord {
	return dutyRosterRecord{
		Date:       presentation.Date,
		Duties:     presentation.Duties,
		Timestamp:  time.Now(),
		RecordType: 0,
	}
}

func (record *dutyRosterRecord) toPresentation() presentationDutyRoster {
	return presentationDutyRoster{
		Date:   record.Date,
		Duties: record.Duties,
	}
}
