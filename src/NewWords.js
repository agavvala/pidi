import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import PreviousQuestion from './PreviousQuestion'
import NextQuestion from './NextQuestion'
import {DEFAULT_ASSESSMENT_QUESTION_COUNT, DEFAULT_USER_DOCUMENT_REFERENCE} from './Wellknown'


class NewWords extends Component {
    constructor() {
        super();
        this.pidiWebServices = new PidiWebServices();

        this.state = { };
    }

    componentDidMount() {
        this.pidiWebServices.fetchTest(DEFAULT_USER_DOCUMENT_REFERENCE, DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startLearning.bind(this))
    }

    startLearning(result) {
        console.log('START LEANING!');
        console.log(result);

        this.setState({
            currentIndex: 0,
            howMany: result.howMany,
            questions: result.words,
            activeWord: result.words[0]
        });
    }


    nextQuestion() {
        this.setActiveWord( this.state.currentIndex + 1);
    }

    previousQuestion() {
        this.setActiveWord( this.state.currentIndex - 1);
    }

    setActiveWord(theIndex) {
        console.log('Active Word: ' + this.state.questions[theIndex]);
        this.setState({activeWord: this.state.questions[theIndex], currentIndex: theIndex });
    }




    render() {

        if (!this.state.questions) {
            return (
                <div>loading...</div>
            );
        } else {

            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>{this.state.currentIndex + 1}. {this.state.activeWord.word.word}</h2>
                        </div>
                    </div>
                    <div className="row">
                    </div>
                    <div className="row mt-5 mb-5">
                        <div className="col-3 justify-content-lg-end">
                            <PreviousQuestion index={this.state.currentIndex}
                                              onPreviousQuestion={this.previousQuestion.bind(this)}
                            />
                        </div>
                        <div className="col-6">{this.state.activeWord.word.meaning}</div>
                        <div className="col-3 justify-content-lg-start">
                            <NextQuestion index={this.state.currentIndex}
                                          maxQuestions={this.state.howMany}
                                          onNextQuestion={this.nextQuestion.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="row">
                    </div>
                </div>
            );
        }
    }
}


export default NewWords;