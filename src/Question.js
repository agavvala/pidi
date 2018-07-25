import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Question extends Component {
    render() {
        if (!this.props.question) {
            return null;
        }
        return (
            <div>
                <h5>{this.props.question}</h5>
                {this.props.choices.map(choice => (
                    <li>{choice}</li>
                ))}
            </div>
        );
    }
}


Question.propTypes = {
    question: PropTypes.string,
    choices: PropTypes.array
}

export default Question;