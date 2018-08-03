import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import './App.css';
import PidiWebServices from './services/pidi_webservices.js';

import {
    Route,
    NavLink,
    HashRouter
} from 'react-router-dom';

import NewWords from './NewWords.js';
import TestWords from './TestWords.js';
import FlashCardReview from './FlashCardReview.js';
import SelectUser from './SelectUser.js';
import ReportCard from './ReportCard.js';

class App extends Component {
    constructor() {
        super();
        this.state = {};
        this.pidiWebServices = new PidiWebServices();
        this.testWords = {};
    }


    componentDidMount(){
        //console.log('Getting random words');
        //this.pidiWebServices.fetchTest(10, this.loadTest.bind(this));
    }

    loadTest(test) {
        //1this.testWords = test;
        //console.log(this.testWords);
    }

    onSelectUser = (e, documentId, userName) => {
        this.setState( {
            selectedUserDocumentId : documentId,
            selectedUserName: userName
        })
    }

    welcomeUser = () => {
        if (this.state.selectedUserName) {
            return <div className="text-warning">Welcome {this.state.selectedUserName}!</div>

        } else {
            return <div>&nbsp;</div>
        }
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pidi</h1>

        </header>
          <HashRouter>
            <div>
              <div>
                  <div className="welcome">
                      {this.welcomeUser()}
                  </div>
                <ul className='header'>
                    <li> <NavLink to="/SelectUser">Who Are You?</NavLink></li>
                    <li> <NavLink to="/NewWords">Learn New Words</NavLink></li>
                    <li> <NavLink to="/TestWords">Test Words</NavLink></li>
                    <li> <NavLink to="/FlashCardReview">Flash Cards</NavLink></li>
                    <li> <NavLink to="/ReportCard">Report</NavLink></li>
                </ul>
              </div>
              <div className="content">
                    <Route path="/SelectUser"  render={props => (
                            <SelectUser selectedUserDocumentId={this.state.selectedUserDocumentId} onSelectUser={this.onSelectUser} />
                        )}/>
                  <Route path="/NewWords"  render={props => (
                      <NewWords selectedUserDocumentId={this.state.selectedUserDocumentId}/>
                  )}/>
                  <Route path="/TestWords"  render={props => (
                      <TestWords selectedUserDocumentId={this.state.selectedUserDocumentId} linkState={props.location.state}/>
                  )}/>
                  <Route path="/FlashCardReview"  render={props => (
                      <FlashCardReview selectedUserDocumentId={this.state.selectedUserDocumentId}/>
                  )}/>
                  <Route path="/ReportCard"  render={props => (
                      <ReportCard selectedUserDocumentId={this.state.selectedUserDocumentId}/>
                  )}/>
              </div>
            </div>
          </HashRouter>
      </div>
    );
  }
}

export default App;
