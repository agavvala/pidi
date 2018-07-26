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
                <h5>{this.props.question}</h5>
                <ul>
                {this.props.choices.map(choice => (
                    <li key={choice}>
                    <input type="radio"  name={this.props.question} value={choice}
                           onChange={this.props.onAnswerSelect}/>
                    {choice}
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