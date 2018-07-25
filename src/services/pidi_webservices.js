import firebase from './firebase.js';

class PidiWebServices {
    /*
        Get random "n" test questions.
        Invoke the load test callback
     */
    fetchTest(howMany, loadDataSet) {
        var firestore = firebase.firestore();
        firestore.settings({timestampsInSnapshots: true}); // this will fetch the timestamps in right format
        var wordsCollection = firestore.collection('words');

        var allWords = new Array();
        var randomWords = new Array();

        wordsCollection.where('meaning', '>', '').get().then( snapshot => {
            snapshot.forEach( wordObject => {
            allWords.push( wordObject.data() );
    })
    })
    .then( snapshot => {
            var collectedSoFar = 0;
        var seen = {};
        while ( collectedSoFar < howMany ) {
            var randomIndex = Math.floor(Math.random() * allWords.length);
            if (!seen[randomIndex]) {
                randomWords.push( allWords[randomIndex] );
                collectedSoFar++;
            }
        }
    })
    .then( snapshot => {
            loadDataSet({ howMany: howMany, data: randomWords });
    });

    }
}

export default PidiWebServices;