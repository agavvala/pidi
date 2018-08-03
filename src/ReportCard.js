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
        }
    }

    onPastTestDataLoad = (testObjectArray) => {
        console.log('Loading past tests..');
        console.log(testObjectArray);
        this.setState( {
            testObjectArray: testObjectArray
        });
    }

    testHTML(testObject, index) {
        console.log(index);
        console.log(testObject.words);
        let dateOptions = { hour: 'numeric', minute: 'numeric' };
        return (
                <div className="row m-1">
                    <div className="col-sm-1 ">
                        {index+1}.
                    </div>
                    <div className="col-3 ">
                        <span className="font-italic text-primary">{testObject.submittedAt.toDate().toLocaleDateString('en-US', dateOptions)}</span>
                    </div>
                    <div className="col-2  font-weight-bold">
                        <Link to={{
                            pathname: '/TestWords',
                            search: '',
                            hash: '',
                            state: { testQuestions:  testObject.words }}}>
                        {testObject.howMany} WORD TEST
                       </Link>
                    </div>
                    <div className="col-3 ">
                        <span className="font-italic text-danger">{testObject.answered_correct}</span>  out of {testObject.howMany}
                    </div>
                </div>
        );
    }

    render() {
        if (!this.props.selectedUserDocumentId || !this.state.testObjectArray) {
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
                                <div className="container ">
                                    {   this.state.testObjectArray.map( (testObject, index) => this.testHTML(testObject, index) ) }
                                </div>
                            </div>
                            <div className="col-6">
                            </div>
                        </div>
                    </div>
                );
        }
    }


}

export default ReportCard;