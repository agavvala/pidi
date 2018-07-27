import React, {Component} from 'react'

class SubmitTest extends Component{
    constructor(props){
        super(props)
    }

    render(){
        // console.log("disabled: ", this.props.isDisabled)
        return(
            <button className='button btn btn-primary' disabled={!this.props.isDisabled}
                    onClick={this.props.submitHandle}>Submit ({this.props.pendingCount} left )</button>
        );
    }
}

export default SubmitTest;