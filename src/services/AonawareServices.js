
import {AONAWARE_ENDPOINT} from '../Wellknown'

class AonawareServices {

    fetchWordInformation(word){
        var endpoint = AONAWARE_ENDPOINT + word;
        fetch(endpoint, {
            method: 'get'
        }).then(function(response) {
            console.log(response)
        }).catch(function(err) {
            // Error :(
            console.error(err)
            return{
                isError: true,
                errorMessage: err
            }
        });
    }
}

export default AonawareServices;