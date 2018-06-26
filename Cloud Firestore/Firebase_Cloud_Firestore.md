# A Very Short Book About Firebase Cloud Firestore

Most of Firebase Cloud Firestore is easy to use. This very short book will concentrate on the hard parts.

## Who Is This Very Short Book For?

I'm writing this for Firebase Realtime Database users who are refactoring their code and migrating their database over to Firebase Cloud Firestore. I show code from my project, LanguageTwo.com, first the old Realtime Database code and then the new code for Cloud Firestore.

If this were a long book I would also include code from MongoDB and SQL, to show how to migrate from those databases. And I would show how to make every type of query for SQL, MongoDB, Realtime Database, and Cloud Firestore. Improved query language is the primary advantage of Cloud Firestore over Realtime Database, but I only show one simple query. I'll leave it to a database expert to write a long book!

My examples are from a web application in JavaScript with AngularJS (you'll see many variables that start with `$scope`). A long book would also have code in Swift for iOS, and in Java for Android, or in TypeScript for Angular 5. But this is what I code in.

## Why Use Cloud Firestore Instead of Realtime Database?

NoSQL database store data as JSON objects, that is, arrays and objects. A crucial but non-obvious difference between Realtime Database and Cloud Firebase is that Realtime Database works with arrays and Cloud Firestore works with objects. What this means is that every query to Realtime Database, to create, read, update, or destroy data, works with an array. You have to run `forEach` loops on the front-end to get to your objects. If your query is well-formed the array that returns should have only one object, but you still need to run that `forEach` loop. This adds code and processor time. While you can get any object your store in Realtime Database, arrays are what the database is all about.

Cloud Firestore works with objects, which are called _documents_. Every document has a unique name or ID, and your query can return a single document if that is what you want. You can also ask for a _collection_ of documents. Cloud Firestore creates and destroys collections on the fly, when you upload a document to a new collection, or delete the last document from a collection. While collections are important in Cloud Firestore, documents are what the database is all about.




1. **Improved query language.**

Realtime Database, like all NoSQL databases, stores data as JSON objects, that is, arrays and objects. Getting an array is easy, you just identify the location and Firebase sends you the array. Getting an object is harder. Realtime Database doesn't get objects, it only gets arrays. You can usually structure your query to return an array with only one element, which should be the object you want, and then write a `forEach` loop to return the element from the array. _Usually_ doesn't mean _always_. Cloud Firestore gives each document (i.e., object) a unique identifier in a collection (i.e., array), so your queries get just the document you want. This should reduce download bandwidth and processing time in your app. I doubt you'd notice a difference for a web app on a laptop computer with a broadband connection, but for mobile apps this could make a difference.

2. **Deep data structures.** When you request an array from Realtime Database, you get everything in the array. If it's 32 layers of objects and arrays, you get all 32 layers. To reduce bandwidth, Firebase recommends using a flatter ("denormalized") data structure with Realtime Database. In contrast, Cloud Firestore returns only the collection or document that you requested, so you can nest your data to your heart's content. If you make a mistake in a `delete()` command, Realtime Database can wipe out all your data. Cloud Firestore only deletes documents one at a time, and deleting a collection leaves the documents and subcollections. We'll see that this can be a problem, but it could also save you from costly mistakes (or maybe hacking).

![XKCD "Drop Table"](Screenshots/xkcd-drop_table "XKCD drop_table")

3. **Semantic location IDs.** What motivated me to refactor my project from Realtime Database to Cloud Firestore was that one day I was staring at a column of ID locations for objects. Each ID looked like `-KloeQHDC-mugPjJMAG4`, `-KloebJHyCdRU7h_QE-4`, etc. I also had arrays with semantic names, such as `War_and_Peace_Characters` (a very large array). And I had arrays in which each element had a number, starting with `0` of course. I was pondering which of these three ways of naming was best for the various arrays and objects in the project. I wanted to make writing queries easier. Then I remembered that Cloud Firestore pushes you to use semantic names for almost everything. I could have refactored my Realtime Database code to use more semantic names, but I decided instead to refactor for Cloud Firestore.

![Firebase Realtime Database](Screenshots/RTDB "Firebase Realtime Database")

There are other advantages of Cloud Firestore. I'm keeping this book very short, so you can read about these advantages in the [documentation](https://firebase.google.com/docs/database/rtdb-vs-firestore) and [blog post](https://firebase.googleblog.com/2017/10/cloud-firestore-for-rtdb-developers.html).

A good database is the foundation of any project. Problems with a database ripple out through the rest of a codebase. There's no perfect database, but Cloud Firestore comes closer than any database I've used.

### Why Not To Use Cloud Firestore

You'll see that adding and deleting data in Cloud Firestore is more complicated, with more code. Getting data is a easier, and updating is almost the same. Most apps mostly get or update data, and don't do a lot of adding or deleting data, so even though you might be writing more code, your app should run better with Cloud Firestore.

Also, Cloud Firestore is in beta. Not everything works as expected. For example, I like how the Realtime Database console updates when my app changes data. Cloud Firestore sometimes updates the console, but other times nothing happens and you have to refresh the view or click around to see your new data. Sometimes the console shows phantom collections or documents, or blanks where there should be a something. One afternoon the console wouldn't show any of my collections or documents.

## Why Use Firebase instead of SQL, MongoDB, etc.?

1. **Realtime synchronized data.** Firebase can synchronize data between the database and the app. Let's say that you order a pizza. The pizzeria has an app for you to watch their driver getting closer to your house. Every few seconds the icon of the pizza van moves a little closer on the map. With older databases, such as SQL or MongoDB, the app would have to send an HTTP request to the server, which would send another HTTP request to the driver, whose phone would send back an HTTP response, etc. If the driver stops at a red light, you're using up bandwidth and not seeing the driver moving. If you don't send HTTP requests every second, your driver's progress on the map looks jerky.

Firebase allows _listeners_ which notify your app when the data on the server changes (you watching the driver). The listeners also notify the server when the data on the app changes (the driver's phone moving). RethinkDB is another modern database that is built around subscriptions.

For my graduation project at the Galvanize coding bootcamp I built a JavaScript app that synchronized a tic-tac-toe game between two computers, via the Firebase cloud.

2. **Rapid project development.** Firebase comes with an easy-to-use OAuth2 login package, plus packages for advertising and other stuff. I also like having the backend in the cloud, so I don't have to deal with a server.

A client asked me to write the front end for his startup. The CTO told me that the database would one day have as many as 5,000 records. Each record would have as many as seven fields. I said that I could have his startup ready to launch in two or three weeks, front end and back end, if I used Firebase. He googled Firebase vs SQL and found a blog post saying that Firebase's queries were inferior to SQL. This is true, at least for Realtime Database, but this only matters if you're doing Big Data. The CTO said that his startup was Big Data. I politely suggested that the line between Big Data and little data lies a bit higher, maybe somewhere north of a million records. He hired another coder to write the back end, using MySQL and Java. I asked which OAuth2 package we would buy for the login. The CTO said that his users (who were _business_ users, he frequently reminded me) didn't need Google or Facebook login, we would just write email and password login. I politely explained that email and password login requires a lot more code than OAuth2 login, and expecting two junior developers to do his security was asking for trouble. This went on for a month, with the project sliding backwards. One day I told him that another local coding bootcamp's graduation was the following day and he could hire a junior developer there to replace me, and I quit. The point is that if you're working with a bazillion records, you need SQL. But most projects are easier to develop with a NoSQL cloud database such as Firebase.

### Updating Firebase

Updating Firebase is a two-step process. I update all my software every week.

1. Update the Firebase JavaScript SDK. Find the latest version at

```
https://firebase.google.com/support/release-notes/js
```

Then open your `index.html` file and update these lines. Update both lines:

```HTML  
<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase-firestore.js"></script>
```

2. Update the Firebase Tools CLI Node module. Find the latest version at

```
https://www.npmjs.com/package/firebase-tools
```

I use the Node module `npm-check` to update all my Node modules. This is easy with the command `npm-check -u -g`. Alternatively, you update with `npm install -g firebase-tools` from the command line.

## Data Structures

Cloud Firestore stores _collections_ of _documents_. Documents can contain _subcollections_. Your queries look like this:

```javascript
firebase.firestore().collection($scope.longLanguage).doc($scope.word).collection('AudioSources').doc($scope.accentDialect).set(accentDialectObject));

```

Notice the syntax:

1. firebase.firestore()
2. collection().doc().collection().doc().collection().doc()
3. set(), update(), delete(), etc.

In most NoSQL databases, including MongoDB and Realtime Database, you have arrays and objects, and you can mix them up in any order. You can have a top-level array, which contains both objects and arrays. You can put arrays in arrays, or objects in objects. Not so in Cloud Firestore. Cloud Firestore has to be collection, documents, collection, documents, etc. If I want a subcollection in a collection, i.e., and array in an array, I step back and think of a semantic name for the subcollection. I have an array of movies, and each movie consists of an array of video clips. This sounds like an array of arrays, but it's semantically clearer as

```javascript
collection("Movies").doc("It's a Wonderful Life").collection("Video Clips").doc("Clip1.mp4")
```

When naming collections, documents, and fields, Don't Repeat Yourself (DRY). If you see a document with same name as the collection it's in, or a field with the same name as the document it's in, change one of these names to something more semantic.

### All Documents Should Have Fields

If you want to nest a collection inside a collection, for example, a collection of videos in English `.collection('English_Videos')`, and in that a collection of video clips for the movie `Walker Climbs a Tree` (starring me and my nephew when he was ten, available on (LanguageTwo.com)[https://languagetwo.com/]), you have to make a document between the  collections. I made a document `.doc('Walker_Climbs_a_Tree')` with a subcollection `.collection('Video Clips)'`.

But you can't create an empty document. `.doc('Walker_Climbs_a_Tree')` must have some fields. If I can't think of anything else I put in the user.id or name of the person who created the document, and a timestamp when the document was created.

```javascript
firebase.firestore().collection('English_Videos').doc('Walker_Climbs_a_Tree').set(
  {
    addedByUID: $scope.user.uid,
    addedByName: $scope.user.displayName || 'No name',
    addedByEmail: $scope.user.email || 'No email',
    dateAdded: Date.now() // timestamp
  }
)
.then(function() {
  console.log("Document added.")
})
```

### Collection and Document Naming Conventions

You can name your collections and documents anything you want, but I prefer to use camelCase for document fields (keys), and arrays and objects that are document fields. I use Snake_Case for collections and documents. For arrays I add 'Array', e.g., `phonemeArray`, without an underscore. For objects I add 'Object', e.g, `videogularObject`, without an underscore.

### The Difference Between Collections and Documents vs. Arrays and Objects

1. Arrays can contain objects or arrays. Collections can contain only documents.
2. Objects and documents are more similar. Documents can contain fields or collections.
3. Elements in arrays are identified by number. Documents in collections have unique names or identifiers. This makes queries easier. You can provide semantic names you provide or Cloud Firestore will generate a unique ID (with `add()`).
4. You can create empty arrays, and often have to before you push elements into an array. Firebase, in contrast, creates collections on the fly if one doesn't exist. Cloud Firestore also destroys empty collections. And if a collection or document already exists, Cloud Firestone won't overwrite it or make a duplicate.

### When To Use Arrays Instead of Collections
If an array always uploaded and downloaded as a unit, then make it an array. If you push an element into the array, or access one element in the array, use a collection.

For example, in my English words database the first word is `the`, the number-one most freqently used word in English. (The number-one most frequently used word in Chinese is the number `one`, prounced `yee`, with a high-pitched tone.) My document for `the` explains how to pronounce the word.

![the](Screenshots/the "the")

`the` has two phonemes or sounds: `eth` or voiced th, and `schwa`, the neutral vowel. If you like to be shocked, go my project [LanguageTwo.com](https://languagetwo.com/#!/languagetwo) and discover that American English has 25 vowels, most of which you've never heard of. (British English has 15 more vowels.) OK, users want to know how to pronounce `the`. The answer is `[eth, schwa]`. No one asks, what's the second phoneme in `the`? The array is always uploaded as a unit, and always downloaded as a unit. This is when you want an array instead of a collection.

### When To Use Objects Instead of Documents

You use objects when you want to put an object in an document, without a collection in between. You can't put a document in a document, e.g.,

```javascript
collection("Movies").doc("It's a Wonderful Life").doc("Clip1.mp4")
```

isn't valid. But you can put objects into documents. Cloud Firestore calls these _maps_, not objects.

Another reason to use objects is to create [custom objects for Java classes](https://firebase.google.com/docs/firestore/manage-data/add-data). I don't use Java so I don't do this.

### Semantic Names vs. Assigned Keycodes vs. Element Numbers

Normally I recommend assigning semantic names to collections and documents. However, for some documents you should let Firebase assign a unique identifier or key, like `-KloeQHDC-mugPjJMAG4`. The only time I do this is with user accounts. Each user account must be unique. Using the user's name won't work, if you have more than one Li Wang. Email addresses might be better, but users will sometimes need to change their email address. Better to let Firebase assign an identifier.

As noted above, if an array is always uploaded and downloaded as a unit, I use an array instead of a collection. Here the elements are numbered (starting with `0`), not semantically named or assigned a unique identifier.

## CRUD: Working With Data

Now we'll compare code for Realtime Database vs. Cloud Firestore.

### CREATE: Adding New Data

In Realtime Database, adding a new object to an array is easy:

```javascript
var wordObject = {
  word: $scope.word,
  language: $scope.language,
  longLanguage: $scope.longLanguage,
  wordFrequency: $scope.wordFrequency,
  partOfSpeech: $scope.partOfSpeech,
  wordLength: $scope.word.length,
  phonemeArray: $scope.phonemeArray,
  ipaArray: $scope.ipaArray,
  translationsArray: $scope.translationsArray,
  funFactsArray: $scope.funFactsArray,
  audioSourceURL: $scope.audioSourceURL
};

firebase.database().ref($scope.language).push().set(wordObject)// push word to Firebase Database
.then(function() {
  console.log("Uploaded word to Firebase Realtime Database.");
})
.catch(function(error){
  console.log("Error: " + error);
});
```

You make your object, then you specify the location the Realtime Database (an array specified by the variable `$scope.language`). Then you `push()` the object into the array and `set()` the new data. Note a couple things:

* Queries to Realtime Database only find arrays. Hence the `.push().set()` syntax.
* `wordObject` contains four arrays.

Cloud Firestore isn't as easy:

```javascript
var wordObject = {
  word: $scope.word,
  language: $scope.language,
  longLanguage: $scope.longLanguage,
  wordFrequencyRank: $scope.wordFrequencyRank,
  partOfSpeech: $scope.partOfSpeech,
  wordLength: $scope.word.length,
  phonemeArray: $scope.phonemeArray,
  ipaArray: $scope.ipaArray,
  homophones: $scope.homophones || 'No homophones',
  addedByUID: $scope.user.uid,
  addedByName: $scope.user.displayName || 'No name',
  addedByEmail: $scope.user.email || 'No email',
  dateAdded: Date.now() // timestamp
};

var accentDialectKey = $scope.accentDialect; // makes a variable key in the object
var accentDialectObject = { // docs are objects
  [accentDialectKey]: $scope.audioSourceURL
};

firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).set(wordObject)
.then(function() {
  console.log("Collection added to Firestore!");
  var promises = [];
  promises.push(firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('AudioSources').doc($scope.accentDialect).set(accentDialectObject));

  if ($scope.funFact) {
    $scope.funFactLongLanguage = longLanguageFactory.toController($scope.funFactLanguage);
    var funFactKey = $scope.funFactLongLanguage; // makes a variable key in the object
    var funFactObject = { // docs are objects
      [funFactKey + 'FunFact']: $scope.funFact
    };
    promises.push(firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('FunFacts').doc($scope.longLanguage).set(funFactObject));
  } else {
    console.log("No fun fact.");
  }

  if ($scope.translation) {
    $scope.translationLongLanguage = longLanguageFactory.toController($scope.translationLanguage);
    var translationKey = $scope.translationLongLanguage; // makes a variable key in the object
    var translationObject = { // docs are objects
      [translationKey + 'Translation']: {
        translation: $scope.translation,
        translationLanguage: $scope.translationLanguage,
        translationLongLanguage: $scope.translationLongLanguage
      }
    };
    promises.push(firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('Translations').doc($scope.translationLongLanguage).set(translationObject));
  } else {
    console.log("No translation.");
  }

  Promise.all(promises).then(function() {
    console.log("All subcollections were added!");
  })
  .catch(function(error){
    console.log("Error adding subcollections to Firestore: " + error);
  });
})
.catch(function(error){
  console.log("Error adding document to Firestore: " + error);
});
```

We start with a similar `wordObject`. Then we add the object as a document:

```javascript
firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).set(wordObject)
```

One difference is that in the Realtime Database example, I didn't provide a semantic name, so Realtime Database created an ID (`-KloeQHDC-mugPjJMAG4`). In the Cloud Firestore example I specify a semantic name for the document, e.g., the word "frog" will be called `frog`.

Another difference is that we use `set()` instead of `push().set()`. This is a big difference, and not obvious. Cloud Firestore works with documents, and creates or destroys collections on the fly, as documents are added to a new collection or the sole document in a collection is removed. Realtime Database, in contrast, works with arrays. All queries go to locations that are arrays, whether to add data, read data, update data, or delete data.

Now Cloud Firestore gets more complicated. Instead of including arrays in our object, we now have to create each subcollection. In Cloud Firestore each collection must be added separately:

```javascript
.then(function() {
  console.log("Collection added to Firestore!");
  var promises = [];
  promises.push(firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('AudioSources').doc($scope.accentDialect).set(accentDialectObject));

});
```

We wait for the top-level collection to be created (both Realtime Database and Cloud Firestore are asynchronous). Then we create an array of promises. Then we push the Cloud Firestore call into the `promises` array. The Cloud Firestore subcollection call is similar to the top-level collection call, except that instead of a single `collection().doc()` pair we now have two `collection().doc()` pairs.

Next we have an optional subcollection, that the user might or might not have submitted data for (i.e., this isn't a required field in the HTML form). This is a "fun fact" about a word, e.g., the word "be" has a fun fact about Shakespeare's "To be or not to be" line. Not all words have fun facts!

```javascript
if ($scope.funFact) {
  $scope.funFactLongLanguage = longLanguageFactory.toController($scope.funFactLanguage);
  var funFactKey = $scope.funFactLongLanguage; // makes a variable key in the object
  var funFactObject = { // docs are objects
    [funFactKey + 'FunFact']: $scope.funFact
  };
  promises.push(firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('FunFacts').doc($scope.longLanguage).set(funFactObject));
} else {
  console.log("No fun fact.");
}
```

First we test if the user entered a fun fact in the HTML form. If so, we call a factory to convert a language code, e.g., `en`, into a full word, e.g., `English`. Then we create an object with a variable key, e.g., `EnglishFunFact`, and the user's fun fact is the value. Then we run the Cloud Firestore call as before, and push the call into the `promises` array. Finally we log if the user didn't enter a fun fact.

We then do all this again for the next subcollection, this time for translations:

```javascript
if ($scope.translation) {
  $scope.translationLongLanguage = longLanguageFactory.toController($scope.translationLanguage);
  var translationKey = $scope.translationLongLanguage; // makes a variable key in the object
  var translationObject = { // docs are objects
    [translationKey + 'Translation']: {
      translation: $scope.translation,
      translationLanguage: $scope.translationLanguage,
      translationLongLanguage: $scope.translationLongLanguage
    }
  };
  promises.push(firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('Translations').doc($scope.translationLongLanguage).set(translationObject));
} else {
  console.log("No translation.");
}
```

Now we get to the fun part:

```javascript
Promise.all(promises).then(function() {
  console.log("All subcollections were added!");
})
.catch(function(error){
  console.log("Error adding subcollections to Firestore: " + error);
});
})
.catch(function(error){
  console.log("Error adding document to Firestore: " + error);
});
```

We use `Promise.all(promises)` to wait until all of the subcollections have been created, then log the success. Finally there are two `catch` clauses for errors.

Note that I nested one `.then` inside another `.then`. Yes, this is an anti-pattern, but I don't see any other way to do handle the async database calls. We have to create the top-level collection first, then wait for the promise to resolve, then we can create the subcollections.

So far, Cloud Firestore isn't winning the race for code simplicity.

#### `set()` vs. `add()`
Cloud Firestore has another command for creating data. You use `set()` with a semantic name that you provide. If you want Cloud Firestore to generate an identifier, like `-KloeQHDC-mugPjJMAG4`, the you use `add()`.

### READ: Getting Data

The _raison d'être_ for Realtime Database is the `.on()` method of reading data, that is, the listener for receiving data change events. In my project, when a user logs in a Cloud Function triggers to get a new token from IBM Watson. The following code listens for the new token and then writes it to local storage:

```javascript
firebase.database().ref('IBMWatsonToken').on('value')
.then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    localStorage.setItem("IBMWatsonToken", childSnapshot.val());
    console.log("Watson token updated: " + childSnapshot.val());
  }); // close forEach
}) // close snapshot promise
.catch(function(error) {
  console.log("Error:", error);
}); // close catch
```

Cloud Firebase has the similar (`.onSnapshot()`)[https://firebase.google.com/docs/firestore/query-data/listen] method for synchronizing data. Here's the same code, for Firestore:

```JavaScript
firebase.firestore().collection('IBMWatsonToken').doc('Token').onSnapshot(function(doc) {
  localStorage.setItem("IBMWatsonToken", doc.data());
  console.log("Watson token updated: " + doc.data());
});
```

The Cloud Firestore documentation in several places says that method is `.addSnapshotListeners()`, not `.onSnapshot()`. I haven't investigated what's going on here.

The (documentation)[https://firebase.google.com/docs/firestore/query-data/listen] says "An initial call using the callback you provide creates a document snapshot immediately with the current contents of the single document. Then, each time the contents change, another call updates the document snapshot."

In other words, your listener fires when the web app loads, even if no data has changed in the database. Then the listener fires whenever the data changes. If you want the listener to fire only when data changes, i.e., not when the web app loads, you'll have to do something annoying like making a `snapshotCall` variable set to `0`, executing your listener only if `snapshotCall > 0`, then incrementing `snapshotCall++;`. The following code opens a modal window to warn the user when the listener detects an error message written to the database from a API call. I don't want to modal window to open when the user loads the app for the first time:

```js
firebase.auth().onAuthStateChanged(function(user) { // listen for login and logout
  var snapshotCall = 0;
  if (user) { // if a user logs in
    firebase.firestore().collection('Users').doc($scope.user.uid).collection('English_American').doc('Missing_Word').onSnapshot({includeMetadataChanges: true}, function(doc) { // listen for Oxford Dictionaries to return word data
      console.log("Missing word!");
      if (doc.exists && snapshotCall > 0) { // ignore the initial call to get the snapshot; only open the modal window when the data changes
        console.log(doc.data());
        snapshotCall++;
        // open modal window...
      }
    })
  }
});
```

It would be nice if Firebase would make a flag for `onSnapshot({initialFire: false})` that would make the listener fire only when data changes, and not on initial load.

#### Get One Document With Two Subcollections

Realtime Database and Cloud Firestore also have the conventional `.once()` method to read the data's current state, called a _data snapshot_. Let's get some data from the Realtime Database with `.once()`:

```JavaScript
firebase.database().ref($scope.language).orderByChild('word').equalTo($scope.word).once('value')
.then(function(snapshot) {
  if (snapshot.val() === null) { // word not found
    $scope.notFound = true; // display word not found
    $scope.$apply();
  } else { // word found
    snapshot.forEach(function(childSnapshot) {
      $scope.audioArray = childSnapshot.val().audio;
      $scope.ipaArray = childSnapshot.val().ipa;
      $scope.language = childSnapshot.val().language;
      $scope.longLanguage = childSnapshot.val().longLanguage;
      $scope.phonemeArray = childSnapshot.val().phonemes;
      $scope.translations = childSnapshot.val().translations;
      $scope.word = childSnapshot.val().word;
      $scope.wordFrequency = childSnapshot.val().wordFrequency;
      $scope.wordKey = childSnapshot.key;
      $scope.funFacts = childSnapshot.val().funFacts;
      $scope.$apply();
    }); // close forEach loop
  } // close else
}) // close promise
.catch(function(error) {
  console.error(error.message);
}); // end catch for inner nested promise
```

Here we query the Realtime Database looking through the array for an object in which the key `word` has a value matching the variable `$scope.word`. `once('value')` returns the data snapshot. (Alternatively I could have called `on()` if I needed to listen to changes in the data, such as the pizza driver's location.)

We wait for the async data to return and check if the data was found. If not, the view displays "Not found" to the user.

If data comes back, then we run a `forEach` loop to extract the data. Realtime Database always needs this `forEach` loop. I guess that Realtime Database always returns an array of objects. If so, then this is a crucial difference. Realtime Database doesn't know if the query will return one item or more then one item, so it returns an array of objects. Cloud Firestore documents have unique identifiers so come back as an object.

Inside the `forEach` loop, each field in the object is assigned to a local variable.

Now we'll look at the Cloud Firestore version:

```javascript
$scope.longLanguage = longLanguageFactory.toController($scope.language);
firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).get()
.then(function(word) {
  if (word.exists) {
    $scope.homophones = word.data().homophones;
    $scope.ipaArray = word.data().ipaArray;
    $scope.language = word.data().language;
    $scope.longLanguage = word.data().longLanguage;
    $scope.partOfSpeech = word.data().partOfSpeech;
    $scope.phonemeArray = word.data().phonemeArray;
    $scope.word = word.data().word;
    $scope.wordFrequencyRank = word.data().wordFrequencyRank;
    $scope.$apply();
  } else {
    $scope.notFound = true; // display word not found
    $scope.$apply();
  }
});

$scope.translationLongLanguage = longLanguageFactory.toController($scope.translationLanguage);
firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('Translations').doc($scope.translationLongLanguage).get()
.then(function(translation) {
  if (translation.exists) {
    var translationLongLanguage = $scope.translationLongLanguage + 'Translation';
    $scope.translation = translation.data()[translationLongLanguage].translation;
    $scope.$apply();
  } else {
    console.log("No translation.");
  }
});

$scope.funFactLongLanguage = longLanguageFactory.toController($scope.funFactLanguage);
firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).collection('FunFacts').doc($scope.funFactLongLanguage).get()
.then(function(funFact) {
  if (funFact.exists) {
    var longLanguageFunFact = $scope.funFactLongLanguage + 'FunFact';
    $scope.funFact = funFact.data()[longLanguageFunFact];
    $scope.$apply();
  } else {
    console.log("No fun fact.");
  }
});
```

Again, we start with a factory call. Then we query Cloud Firestore. Each document has a unique name or identifier, so we get exactly what we want. If the item exists, we assign the fields to local variables. If the item doesn't exist, we tell the user.

Next, we send queries to two subcollections. I run these three queries synchronously, as none depend on the others. Perhaps I should use `Promise.all` to get the three queries back before I assign the data to local variables.

Comparing these two queries, Cloud Firestore has a cleaner query language. Realtime Database always felt sketchy writing queries, like the wheels were about to fall off. `orderByChild('word').equalTo($scope.word)` works but didn't feel robust. In contrast, Cloud Firestore has a solid queries.

On the other hand, we had to write three times as much code, for the collection and the two subcollections.

#### Get More Then One Document From a Collection

The method `.where()` gets all the documents that match a criterion, in a collection. I haven't used this but the (documentation)[https://firebase.google.com/docs/firestore/query-data/get-data] is clear.

You can also chain `.where()` methods to make (compound queries)[https://firebase.google.com/docs/firestore/query-data/queries].

You can (order)[https://firebase.google.com/docs/firestore/query-data/order-limit-data] how the data returned will be presented, and you can limit how many documents will be returned. You can (paginate)[https://firebase.google.com/docs/firestore/query-data/query-cursors] the data returned into batches.

These complex queries would require a long book to provide code examples of every option.

#### Get a Collection

The method `.get()` can get a collection. You get back an array so you have to run a `forEach` loop to get your results, making this trickier than getting a document. See the  (documentation)[https://firebase.google.com/docs/firestore/query-data/get-data]

#### Get List of a Document's Subcollections

The (documentation)[https://firebase.google.com/docs/firestore/query-data/get-data] shows a method `getCollections()` but I haven't used it because it's not available for web apps, iOS apps, Android, or Python. It's only available for Java, Node.js, and Go.

### Get Custom Objects

If you're coding in Swift, Objective-C, Android, Java, Python, or Go (i.e., not JavaScript), you can get your data as a custom data object instead of a map (a JavaScript object). See the (documentation) [https://firebase.google.com/docs/firestore/query-data/get-data].

Let's go on to updating data.

### UPDATE: Updating data

Let's update some data with Realtime Database:

```javascript
$scope.updatePartOfSpeech = function() {
  console.log("Updating part of speech!");
  var onComplete = function(error) {
    if (error) {
      console.log('Part of speech update failed');
    } else {
      console.log('Part of speech update succeeded');
    }
  };
  firebase.database().ref($scope.language).child($scope.wordKey).update({ partOfSpeech: $scope.partOfSpeech }, onComplete);
};
```

And with Cloud Firestore:

```JavaScript
$scope.updatePartOfSpeech = function() {
  console.log("Updating part of speech!");
  firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).update({ partOfSpeech: $scope.partOfSpeech })
  .then(function() {
    console.log("Part of speech updated.");
  })
  .catch(function(error) {
    console.error("Error updating part of speech: ", error);
  });
};
```

Aside from using the callback style (which has nothing to do with the choice of database), these functions are similar.

#### Updating fields in nested objects

If you have objects in your documents, you can use dot notation to update fields.

### DESTROY: Deleting Data

Let's delete some data with Realtime Database:

```javascript
$scope.deleteWord = function() {
  firebase.database().ref($scope.language).orderByChild('word').equalTo($scope.word).once("value").then(function(snapshot) {
    var promises = [];
    snapshot.forEach(function(child) {
      promises.push(child.ref.remove());
    });
    Promise.all(promises).then(function() {
      console.log("All removed!");
    });
  });
};
```

With Realtime Database, deleting data is a bit complicated. We can't write

```javascript
firebase.database().ref($scope.language).orderByChild('word').equalTo($scope.word).remove();
```

That doesn't work because Realtime Database only handles arrays. (It would work if we were deleting an array.) The delete an object, we have to write a query that finds an array, then make an array for promises, then use `forEach` to iterate through the array, running `remove()` on every element of the array. We push each of these `remove()` commands in the `promises` array. Then we use `Promise.all(promises)` to wait for all of the `remove()` commands to resolve. That's heavy duty coding for this junior developer! Let's see if Cloud Firestore is easier.

#### Delete Documents from Cloud Firestore

But first, let's look at my data structure.

![Data structure](Screenshots/of1)

![Data structure](Screenshots/of2)

The top collection is `EnglishWords`. I've selected the document `of`. This document has three subcollections: `AudioSources`, `FunFacts`, and `Translations`. I've selected `Translations`. There's a `Spanish` document. The document has three fields: `translation`, `translationLanguage`, and `translationLongLanguage`.

You want to see what the fun fact associated with the word 'of'? Here it is:

![Fun fact for 'of'](Screenshots/of3)

Pretty fun, huh! Email me if you can think of something more fun to say about 'of'.

```javascript
$scope.deleteWord = function() {
  console.log("Deleting word!");
  $scope.longLanguage = longLanguageFactory.toController($scope.language);
  firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).delete()
  .then(function(){
    console.log("Word successfully deleted");
  })
  .catch(function(error) {
    console.error("Error removing word: ", error);
  });
};
```

That was easy! The word is gone from Cloud Firestore. Let's put the word back. I'll just put in the word, without the translation and the exciting fun fact.

Whoa! The word is back, with the translation and fun fact! What happened?

The above code deleted the document `of` from the collection `EnglishWords`. It didn't delete the subcollections `AudioSources`, `FunFacts`, and `Translations`. To delete everything we need this code:

```javascript
$scope.deleteWord = function() {
  $scope.languageWords = longLanguageFactory.toController($scope.language) + 'Words';
  var promises = [];
  firebase.firestore().collection($scope.languageWords).doc($scope.word).collection('AudioSources').get()
  .then(function(audioSources) {
    audioSources.forEach(function(doc) {
      promises.push(firebase.firestore().collection($scope.languageWords).doc($scope.word).collection('AudioSources').doc(doc.id).delete());
    });
  });
  firebase.firestore().collection($scope.languageWords).doc($scope.word).collection('FunFacts').get()
  .then(function(funFacts) {
    funFacts.forEach(function(doc) {
      promises.push(firebase.firestore().collection($scope.languageWords).doc($scope.word).collection('FunFacts').doc(doc.id).delete());
    });
  });
  firebase.firestore().collection($scope.languageWords).doc($scope.word).collection('Translations').get()
  .then(function(translations) {
    translations.forEach(function(doc) {
      promises.push(firebase.firestore().collection($scope.languageWords).doc($scope.word).collection('Translations').doc(doc.id).delete());
    });
  });
  Promise.all(promises).then(function() {
    console.log("All subcollections deleted.");
    firebase.firestore().collection($scope.languageWords).doc($scope.word).delete()
    .then(function() {
      console.log("Word deleted.");
      $scope.word = null;
      $scope.$apply();
    })
    .catch(function(error) {
      console.error("Remove failed: " + error.message);
    });
  })
  .catch(function(error){
    console.error("Error deleting subcollections: " + error.message);
  });
};
```

This time, when I add the word back without the subcollections, there aren't any subcollections. I.e., this `delete()` function deleted the top level collection and its subcollections. The entire record was deleted. Let's go through this code.

The first line is AngularJS to make the function run when the user clicks a button in the view. The second line calls a factory to change `en` to `EnglishWords` (or `es` to `SpanishWords`, etc.).

Next, we make an array for promises.

Next, we query Cloud Firestore and get the subcollection 'AudioSources'. When the collection comes back, we run a `forEach` loop to iterate through the documents. We then run `delete()` on each document, and push this command into the `promises` array.

Then we do the same for the other two subcollections.

Next, we use `Promise.all(promises)` to wait for all the subcollections to be deleted. We then delete the top level document. Then there are two lines of AngularJS to clear the word from the user's view, indicating that the word was removed.

Finally, we have two `catch` functions for errors.

Deleting a document without subcollections in Cloud Firestore is easier than deleting an object in Realtime Database. Deleting a document with subcollections in Cloud Firestore can require a lot of code. However, IMHO the code is straightforward and easier to write than a `delete()` function in Realtime Database.

This stackoverflow answer explains [why Cloud Firestore doesn't have a `deleteAll()` command](https://stackoverflow.com/questions/46692845/why-single-bulk-delete-collection-in-firestore-is-not-possible-like-it-is-whit) to delete a collection and all its subcollections in one fell swoop. _tl;dr_, giant deletes of deep nested collections take time, and the database has to be locked until the delete finishes, so other users have to wait.

Other stackoverflow discussions have talked about running deep delete functions from Google Cloud Functions (in your Firebase Console, under `DEVELOP`, below `Database`). This would eliminate issues with a client sending a complex `delete()` command and getting interrupted before all the code executes.

#### Deleting Document Fields

To delete a field from a document, use the `FieldValue.delete` method with an `update` query:

```javascript
$scope.deleteHomophones = function() {
  firebase.firestore().collection($scope.longLanguage + 'Words').doc($scope.word).update({ homophones: firebase.firestore.FieldValue.delete() })
  .then(function() {
    console.log("Homophones deleted.");
    $scope.homophones = null; // this and the next line clear the HTML form in the view
    $scope.$apply();
  })
  .catch(function(error) {
    console.error("Error deleting homophones: ", error);
  });
};
```

#### Deleting Collections

To delete a collection in Cloud Firestore, delete all the documents from the collection and the collection will vanish. Directly deleting a collection from a JavaScript web application, an iOS app, or an Android app isn't recommended, i.e., from any front-end app. On the back end, collections can be deleted in Python, Node.js, Go, and in batches with Java. See the Cloud Firestore (documentation)[https://firebase.google.com/docs/firestore/manage-data/delete-data].

### A CRUDy Conclusion

Just one more CRUDy item and then we'll move on to migrating your data from Realtime Database to Cloud Firestore.

#### CRUD Operations From the CLI

You can also add, edit, and delete (but not update) data from the Firebase command line interface (CLI). See the (documentation)[https://firebase.google.com/docs/firestore/using-console].

## Data Security Rules

Securing your data is a good idea! I just used the rules recommended in the (documentation)[https://firebase.google.com/docs/firestore/security/overview]. I'm not a security expert.

## Migrating Your Database to Cloud Firestore

This is easy, and fun. Here's the code I used to migrate my data from Realtime Database to Cloud Firestore.

```javascript
scope.migrateDatabase = function() {
  console.log("Migrating database");
  firebase.database().ref('en').once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {

      var wordData = {
        word: childSnapshot.val().word,
        language: childSnapshot.val().language,
        longLanguage: childSnapshot.val().longLanguage,
        wordFrequencyRank: childSnapshot.val().wordFrequency,
        partOfSpeech: childSnapshot.val().partOfSpeech || null,
        wordLength: childSnapshot.val().word.length,
        phonemeArray: childSnapshot.val().phonemes,
        ipaArray: childSnapshot.val().ipa,
        homophones: childSnapshot.val().homophones || null,
        addedByUID: $scope.user.uid,
        addedByName: $scope.user.displayName || 'No name',
        addedByEmail: $scope.user.email || 'No email',
        dateAdded: Date.now() // timestamp
      };

      var accentDialectObject = {
        downloadURL: childSnapshot.val().audio[0]
      };

      var translationObject = { // docs are objects
        translation: childSnapshot.val().translations[0].translation,
        translationLanguage: childSnapshot.val().translations[0].translationLanguage,
        translationLongLanguage: childSnapshot.val().translations[0].translationLongLanguage
      };

      firebase.firestore().collection('EnglishWords').doc(childSnapshot.val().word).set(wordData)
      .then(function() {
        console.log("Collection added to Firestore!");
        var promises = [];
        promises.push(firebase.firestore().collection('EnglishWords').doc(childSnapshot.val().word).collection('AudioSources').doc('English_General_American').set(accentDialectObject));
        promises.push(firebase.firestore().collection('EnglishWords').doc(childSnapshot.val().word).collection('Translations').doc(childSnapshot.val().translations[0].translationLongLanguage).set(translationObject));
        Promise.all(promises).then(function() {
          console.log("All subcollections were added!");
        })
        .catch(function(error){
          console.log("Error adding subcollections to Firestore: " + error);
        });
      });
    });
  });
};
```

The first line is AngularJS, enabling me to run the function by clicking on a button in the view. We then query Realtime Database to get the array of English words. (I changed `en` to `es` to migrate the Spanish words, etc.) Then we iterate through the array with a `forEach` loop. Inside the `forEach` loop, the data from each word in the Realtime Database is assigned to a key in the `wordData` object. I also put in a date stamp, etc.

Next, I make an object for the speaker's accent, in the audio recording.

Next, I make a translation object, with the translation and the language of the translation.

Now we query Cloud Firestore and add the top-level collection. We wait for the promise to resolve, and then create an array for `promises`. We make two queries to add two subcollections, and push the queries into the array of promises. Finally, we use `Promise.all(promises)` to tell us when all the subcollections have been added. A `catch` handles errors.

The function iterates through the array of objects in Realtime Database and spins out a collection of documents in Cloud Firestore. It's pretty cool to watch the documents appearing in the console!

What I really like about this function is that I've screwed up the migration, I mean, I've gotten better ideas for structuring the data, and I can change a line or two in the function, rerun the migration, and everything is fixed!

## Cloud Functions

Most projects need server-side functions. For example, sending HTTP requests to an API. Firebase provides Cloud Functions for this purpose. Cloud Functions are written in JavaScript with NodeJS, and run pretty much like you were running your own NodeJS server. See the (documentation)[https://firebase.google.com/docs/functions/] for complete directions. I'll just highlight some things to pay attention to.

### Required Node Modules

* You make a `functions` directory in your project root directory (not in your `public` directory).

* In your `functions` directory run `npm install --save firebase-admin@latest firebase-functions@latest` to install Node modules locally.

* Keep your Node modules up-to-date. Firebase releases software updates often, sometimes several times in a week. In your `functions` directory, run `npm list --depth=0` to see what versions you have:

```
functions@ /Users/TDK/LanguageTwo/functions
├── firebase-admin@5.12.0
├── firebase-functions@1.0.1
└── request@2.85.0
```

You need `firebase-admin` and `firebase-functions` to use Firebase Cloud Functions:

* `firebase-functions` is used for the Cloud Function triggers.

* `firebase-admin` is used to write data from the Cloud Function to the database.

* `request` is the Node module for HTTP requests.

I use the Node module (`npm-check`)[https://www.npmjs.com/package/npm-check] to keep my Node modules up-to-date. Every week I run `npm-check -u -g` to update all my global (not local) Node modules. However, `firebase-admin` and `firebase-functions` are installed locally in my `functions` directory, so I have run `npm-check -u` from the `functions` directory to update the three local Node modules.

To check the latest version of any Node module, go to `https://www.npmjs.com/package/` and the name of the module. For example,

```
https://www.npmjs.com/package/firebase-functions
```

You can update a single global Node module (in this case `firebase-tools`) with

```
npm install -g firebase-tools
```

Or you can update two local Node modules (in this case, `firebase-admin` and `firebase-functions`) with

```
npm install --save firebase-admin@latest firebase-functions@latest
```

### Boilerplate to Require Node Modules

Every Cloud Function starts with this boilerplate:

```js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
```

You likely will have other Node modules, e.g., `request`.

### Deploying Cloud Functions

I deploy my Cloud Functions separately from my project deployments. You can deploy all your functions with

```
firebase deploy --only functions
```

Or deploy one function (in this case, `myFunction`) with

```
firebase deploy --only functions:myFunction
```

### Cloud Function Path Syntax

Locations in Cloud Firestore have three different syntaxes. First, in the browser I use this syntax:

```js
firebase.firestore().collection('myCollection').doc('documentID')
```

Next, in a Cloud Function trigger I use this syntax:

```js
const functions = require('firebase-functions');
functions.firestore.document('myCollection/documentID')
```

Third, in the Cloud Function return I use this syntax:

```js
const admin = require('firebase-admin');
admin.firestore().collection('myCollection').doc('documentID')
```

The first and last lines are the same except that from the browser you call Firebase with `firebase`, when from the server you call Firebase using the `firebase-admin` Node package, here aliased to `admin`.

The middle line is different. It's calling Firebase using the `firebase-functions` Node package, here aliased to `functions`. This syntax doesn't use `collection`, uses `document` instead of `doc`, and writes a path with a slash between collections and documents.

In other words, Firebase is called using different libraries, depending on whether you're calling from the browser or the server (e.g., a Cloud Function), and whether in a Cloud Function your calling a trigger or a return.

### Event, Change, Snap, UserRecord, and Context

In a Cloud Function trigger, with Realtime Database you use `event`, as in `.onUpdate(event => {`.

  With Cloud Firestore you use `change` and `context`, as in `.onUpdate((change, context) => {...}`

  Note that `change` and `context` are now in parentheses. `event` wasn't in parentheses.

  To get your data with Realtime Database you use `change.before.val()` and `change.after.val()`. But with Cloud Firestore you use `change.before.data()` and `change.after.data()`.

  `change` is an object with two fields: `before` and `after`. For example, if your Cloud Function triggers from a Cloud Firestore field that had the value `bunion`, and now has the value `sandwich`, logging `change.before.data()` would return `bunion`, and logging `change.after.data()` would return `sandwich`.

  The first argument isn't always `change`. This argument varies, depending on the function:

  ```js
  onWrite((change, context))
  onUpdate((change, context))
  onDelete((snap, context))
  onCreate((userRecord, context))
  onNewDetected is now onNew((issue, context))
  Storage onFinalize is now onDelete((object, context))
  ```

  `context` is an object containing the names of wildcards (keys) and their values. We'll learn more about this below in the section on wildcards. It also contains timestamps.

  ### Simple Cloud Function with Cloud Firestore

  Here's a simple Cloud Function that triggers when a value at a location in Cloud Firestore changes, and then writes a new value to a different location in Cloud Firestore.

  ```js
  const admin = require('firebase-admin');
  const functions = require('firebase-functions');

  admin.initializeApp();

  exports.testFunction = functions.firestore.document('triggerCollection/myDocument').onUpdate((change, context) => {

    return admin.firestore().collection('writeCollection').doc('anotherDocument').update({
      token: 'newValue'
    })
    .then(function() {
      console.log("Document updated.");
    })
    .catch(function(error) {
      console.log("Error updating document: ", error);
    })
  });
  ```

  ### Cloud Function to Call an API

  My project uses IBM Watson's Speech-to-Text service. This service requires refreshing a token every hour. Here's my Cloud Function for refreshing the IBM Watson token, using Realtime Database. It puts the username and password into the URL:

  ```javascript
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  const request = require('request');

  admin.initializeApp();

  exports.getWatsonToken = functions.database.ref('userLoginEvent').onUpdate((change, context) => {
    let username = 'TDK';
    let password = 'swordfish';
    let url = 'https://' + username + ':' + password + '@stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/speech-to-text/api';
    request({url: url}, function (error, response, body) {
      admin.database().ref('IBMWatsonToken').set({ 'token': body });
    });
    return 0;
  });
  ```

  The first three lines are Node modules dependencies. The first two are Firebase Node modules. The third is for sending HTTP requests.

  The next line initializes the Cloud Function.

  The next line triggers the function when data is updated at the Realtime Database location `userLoginEvent`. My home controller toggles a value at this location when a user logs in, i.e., each login gets a fresh token.

  Next, the function sets variables for my username, password, and the URL I want to send the HTTP request to. Then the `request` Node module is called, referencing the `url` variable that was set in the previous line. The HTTP response is then parsed and the response body is labeled as the `token` and written (using `set()`) to the location `IBMWatsonToken` in my Realtime Database.

  Finally, the function has to return something, so it returns `0` to prevent the error message `Function returned undefined, expected Promise or value`.

  Let's look at the same Cloud Function for Cloud Firestore:

  ```js
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  const request = require('request');

  admin.initializeApp();

  exports.getWatsonTokenFS = functions.firestore.document('User_Login_Event/Toggle_Value').onUpdate((change, context) => {
    let username = 'TDK';
    let password = 'swordfish';
    let url = `https://${username}:${password}@stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/speech-to-text/api`;

    request({url: url}, function (error, response, body) {
      admin.firestore().collection('IBM_Watson_Token').doc('Token_Value').set({ 'token': body });
    });

    return 0;
  });
  ```

  The differences are in the database location syntaxes, for the trigger and the response. Also I wrote the URL in the JavaScript 6 format instead of older, less concise format.

  ### Another Cloud Function to Call an API

  This Cloud Function puts the username and password in the headers to call an API:

  ```js
  exports.oxfordPronunciation = functions.firestore.document('Oxford_Dictionaries/Word_Request').onUpdate((change, context) => {

    if (change.after.data().word != undefined) {
      let options = {
        url: 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + change.after.data().word + '/pronunciations%3B%20regions%3Dus',
        headers: {
          'app_id': 'TDK',
          'app_key': 'swordfish'
        }
      };

      function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          var word = JSON.parse(body);
          admin.firestore().collection('Oxford_Dictionaries').doc('Word_Response').set({
            'metadata': word.metadata,
            'results': word.results
          });
        }
      }

      request(options, callback);
    }

    return 0;
  });
  ```

  This Cloud Function goes to Oxford Dictionaries and gets a definition, pronunciation, etc. The trigger is a word that is updated at a location in Cloud Firestore.

  Next, an `if` conditional checks if the word is `undefined`. This patches a bug in my controller (I also have a patch in my controller, but I'm being double safe). The `if` conditional uses `change.after.data()` to see the data that was updated in Cloud Firestore. The data is an object so I added `.word` to get the value from the object.

  Next, we make an object with a URL and two headers. The headers have my username and password. The URL includes the updated word, as `change.after.data().word`.

  Next is a callback function that executes when Oxford Dictionaries sends its response. Another conditional checks if the response is an error message. If not, and the status code is 'OK', then the response body is parsed to get the word, which is an object with fields for definitions, pronunciations, etc. The word object

  ### Using Wildcards in Cloud Functions

  In my project, users can request a word, and a Cloud Function sends a request to the online Oxford Dictionaries API. The Oxford Dictionaries then respond with the definition, pronunciation, etc.

  Specifically, the user asks for a word in the browser (an Angular template or view), which sends the word to the Angular controller, which writes the word to a location in Cloud Firebase. A Cloud Function has a listener set to trigger the function when that database location is updated with new data. The Cloud Function sends an HTTP request to the Oxford Dictionaries API. When the response returns asynchronously, the data is written to a location in Cloud Firebase.

  All this works great...if I'm the only user. But what if you, I, and my dog are using the app simultaneously? The execution time for the Cloud Function is typically three to five seconds. I request my favorite word, *bunion*. One second later, you request your favorite word, *sandwich*. Another second later, my dog requests *bone*.

  A few second after your *sandwich* request, your browser displays *bunion*. Huh? That's not the word you requested! A second later it changes to *sandwich*. OK, now you're happy. But then just as you're about to enjoy your *sandwich*, it changes to *bone*!

  A better plan would be for the controller to write to a location in the user's account document in Cloud Firebase. I.e., instead of everyone's words writing to the same location in Cloud Firebase:

  ```js
  firebase.firestore().collection('Oxford_Dictionaries').doc('Word_Request').set({ 'word': word });
  ```

  we instead write to:

  ```js
  firebase.firestore().collection('Users').doc(user.uid).collection('Oxford_Dictionaries').doc('Word_Request').set({ 'word': word });
  ```

  `user.uid` is a unique identifier such as `bghrDFRET57578578aD3`, that comes from `firebase.auth()` when the user logs in.

  To set up the Cloud Function listener to trigger the function, we use `{wildcard}` instead of `user.uid`. It doesn't have to be `{wildcard}`, it can be any name in curly brackets, e.g., `{userID}`.

  ```js
  exports.oxfordDictionariesUS = functions.firestore.document('Users/{userID}/Oxford_Dictionaries/{Word_Request}').onUpdate((change, context) => {

  });
  ```

  `{userID}` covers every `user.uid`.

  Now we want to write the response to the user's account. Let's try this:

  ```js
  admin.firestore().collection('Users').doc({userID}).collection('Oxford_Dictionaries').doc('Word_Response').set({
    'metadata': word.metadata,
    'results': word.results
  });
  ```
  That didn't work.

  The Cloud Function has two arguments, `change` and `context`. Let's log `context.params`:

  ```js
  {
    userID: 'bghrDFRET57578578aD3',
    Word_Request: 'Word_Request'
  }
  ```

  It looks like `context.params.userID` is the `user.uid`. We can write the data to this address:

  ```js
  admin.firestore().collection('Users').doc(context.params.userID).collection('Oxford_Dictionaries').doc('Word_Response').set({
    'metadata': word.metadata,
    'results': word.results
  })
  .then(function() {
    console.log("Document written.");
  })
  .catch(function(error) {
    console.log("Error writing document: ", error);
  })
  ```

  We now have each user's word written "privately" to his or her user account document.


  ## Firebase Storage

  Firebase Storage is a cloud database for storing large files, such as images, audio, or video. There are a couple tricky points.

  ### Metadata

  You can include metadata with your file...

  ### Download URL

  After you upload a file to Firebase Storage you'll might want to download it. For this you need to specify the location of your file, which is called the *reference*. Firebase provides three ways to specify a location in Firebase Storage:

  #### File path and name
  ```js
  firebase.storage.ref('English_Videos/Walker_Climbs_a_Tree/Walker_Climbs_a_Tree_3.mp4');
  ```

  #### Google Cloud Storage URI
  ```js
  firebase.storage.refFromURL('gs://languagetwo-cd94d.appspot.com/English_Videos/Walker_Climbs_a_Tree/Walker_Climbs_a_Tree_3.mp4')
  ```

  #### HTTPS URL
  ```js
  firebase.storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/languagetwo-cd94d.appspot.com/o/English_Videos%2FWalker_Climbs_a_Tree%2FWalker_Climbs_a_Tree_3.mp4');
  ```
  The reference is not the downloadURL. The download URL looks like the HTTPS URL, plus a security token:

  ```js
  https://firebasestorage.googleapis.com/v0/b/languagetwo-cd94d.appspot.com/o/English_Videos%2FWalker_Climbs_a_Tree%2FWalker_Climbs_a_Tree_3.mp4?alt=media&token=6yu7h990-4321-uy78-gf45-09ff0f0ef0e
  ```

  To get the download URL you use the method `getDownloadURL()`:

  ```js
  firebase.storage().ref('English_Videos/Walker_Climbs_a_Tree/Walker_Climbs_a_Tree_3.mp4').getDownloadURL()
  .then(function(url) {
    console.log(url);
  })
  .catch(function(error) {
    console.log(error);
  });
  ```

  or

  ```js
  firebase.storage().refFromURL('gs://languagetwo-cd94d.appspot.com/English_Videos/Walker_Climbs_a_Tree/Walker_Climbs_a_Tree_3.mp4').getDownloadURL()
  .then(function(url) {
    console.log(url);
  })
  .catch(function(error) {
    console.log(error);
  });
  ```

  The Google Cloud Storage URI and the download URL are available in your Firebase Storage console. Click on any file and the information will appear in a window on the right. But you'll likely also want to collect the download URL when you upload a file:

  ```js
  firebase.storage().ref($scope.languageVideos + "/" + $scope.movieOrTvShow + "/" + $scope.videoSource.name).put($scope.videoSource, metadata) // upload to Firebase Storage
  .then(function(snapshot) {
    console.log("Uploaded file to Storage.");
    console.log(snapshot);
    console.log(snapshot.ref.location.path);
    // get downloadURL
  })
  .catch(function(error) {
    console.log(error);
  });
  ```

  The `snapshot` that comes back after you upload a file to Storage doesn't include the download URL. It includes the path but not the Google Cloud Storage URI, the HTTPS URL, or the download URL. So to get the download URL you do a second call to the database:

  ```js
  firebase.storage().ref($scope.languageVideos + "/" + $scope.movieOrTvShow + "/" + $scope.videoSource.name).put($scope.videoSource, metadata) // upload to Firebase Storage
  .then(function(snapshot) {
    console.log("Uploaded file to Storage.");
    firebase.storage().ref(snapshot.ref.location.path).getDownloadURL()   // get downloadURL
    .then(function(url) {
      var $scope.downloadURL = url;
    })
    .catch(function(error) {
      console.log(error);
    });
  })
  .catch(function(error) {
    console.log(error);
  });
  ```

  It'd be nice if Firebase included the Google Cloud Storage URI, the HTTPS URL, and the download URL in the `snapshot` returned after uploading a file, saving one database call.

  ## Conclusion

  That should get you started refactoring your code and migrating to Cloud Firestore. Let's go over again why you'd want to do this. To make your code simpler and shorter? Uh, no. The make your queries better? Probably, but I didn't go into depth on structuring queries, so you may be unconvinced. To reduce bandwidth and processing time, especially on mobile devices? Maybe, but I doubt the differences will be large for most apps. To use deep structures in your data ("normalized"), instead of flat structures ("denormalized")? Nice to have, but not essential for everyone.

  Because the engineers at Google know more about databases than I know, and they're telling us that Cloud Firestore is better than Realtime Database? Yes, and because your database is important. I can make changes in my controllers and views any time I want, but the model (database) is set in stone. You want to start with the best database, and the best data structure, before your project scales into the stratosphere. My data structure in Cloud Firestore is much better than my data structure in Realtime Database. Part of that is just experience, but part is that Cloud Firestore pushes you to structure your data better. It pushes me to nest collections and documents, and to name these semantically. It pushes me to drop repetitive names for collections, documents, and fields. It pushes me to think about when I want an array instead of a collection. Refactoring my project has made my database more solid.
