import React, { Component } from 'react';

import {DEFAULT_ASSESSMENT_QUESTION_COUNT} from './Wellknown'
import PidiWebServices from './services/pidi_webservices'


class TestWords extends Component {
    pidiService = new PidiWebServices()
    constructor(props){
        super(props);
        //this.state = {currentQuestion: null};
    }

    componentDidMount() {
        this.pidiService.fetchTest(DEFAULT_ASSESSMENT_QUESTION_COUNT, this.startTest)
    }

    startTest = (result) => {
        this.setState({
            currentQuestion: result.data[0]
        });
    }
    render(){
        return(
            <div>
                <h2>Test your knowledge</h2>
                <h4>Number of questions: {DEFAULT_ASSESSMENT_QUESTION_COUNT}</h4>
            </div>
        );
    }
}

export default TestWords;
