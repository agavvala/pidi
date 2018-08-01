import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import PreviousQuestion from './PreviousQuestion'
import NextQuestion from './NextQuestion'
import {DEFAULT_ASSESSMENT_QUESTION_COUNT} from './Wellknown'

class FlashCardReview extends Component {
    constructor() {
        super();
        this.pidiWebServices = new PidiWebServices();

        this.state = {};
    }

    componentDidMount() {
        this.pidiWebServices.fetchFlashcards(DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startLearning.bind(this))
    }

    startLearning(result) {
        var state = {
            currentIndex: 0,
            howMany: result.howMany,
            questions: result.data,
            activeWord: result.data[0]
        };

        console.log('FLASHCARDS');
        console.log(result.data);
        this.setState( state );
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

    getImageUrl() {
        return 'https://s3.amazonaws.com/aditya.gavvala.com/pidi/flashcards/' + this.state.activeWord.word.flashcard;
    }


    render() {

        if (!this.props.selectedUserDocumentId) {
            return (
                <div>Please go to "Who Are You?" and select the user name first.</div>
            );
        } else  if (!this.state.questions) {
            return (
                <div>loading...</div>
            );
        } else {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>{this.state.currentIndex + 1}</h2>
                        </div>
                    </div>
                    <div className="row mt-5 mb-5">
                        <div className="col-3 justify-content-lg-end">
                            <PreviousQuestion index={this.state.currentIndex}
                                              onPreviousQuestion={this.previousQuestion.bind(this)}
                            />
                        </div>
                        <div className="col-6">
                            <img height="90%" width="90%" src={this.getImageUrl()}></img>
                        </div>
                        <div className="col-3 justify-content-lg-start">
                            <NextQuestion index={this.state.currentIndex}
                                          maxQuestions={this.state.howMany}
                                          onNextQuestion={this.nextQuestion.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default FlashCardReview;