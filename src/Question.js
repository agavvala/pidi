import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './question.css'

class Question extends Component {
    render() {
        if (!this.props.question) {
            return null;
        }
        return (
            <div>
                <h5>{this.props.question}</h5>
                <ul>
                {this.props.choices.map(choice => (
                    <li>
                    <input type="radio" name={this.props.question} value={choice}/>
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