import React, { Component } from 'react';

import {DEFAULT_ASSESSMENT_QUESTION_COUNT} from './Wellknown'
import PidiWebServices from './services/pidi_webservices'
import Question from './Question'

class TestWords extends Component {
    pidiService = new PidiWebServices()
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.pidiService.fetchTest(DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startTest)
    }

    startTest = (result) => {
        console.log("Question: ", result)
        // console.log("typeof Choices: ", typeof result.data[0].choices)
        // console.log("Choices: ", result.data[0].choices)
        // result.data[0].choices.map((v, i) => {console.log(v)})
        this.setState({
            currentIndex: 0,
            howMany: result.howMany,
            currentQuestion: result.data[0].word.word,
            currentChoices: result.data[0].choices
        });
    }
    render(){
        return(
            <div>
                <h2>Test your knowledge</h2>
                <h4>Question: {this.state.currentIndex + 1}/{this.state.howMany}</h4>
                <Question key={this.state.currentQuestion} question={this.state.currentQuestion} choices={this.state.currentChoices}/>
            </div>
        );
    }
}

export default TestWords;
