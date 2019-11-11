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

func (presentationRoster presentationDutyRoster) toRecord() dutyRosterRecord {
	return dutyRosterRecord{
		Date:       presentationRoster.Date,
		Duties:     presentationRoster.Duties,
		Timestamp:  time.Now(),
		RecordType: 0,
	}
}

func (rosterRecord *dutyRosterRecord) toPresentation() presentationDutyRoster {
	return presentationDutyRoster{
		Date:   rosterRecord.Date,
		Duties: rosterRecord.Duties,
	}
}
