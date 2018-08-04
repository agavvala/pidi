import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import {DEFAULT_PAST_TEST_COUNT} from './Wellknown';
import {
    Route,
    Link,
    HashRouter
} from 'react-router-dom';



class ReportCard extends Component {
    constructor(props){
        super(props);
        this.pidiWebServices = new PidiWebServices();

        this.state = { };

    }

    componentDidMount() {
        if (this.props.selectedUserDocumentId) {
            this.pidiWebServices.fetchMostRecentTests(this.props.selectedUserDocumentId, DEFAULT_PAST_TEST_COUNT, this.onPastTestDataLoad);
            this.pidiWebServices.fetchWordsOfInterest(this.props.selectedUserDocumentId, this.onWordsOfInterestDataLoad);
        }
    }

    onPastTestDataLoad = (testObjectArray) => {
        console.log('Loading past tests..');
        console.log(testObjectArray);
        this.setState( {
            testObjectArray: testObjectArray
        });
    }

    onWordsOfInterestDataLoad = (wordsOfInterestObjectArray) => {
        console.log('Loading words of interest..');
        console.log(wordsOfInterestObjectArray);
        this.setState( {
            wordsOfInterestObjectArray: wordsOfInterestObjectArray
        });
    }


    testHTML(testObject, index) {
        console.log(index);
        console.log(testObject.words);
        let dateOptions = { hour: 'numeric', minute: 'numeric' };
        return (
                <div className="row m-1">
                    <div className="col-1 ">
                        {index+1}.
                    </div>
                    <div className="col-3 ">
                        <span className="font-italic text-primary text-left float-left">{testObject.submittedAt.toDate().toLocaleDateString('en-US', dateOptions)}</span>
                    </div>
                    <div className="col-4  font-weight-bold text-left float-left">
                        <Link to={{
                            pathname: '/TestWords',
                            search: '',
                            hash: '',
                            state: { testQuestions:  testObject.words, testDocumentId: testObject.documentId }}}>
                        {testObject.howMany} WORD TEST
                       </Link>
                    </div>
                    <div className="col-4  text-left float-left">
                        <span className="font-italic text-danger">{testObject.answered_correct}</span>  out of {testObject.howMany}
                    </div>
                </div>
        );
    }

    wordOfInterestHTML(wordOfInterestObject, index) {
        console.log(index);
        console.log(wordOfInterestObject);
        let dateOptions = { hour: 'numeric', minute: 'numeric' };
        return (
            <div>
                <div className="row m-1">
                    <div className="col-1 ">
                        {index+1}.
                    </div>
                    <div className="col-3 ">
                        <span className="font-weight-bold text-danger text-left float-left">{wordOfInterestObject.word}</span>
                    </div>
                    <div className="col-4 font-italic  text-left float-left">
                        {wordOfInterestObject.last_updated.toDate().toLocaleDateString('en-US', dateOptions)}
                    </div>
                    <div className="col-4` text-left float-left ">
                        <span className="text-danger">{wordOfInterestObject.failed_count}</span>
                    </div>
                </div>
                <div className="row m-1">
                    <div className="col-1 ">
                    </div>
                    <div className="col-11 text-left">
                        <span className="font-weight-normal text-info text-justify">{wordOfInterestObject.meaning}</span>
                    </div>
                </div>
            </div>
        );
    }


    render() {
        if (!this.props.selectedUserDocumentId || !this.state.testObjectArray || !this.state.wordsOfInterestObjectArray) {
            return (
                <div>Please go to "Who Are You?" and select the user name first.</div>
            );
        } else if (this.state.testObjectArray.length <= 0) {
            return <div>It does not appear you have taken any tests so far?</div>
        } else {
                return (
                    <div className="container">

                        <div className="row">
                            <div className="col-10">
                                <h3>Previous Tests</h3>
                                <div className="container ">
                                    {   this.state.testObjectArray.map( (testObject, index) => this.testHTML(testObject, index) ) }
                                </div>
                            </div>
                        </div>

                        <div className="row mt-lg-5">
                            <div className="col-10">
                                <h3>Words of Interest</h3>
                                <div className="container ">
                                    {   this.state.wordsOfInterestObjectArray.map( (wordOfInterestObject, index) => this.wordOfInterestHTML(wordOfInterestObject, index) ) }
                                </div>
                            </div>
                        </div>

                    </div>

                );
        }
    }


}

export default ReportCard;