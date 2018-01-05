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
  var promises = [];

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
      var portfolio = buyUser.userPortfolio;
      var found = portfolio.findIndex(function(element) {return element.ticker === ticker});
      if(found !== -1) {
        portfolio[found].shares = portfolio[found].shares + buyBook[i].shares;
        buyUser.userPortfolio = portfolio;
        promises.push(functions.database.ref('/Users/' + buyBook[i].userid).set(buyUser));
      }
      /*
      for(var j = 0; j < portfolio.length; j++) {
        if(portfolio[j].ticker === ticker) {
          portfolio[j].shares = portfolio[j].shares + buyBook[i].shares;
          buyUser.userPortfolio = portfolio;
          buyUser.set(functions.database.ref('/Users/' + buyBook[i].userid);
        }
      }
      */

    }
  }

});
