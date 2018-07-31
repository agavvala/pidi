import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import PreviousQuestion from './PreviousQuestion'
import NextQuestion from './NextQuestion'
import {DEFAULT_ASSESSMENT_QUESTION_COUNT, DEFAULT_USER_DOCUMENT_REFERENCE} from './Wellknown'


class NewWords extends Component {
    constructor() {
        super();
        this.pidiWebServices = new PidiWebServices();
        this.currentIndex = -1;

        this.state = {
            currentIndex: 0,
            activeWord: {word: '', meaning: ''},
            howMany: 10,
            questions: []
        };
    }

    componentDidMount() {
        this.pidiWebServices.fetchTest(DEFAULT_USER_DOCUMENT_REFERENCE, DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startLearning.bind(this))
    }

    startLearning(result) {
        console.log('START LEANING!');
        console.log(result);
        this.currentIndex = 0;
        this.setState({
            currentIndex: 0,
            howMany: result.howMany,
            questions: result.words
        });
        this.setActiveWord();
    }

    nextQuestion() {
        /*
        this.setState((prevState, props) => ({
            currentIndex: prevState.currentIndex + 1
        }));
        */
        this.currentIndex++;
        this.setActiveWord();
    }

    previousQuestion() {
        /*
        this.setState((prevState, props) => ({
            currentIndex: prevState.currentIndex - 1
        }));
        */
        this.currentIndex--;
        this.setActiveWord();
    }

    setActiveWord() {
        console.log('Active Word: '+this.currentIndex);
        console.log(this.state.questions[this.currentIndex]);

        this.setState({currentIndex: this.currentIndex, activeWord: this.state.questions[this.currentIndex]});
    }


    render() {

        if (this.state.questions.length <= 0) {
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