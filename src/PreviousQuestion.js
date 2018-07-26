
import React, {Component} from 'react'

class PreviousQuestion extends Component{
    constructor(props){
        super(props)
    }

    render(){
        // console.log("Previous Button:", this.props.index)
        if(this.props.index  < 1){
            return null;
        }
        return(
            <button className='button btn btn-primary' onClick={this.props.onPreviousQuestion}>&lt;</button>
        );
    }
}

export default PreviousQuestion;