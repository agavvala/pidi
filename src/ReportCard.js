import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import {DEFAULT_PAST_TEST_COUNT} from './Wellknown'



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

    render() {
        if (!this.props.selectedUserDocumentId || !this.state.testObjectArray) {
            return (
                <div>Please go to "Who Are You?" and select the user name first.</div>
            );
        } else {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <div className="container">
                                {   this.state.testObjectArray.map( (testObject, index) => {
                                    <div className="row">
                                        <div className="col-1">
                                            {index+1}.
                                        </div>
                                        <div className="col-5">
                                            Test taken on {testObject.submittedAt}. {testObject.answered_correct} / {testObject.howMany}
                                        </div>
                                    </div>

                                    })
                                }
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