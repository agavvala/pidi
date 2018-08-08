
import PidiWebServices from './pidi_webservices'
import {AONAWARE_ENDPOINT} from '../Wellknown'

const request = require('request');
const parseString = require('xml2js').parseString;

class AonawareServices {
    fetchWordInformation(word){
        const endpoint = AONAWARE_ENDPOINT + word;
        request(endpoint, (err, res, body) => {
            if (err) { return console.log(err); }
            //console.log(body);
            let wordDefinitions = []
            parseString(body, function (err, result) {
                // console.log(result)
                result.WordDefinition.Definitions.forEach(e => {
                    e.Definition.forEach(ed => {
                        // console.log(ed.WordDefinition)
                        wordDefinitions.push(ed.WordDefinition)
                    })
                })
            });
            console.log(wordDefinitions)
            return wordDefinitions;
        });
    }

    loadExtendedWordDefinitions(){
        let pidi = new PidiWebServices()
        let db = pidi.getFirestore();
        let allWords = db.collection("words");
        allWords.get().then( allWordsSnapshot => {
            allWordsSnapshot.forEach( wordDocument => {
                let word = wordDocument.data();
                let extendedWordDefinitions = this.fetchWordInformation(word.word)
                console.log(extendedWordDefinitions)
            })
        }).then( ref => {
        })

    }
}

export default AonawareServices;