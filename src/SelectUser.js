import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import {DEFAULT_ASSESSMENT_QUESTION_COUNT, DEFAULT_USER_DOCUMENT_REFERENCE} from './Wellknown'
import UserName from './UserName.js'
import AonawareServices from './services/AonawareServices'
class SelectUser extends Component {
    constructor() {
        super();
        this.pidiWebServices = new PidiWebServices();
        this.aonawareServices = new AonawareServices();
        this.state = { };
    }

    componentDidMount() {
        this.pidiWebServices.getUsers(this.onUserDataAvailable);
    }

    onUserDataAvailable = userList => {
        console.log('User List Loaded');
        console.log(userList);

        this.setState({
            userList: userList
        });

        console.log('Parent passed a selected user id: '+this.props.selectedUserDocumentId);

        if (this.props.selectedUserDocumentId) {
           this.setSelectedUser(this.props.selectedUserDocumentId)
        }

    }

    setSelectedUser = (documentId) => {
        let selectedUser = this.state.userList.find( (userObject) => userObject.documentId == documentId );
        this.setState( {
            selectedUser: selectedUser
        });
    }

    onSelectUser = (e, documentId, userName) => {
        this.setSelectedUser(documentId);
     //   console.log('Props');
     //   console.log(this.props.onSelectUser);
        this.props.onSelectUser(e, documentId, userName); // pass it parent as well
    }

    loadData = () => {
        console.log('loading....')
        this.aonawareServices.loadExtendedWordDefinitions()
    }


    render() {

        if (!this.state.userList) {
            return (
                <div>loading...</div>
            );
        } else {

            return (
                <div className="container">
                    {
                        this.state.userList.map( user => (
                            //console.log('User: '+user.name);
                            <div className="row">
                                <div className="col-12">
                                    <UserName user={user} selectedUser={this.state.selectedUser} onSelectUser={this.onSelectUser}/>
                                </div>
                            </div>
                        ))
                    }
                    {/*<button onClick={this.loadData}>Load Data</button>*/}
                </div>

            );
        }
    }
}


export default SelectUser;