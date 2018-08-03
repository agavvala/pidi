import React, { Component } from 'react';

import {DEFAULT_ASSESSMENT_QUESTION_COUNT, DEFAULT_USER_DOCUMENT_REFERENCE} from './Wellknown'
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
        this.state = {answers: [], previousTest: false, testCompleted: false};
    }

    componentDidMount() {
        console.log('TESTWORDS: componentDidMount');
        console.log('Link State '); console.log(this.props.linkState);
        if (this.props.selectedUserDocumentId) {
            if (!this.props.linkState) { // if questions are not loaded yet
                console.log('TESTWORDS: No property named testQuestions so loading from the database..');
                this.pidiService.fetchTest(this.props.selectedUserDocumentId, DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startTest)
            } else if (this.props.linkState && this.props.linkState.testQuestions){
                console.log('Found questions in the context');
                this.setState( {
                    currentIndex: 0,
                    previousTest: true,
                    documentId: this.props.selectedUserDocumentId,
                    howMany: this.props.linkState.testQuestions.length,
                    questions: this.props.linkState.testQuestions
                })
            }
        } else {
            console.log('TESTWORDS: THERE IS selectedUserDocumentId in the PROPS: '+this.props.selectedUserDocumentId);
        }
    }

    startTest = (result) => {
        console.log("Question: ", result)
        // console.log("typeof Choices: ", typeof result.data[0].choices)
        // console.log("Choices: ", result.data[0].choices)
        // result.data[0].choices.map((v, i) => {console.log(v)})
        this.setState({
            currentIndex: 0,
            documentId: result.documentId,
            howMany: result.howMany,
            questions: result.words
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

        let testResultPacket = this.createTestResultPacket();

        //testResultPacket.failed_words = [ 'rye', 'abduct' ];

        this.pidiService.submitTest(this.props.selectedUserDocumentId, this.state.documentId, testResultPacket, this.onSubmittedSuccess, this.onSubmittedFailure)

    }

    onSubmittedSuccess = (testResultPacket) => {
        this.setState(function(prevState, props){
            return {
                testCompleted: true,
                testResult:testResultPacket
            }
        });
    }

    onSubmittedFailure = (errorObject) => {
        console.log('Failed : ');
        console.log(errorObject);
    }

    createTestResultPacket = () => {
        let questions = this.state.questions;
        let totalQuestions = this.state.howMany;
        let userAnswers = this.state.answers;
        let failedWords = [];
        let passedWords = [];
        console.log('User Answers: ');
        console.log(userAnswers);
        for (let i = 0; i < totalQuestions; i++) {

            if (questions[i].word.meaning == userAnswers[i]) {
                passedWords.push(questions[i].word.word);
            } else {
                failedWords.push(questions[i].word.word);
            }
        }
        return {
            failed_words: failedWords,
            passed_words: passedWords
        }
    }

    previousTest() {
        if (this.state.previousTest) {
            return <div class="text-primary">Repeating a Previous Test<br/><br/></div>
        } else {
            return <div></div>;
        }
    }

    render(){
        if (!this.props.selectedUserDocumentId) {
            return (
                <div>Please go to "Who Are You?" and select the user name first.</div>
            );
        } else  if (!this.state.questions) {
            return (
                <div>loading...</div>
            );
        }
        if(!this.state.testCompleted) {
            //console.log('Questions ARRAY');
            //console.log(this.state.questions);
            //console.log('Current Index: '+this.state.currentIndex);
            //console.log('WORD at current index: '+this.state.questions[this.state.currentIndex].word);
            return (
                <div className="row">

                    {this.previousTest()}

                    <div className="parent">
                        <PreviousQuestion index={this.state.currentIndex}
                                          onPreviousQuestion={this.previousQuestion}
                        />
                    </div>
                    <div id="questionBox">
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
                                    <SubmitTest isDisabled={this.shouldDisableSubmit()}
                                                pendingCount={this.pendingQuestionCount()}
                                                submitHandle={this.submitTest}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>
                    <div className="parent">
                        <NextQuestion index={this.state.currentIndex}
                                      maxQuestions={this.state.howMany}
                                      onNextQuestion={this.nextQuestion}
                        />
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