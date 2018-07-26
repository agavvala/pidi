
import React, {Component} from 'react'

class NextQuestion extends Component{
    constructor(props){
        super(props)
    }

    render(){
        if(!(this.props.index + 1 < this.props.maxQuestions)){
            return null;
        }
        return(
            <button onClick={this.props.onNextQuestion}>Next Question</button>
        );
    }
}

export default NextQuestion;