import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './question.css'

class Question extends Component {

    constructor(props){
        super(props)
    }

    render() {
        if (!this.props.question) {
            return null;
        }
        return (
            <div>
                <h5 className="word">{this.props.question}</h5>
                <ul className="answers">
                {this.props.choices.map(choice => (
                    <li key={choice}>
                        <label>
                            <input type="radio" name={this.props.question} value={choice}
                                   checked={choice === this.props.currSelection}
                                   onChange={this.props.onAnswerSelect}/>&nbsp;
                            {choice}
                        </label>
                    </li>
                ))}
                </ul>
            </div>
        );
    }
}


Question.propTypes = {
    question: PropTypes.string,
    choices: PropTypes.array
}

export default Question;