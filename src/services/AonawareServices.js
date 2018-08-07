var XMLParser = require('react-xml-parser');
const axios = require('axios');

import {AONAWARE_ENDPOINT} from '../Wellknown'

class AonawareServices {

    fetchWordInformation(word){
        var endpoint = AONAWARE_ENDPOINT + word;
        axios.get(endpoint)
            .then(response => {
                console.log(response);
                //var xml = new XMLParser().parseFromString(response);
                //console.log(xml);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default AonawareServices;