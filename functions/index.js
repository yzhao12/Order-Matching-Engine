const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.matchOrders = functions.database.ref('/Orders/{ticker}').onWrite(event => {
  orderBook = event.data.val();
  buyBook = orderBook.buy;
  sellBook = orderBook.sell;

  for(var i = 0; i < buyBook.length && i < sellBook.length; i++) {
    if(buyBook[i].shares == sellBook[i].shares && buyBook[i].price >= sellBook[i].price) {
      var buyUser = functions.database.ref('/Users/' + buyBook[i].userid);
      var sellUser = functions.database.ref('/Users/' + sellBook[i].userid);

      buyUser.once('value').then(function(snapshot) {
        buyUser = snapshot.val();
      });
      sellUser.once('value').then(function(snapshot)) {
        sellUser = snapshot.val();
      });

      //adding shares to portfolio for buyer
      portfolio = buyUser.userPortfolio;
});
