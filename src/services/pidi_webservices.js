import firebase from './firebase.js';

class PidiWebServices {

    // get random word meanings
    // skipIndex - will avoid words that have been seen
    getChoices(howMany, allWords, skipIndex) {
        var collectedSoFar = 0;
        var choices = [];

        while (collectedSoFar < howMany) {
            var randomIndex = Math.floor(Math.random() * allWords.length);
            if (randomIndex !== skipIndex) { // avoid this word meaning
                choices.push( allWords[randomIndex].meaning );
                collectedSoFar++;
            }
        }

        return choices;
    }

    //
    // shuffle an array
    //
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
        return array;
    }

    /*
        Get random "n" test questions.
        Invoke the load test callback
     */
    fetchTest(howMany, loadDataSet) {
        var firestore = firebase.firestore();
        firestore.settings({timestampsInSnapshots: true}); // this will fetch the timestamps in right format
        var wordsCollection = firestore.collection('words');

        var allWords = [];
        var randomWords = [];

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

                var choices = this.getChoices(3, allWords, randomIndex); // get 3 random choices
                choices.push( allWords[randomIndex].meaning );

                randomWords.push( { word: allWords[randomIndex], choices: this.shuffleArray(choices) } );
                seen[randomIndex] = randomIndex;
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