import React, {Component} from 'react'
import './results.css'
class TestWordsResults extends Component {
    constructor(props) {
        super(props)
    }

    result = () => {
        const test_results= this.props.testResult;
        console.log('TEST Results: ');
        console.log(test_results);
        let failedWordCount = test_results.failed_words.length;
        let passedWordCount = test_results.passed_words.length;
        let percent =  (passedWordCount/(passedWordCount+failedWordCount))*100;
        console.log(percent);
        if(percent === 100){
            return "Awesome Job!"
        }else if(percent > 80){
            return "Good Job!"
        }else if(percent > 70){
            return "You can do better..."
        }else{
            return "You need more practice..."
        }
    }

    failed = () => {
        const answers = this.props.userAnswers
        const questions = this.props.questions;
        let result = [];
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].word.meaning !== answers[i]) {
                result.push(<li>Word: <strong>{questions[i].word.word}</strong>, <br/>
                    correct meaning: <strong className="green">{questions[i].word.meaning} </strong><br/>
                    and you chose: <strong className="red">{answers[i]}</strong></li>)
            }
        }
        console.log(result.toString())
        return result
    }

    render(){
        return(
            <div>
                <h4>{this.result()}</h4>
                <ul>
                    {this.failed().map(function(d, idx){
                        return (d)
                    })}
                </ul>


            </div>
        );
    }
}

export default TestWordsResults;