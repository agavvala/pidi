import React, { Component } from 'react';
import PidiWebServices from "./services/pidi_webservices";
import {DEFAULT_ASSESSMENT_QUESTION_COUNT, DEFAULT_USER_DOCUMENT_REFERENCE} from './Wellknown'


class UserName extends Component {
    constructor(props) {
        super(props);
    }

    getName() {
        if (this.props.user && this.props.selectedUser && (this.props.user.documentId == this.props.selectedUser.documentId)) {
            return <div><i className="icon-ok-sign"></i> <h3 className="btn btn-success">{this.props.user.name} </h3></div>
        } else {
            return <h3><a className=" btn btn-primary" onClick={(e) => this.props.onSelectUser(e, this.props.user.documentId, this.props.user.name)}>{this.props.user.name}</a></h3>
        }
    }


    render() {
        return (
            this.getName()
        )
    }
}

export default UserName;
