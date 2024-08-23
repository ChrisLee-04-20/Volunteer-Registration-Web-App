// const express = require('express');
// const router = express.Router();
// const { connectToDB, ObjectId } = require('../utils/DBConnection');
// const eventsCollection = 'events';

// /**
//  * @COMPLETE
//  * @GET Access the Home Page
//  * @SUCCESS show the Home page with recent updated events
//  * @FAILED ask the user to access the page later 
//  */
// router.get('/', async function(req, res) {
//   const db = await connectToDB();

//   try {
//     // let events = await db.collection(eventsCollection).find().limit(3).toArray();
//     let events = await db.collection(eventsCollection).find().toArray();
//     let totalEvents = events.length;

//     let sortedEvent = events.sort((event1, event2) => event2.updatedAt - event1.updatedAt);
//     let result = [];
//     for (let i = 0; i < 3; i++) {
//       result[i] = sortedEvent[i];
//     }

//     events = result;
//     totalEvents = events.length

//     res.render('index', { events, totalEvents } );

//   } catch (err) {
//     res.status(401).render('error', {
//       errorTitle: "Failed to go to Home page",
//       errorMsg: "Please try it later.",
//       redirectPath: "/",
//       btnName: "Home",
//     });
//   } finally {
//     db.client.close();
//   }

// });

// module.exports = router;
