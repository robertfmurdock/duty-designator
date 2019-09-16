package src

type Candidate struct {
	Name string
}
func Main() {

}

func GetCandidatesHandler()  (*Candidate, error){
	return &Candidate{"Riley"}, nil
}