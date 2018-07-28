import React, { Component } from 'react';

import {DEFAULT_ASSESSMENT_QUESTION_COUNT} from './Wellknown'
import PidiWebServices from './services/pidi_webservices'
import Question from './Question'
import PreviousQuestion from './PreviousQuestion'
import NextQuestion from './NextQuestion'
import SubmitTest from './SubmitTest'
import TestWordsResults from './TestWordsResults'

class TestWords extends Component {
    pidiService = new PidiWebServices()
    constructor(props){
        super(props);
        this.state = {answers: [], testCompleted: false};
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

    shouldDisableSubmit = () => {
        return this.state.answers.length === this.state.howMany
    }

    pendingQuestionCount = () => {
        return this.state.howMany - this.state.answers.length;
    }

    submitTest = () => {
        let questions = this.state.questions;
        let test_result = this.createTestReultsObject();
        let words_of_interest = test_result.words_of_interest
        delete test_result.words_of_interest;
        console.log("submitting test....", test_result, questions, words_of_interest);
        this.pidiService.saveTestResults("pMGEJiE2LdxE3xgZMxYS", test_result, questions, words_of_interest)
        this.setState(function(prevState, props){
            return {
                testCompleted: true,
                testResult:test_result
            }
        });
    }

    createTestReultsObject = () => {
        let userAnswers = this.state.answers;
        let questions = this.state.questions;
        let totalQuestions = this.state.howMany;
        let correctCount = 0, wrongCount = 0;
        let words_of_interest = [];
        for (let i = 0; i < totalQuestions; i++) {
            if (questions[i].word.meaning === userAnswers[i]) {
                correctCount++
            } else {
                wrongCount++
                words_of_interest.push(questions[i].word);
            }
        }
        return {
            answered_right: correctCount,
            answered_wrong: wrongCount,
            number_of_questions: totalQuestions,
            taken_on: new Date(),
            words_of_interest: words_of_interest
        }
    }

    render(){
        if(!this.state.questions){
            return (
                <div>Loading Questions... Good Luck.</div>
            );
        }
        if(!this.state.testCompleted) {
            return (
                <div>
                    {/*<h4>Test your knowledge</h4>*/}
                    <Question key={this.state.questions[this.state.currentIndex]}
                              question={this.state.questions[this.state.currentIndex].word.word}
                              currSelection={this.state.answers[this.state.currentIndex]}
                              choices={this.state.questions[this.state.currentIndex].choices}
                              onAnswerSelect={this.onAnswerChanged}
                    />

                    <div className="row justify-content-center">
                        <div className="col-sm-3 col-md-3">
                            <ul className="nav nav-pills">
                                <li>
                                    <PreviousQuestion index={this.state.currentIndex}
                                                      onPreviousQuestion={this.previousQuestion}
                                    />
                                </li>
                                <li>
                                    {/*<h6><strong>{this.state.currentIndex + 1}/{this.state.howMany}</strong></h6>*/}
                                </li>
                                <li>
                                    <NextQuestion index={this.state.currentIndex}
                                                  maxQuestions={this.state.howMany}
                                                  onNextQuestion={this.nextQuestion}
                                    />
                                </li>
                                <li>
                                    <SubmitTest isDisabled={this.shouldDisableSubmit()}
                                                pendingCount={this.pendingQuestionCount()}
                                                submitHandle={this.submitTest}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div>
                    <TestWordsResults
                        userAnswers={this.state.answers}
                        testResult={this.state.testResult}
                        questions={this.state.questions}
                    />
                </div>
            );
        }
    }
}

export default TestWords;
