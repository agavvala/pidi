import React, { Component } from 'react';

import {DEFAULT_ASSESSMENT_QUESTION_COUNT} from './Wellknown'
import PidiWebServices from './services/pidi_webservices'
import Question from './Question'
import PreviousQuestion from './PreviousQuestion'
import NextQuestion from './NextQuestion'

class TestWords extends Component {
    pidiService = new PidiWebServices()
    constructor(props){
        super(props);
        this.state = {answers: []};
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
            questions: result.data
        });
    }

    nextQuestion = () => {
        //console.log("Showing Next Question...")
        this.setState((prevState, props) => ({
            currentIndex: prevState.currentIndex + 1
        }));
    }

    previousQuestion = () => {
        //console.log("Showing Previous Question...")
        this.setState((prevState, props) => ({
            currentIndex: prevState.currentIndex - 1
        }));
    }

    onAnswerChanged = (e) => {
        let selectedAnswer = e.currentTarget.value
        this.setState(function(prevState, props){
            let answers = prevState.answers
            answers[prevState.currentIndex] = selectedAnswer
            return {answers: answers}
        });
    }
    render(){
        if(!this.state.questions){
            return (
                <div>Loading Questions... Good Luck.</div>
            );
        }
        return(
            <div>
                <h2>Test your knowledge</h2>
                <h4>Question: {this.state.currentIndex + 1}/{this.state.howMany}</h4>
                <Question key={this.state.questions[this.state.currentIndex]}
                          question={this.state.questions[this.state.currentIndex].word.word}
                          choices={this.state.questions[this.state.currentIndex].choices}
                          onAnswerSelect={this.onAnswerChanged}
                />

                <PreviousQuestion index={this.state.currentIndex}
                                  onPreviousQuestion={this.previousQuestion}
                            />
                <NextQuestion index={this.state.currentIndex}
                              maxQuestions={this.state.howMany}
                              onNextQuestion={this.nextQuestion}
                            />
            </div>
        );
    }
}

export default TestWords;
