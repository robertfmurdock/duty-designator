import React from 'react';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: props.tasks ? props.tasks : [],
            candidates: props.candidates ? props.candidates : []
        }
    }

    render = () => (
        <div>
            <ul>
                {this.state.tasks.map(task => <li key={task} className="task">{task}</li>)}
            </ul>
            <ul>
                {this.state.candidates.map(candidate => <li key={candidate} className="candidate">{candidate}</li>)}
            </ul>
        </div>
    )
}