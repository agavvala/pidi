const request = require('request');
const parseString = require('xml2js').parseString;
import {AONAWARE_ENDPOINT} from '../Wellknown'

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
}

export default AonawareServices;