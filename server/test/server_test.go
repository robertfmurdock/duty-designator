package test

import "testing"

import "duty-designator/server/src"

func TestGetCandidatesHandler_ReturnsCandidate(t *testing.T) {
	candidate, err := src.GetCandidatesHandler();

	if candidate.Name != "Riley" || err != nil{
		t.Fail();
	}
}
