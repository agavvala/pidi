import React, {Component} from 'react'
var FontAwesome = require('react-fontawesome');

class NextQuestion extends Component{
    constructor(props){
        super(props)
    }

    render(){
        if(!(this.props.index + 1 < this.props.maxQuestions)){
            return null;
        }
        return(
            <button className='button btn btn-primary' onClick={this.props.onNextQuestion}>
                <i className="arrow right"></i>
            </button>
        );
    }
}

export default NextQuestion;