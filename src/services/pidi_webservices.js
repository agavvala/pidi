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
                choices.push(allWords[randomIndex].meaning);
                collectedSoFar++;
            }
        }

        return choices;
    }

    getFirestore() {
        let db = firebase.firestore();
        db.settings({timestampsInSnapshots: true}); // this will fetch the timestamps in right format
        return db;
    }

    //
    // submitTest will
    // update the test document
    //      changes the status from 'pending' to 'completed'
    //      updates the answered_correct: and answered_wrong: and submittedAt:
    //
    // for each failed word
    //      find the words_of_interest that matches the incorrect_word. insert if not found one
    //          update attempts_wrong: ++
    //          last_updated: to now
    //
    // for each passed word
    //      find the words_of_interest that matched the correct_word. DO NOT insert if not found
    //          update attempts_correct: ++
    //          last_updated: to now
    //
    // @userDocumentReferenceKey : the document id for /users/xxx example: pX12345jHT corresponding to Ria
    // @testDocumentReferenceKey: the document id for /users/pX12345jHT/tests/xxx example: jTPOsfTE for one of the tests in the test collection
    // @testResultPacket: a temporary data structure that looks like this:
    //
    //  { failed_words: [x, y, z], passed_words: [a, b] }
    //
    // @afterSubmitted: a callback to call after the submission is complete
    // @onFailedToUpdate: a callback for any errors
    //
    submitTest(userDocumentReferenceKey, testDocumentReferenceKey, testResultPacket, afterSubmitted, onFailedToUpdate) {
        let firestore = this.getFirestore();
        let submittedAt = new Date();
        let testDocumentReference = firestore.collection('/users/'+userDocumentReferenceKey+'/tests').doc(testDocumentReferenceKey);
        //console.log('TEST Results Packet');
        //console.log(testResultPacket);

        // update the test object as specified
        testDocumentReference.set( {
            status: 'completed',
            answered_correct: testResultPacket.failed_words.length,
            answered_wrong: testResultPacket.passed_words.length,
            submittedAt: submittedAt
        }, {merge: true}).then( ref => {
            // handle all failed words
            testResultPacket.failed_words.forEach( word => {
                let wordsOfInterestCollectionReference = firestore.collection('/users/'+userDocumentReferenceKey+'/words_of_interest');
                //console.log(wordsOfInterestCollectionReference);
                let theWordExits = false;
                wordsOfInterestCollectionReference.where('word', '==', word).get().then( wordOfInterestSnapshot => {
                    if (wordOfInterestSnapshot.exists) {
                        let theWord = wordOfInterestSnapshot.data();
                        wordOfInterestSnapshot.ref.set({
                            failed_count: theWord.failed_count + 1,
                            last_updated: submittedAt
                        }, {merge: true}); // update the failed count
                        theWordExits = true;
                    }
                }).then( ref => {
                        if (!theWordExits) {
                            wordsOfInterestCollectionReference.add( {word: word, failed_count: 1, last_updated: submittedAt} );
                        }
                })
            })
        }).then( ref => {
            // handle all passed words
            testResultPacket.passed_words.forEach( passedWord => {
                let wordsOfInterestCollectionReference = firestore.collection('/users/'+userDocumentReferenceKey+'/words_of_interest');
                wordsOfInterestCollectionReference.where('word', '==', passedWord).get().then( wordOfInterestSnapshot => {
                    if (wordOfInterestSnapshot.exists) {
                        let theWord = wordOfInterestSnapshot.data();
                        if (!theWord.passed_count) {
                            theWord.passed_count = 0;
                        }
                        wordOfInterestSnapshot.ref.set({passed_count: theWord.passed_count+1, last_updated: submittedAt}, {merge: true}); // update the failed count
                    } // we dont need to worry about else portion since this is a passed word
                })

            })
        }).then( ref => {
            console.log('Successfully updated')
            afterSubmitted(testResultPacket);
        }).catch(error => {
            console.log('Error updating..');
            onFailedToUpdate(testResultPacket);
        })
    }

    /*
    saveTestResults = (user_pk, test_result, questions, words_of_interest) => {

        let userReference = db.collection("users").doc(user_pk);
        let testReferece = userReference.collection("tests");
        testReferece.add(test_result).then(testReference => {
            let questionReference = testReference.collection('questions');
            questions.forEach(word => questionReference.add(word));
        });
        let db_woi = userReference.collection('words_of_interest');
        words_of_interest.forEach(woi => {
            db_woi.where('word', '==', woi.word)
                .onSnapshot(function (querySnapshot) {
                    if (querySnapshot.size > 0) {
                        console.log("error  before...")
                        querySnapshot.forEach(function (doc) {
                            console.log(doc)
                            //TODO: update the failed_count by one and last_failed_on timestamp
                        });
                    } else {
                        console.log("first time error...")
                        db_woi.add({
                            failed_count: 1,
                            last_failed_on: new Date(),
                            word: woi.word,
                            word_ref: woi
                        })
                    }
                });
        })
    }
    */
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
    fetchTest(userDocumentReferenceKey, howMany, loadDataSet) {
        var firestore = firebase.firestore();
        firestore.settings({timestampsInSnapshots: true}); // this will fetch the timestamps in right format
        var wordsCollection = firestore.collection('words');

        // does the user already have a pending test?
        let userDocumentReference = firestore.collection("users").doc(userDocumentReferenceKey);
        let testCollectionReference = userDocumentReference.collection("tests");
        let existingPendingTest = false;


        testCollectionReference.where('status', '==', 'pending').get().then(snapshot => {
            snapshot.forEach(testObject => {
                console.log('Found AN EXISTING one');

                existingPendingTest = true;
                var testDataStrcuture = testObject.data();
                testDataStrcuture.documentId = testObject.id;
                loadDataSet(testDataStrcuture);
            })
        }).then(snapshot => {
            if (!existingPendingTest) {
                console.log('Did not find an existing test');
                var allWords = [];
                var randomWords = [];

                wordsCollection.where('meaning', '>', '').get().then(snapshot => {
                    snapshot.forEach(wordObject => {
                        allWords.push(wordObject.data());
                    })
                }).then(snapshot => {
                    var collectedSoFar = 0;
                    var seen = {};
                    while (collectedSoFar < howMany) {
                        var randomIndex = Math.floor(Math.random() * allWords.length);
                        if (!seen[randomIndex]) {

                            var choices = this.getChoices(3, allWords, randomIndex); // get 3 random choices
                            choices.push(allWords[randomIndex].meaning);

                            randomWords.push({word: allWords[randomIndex], choices: this.shuffleArray(choices)});
                            seen[randomIndex] = randomIndex;
                            collectedSoFar++;
                        }
                    }
                }).then(snapshot => {
                    var testDataObject = {status: 'pending', howMany: howMany, words: randomWords, lastAttempted: new Date()};
                    this.saveNewTest(userDocumentReferenceKey, testDataObject).then(testDataReference => {
                        testDataObject.documentId = testDataReference.id;
                        loadDataSet(testDataObject);
                    })
                });

            }});


    }

    /*
     * Save the test for user
     *
     */
    saveNewTest(userDocumentReferenceKey, testDataObject) {

        let db = firebase.firestore();
        db.settings({timestampsInSnapshots: true}); // this will fetch the timestamps in right format

        let userDocumentReference = db.collection("users").doc(userDocumentReferenceKey);
        let testCollectionReference = userDocumentReference.collection("tests");
        return testCollectionReference.add(testDataObject);
        /*
        testReferece.add(test_result).then(testReference => {
            let questionReference = testReference.collection('questions');
            questions.forEach(word => questionReference.add(word));
        });*/

    }
}

export default PidiWebServices;