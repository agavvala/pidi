import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import PreviousQuestion from './PreviousQuestion'
import NextQuestion from './NextQuestion'
import {DEFAULT_ASSESSMENT_QUESTION_COUNT} from './Wellknown'


class NewWords extends Component {
    constructor() {
        super();
        this.pidiWebServices = new PidiWebServices();

        this.state = {
            currentIndex: -1,
            activeWord: {word: '', meaning: ''},
            howMany: 10
        };
    }

    componentDidMount() {
        this.pidiWebServices.fetchTest(DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startLearning.bind(this))
    }

    startLearning(result) {
        this.setState({
            currentIndex: 0,
            howMany: result.howMany,
            questions: result.data
        });
        this.setActiveWord();
    }

    nextQuestion() {
        this.setState((prevState, props) => ({
            currentIndex: prevState.currentIndex + 1
        }));
        this.setActiveWord();
    }

    previousQuestion() {
        this.setState((prevState, props) => ({
            currentIndex: prevState.currentIndex - 1
        }));
        this.setActiveWord();
    }

    setActiveWord() {
        console.log('Active Word: ' + this.state.questions[this.state.currentIndex]);
        this.setState({activeWord: this.state.questions[this.state.currentIndex]});
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
