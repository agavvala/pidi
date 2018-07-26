
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
            <button onClick={this.props.onPreviousQuestion}>Previous Question</button>
        );
    }
}

export default PreviousQuestion;