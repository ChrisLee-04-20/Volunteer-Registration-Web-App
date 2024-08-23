// const express = require('express');
// const router = express.Router();
// const { connectToDB, ObjectId } = require('../utils/DBConnection');
// const volunteersCollection = 'volunteers'; 

// // 2023/11/07 no need to use in assignment 2
// /**
//  * @GET /become/volunteer
//  * @DESC Display the volunteer registration pages 
//  */
// // router.get('/', (req, res) => {
// //     res.render('volunteerRegistration');
// // });

// // 2023/11/07 update to the REST API
// /**
//  * @POST /become/volunter
//  * @DESC handle the volunteer registration form submission  
//  * @SUCCESS redirect to success page and display the insertedId
//  *          and add a button to redirect the events page
//  * @FAILED redirect to error page and ask the user to fill the form again
//  *         and add a button to redirect the volunteer registration page
//  */
// router.post('/', async(req, res) => {
//     const db = await connectToDB();

//     try {
//         let data = req.body;
//         data.terms = data.terms == 'on';
//         data.createdAt = new Date();
//         data.updatedAt = new Date();

//         const result = await db.collection(volunteersCollection).insertOne(data);

//         res.status(201).json({ message: `Your registration is success. Your volunteer id is ${result.insertedId}`});

//         // res.status(201).render('success', { 
//         //     successTitle: "Your registration is success",
//         //     successMsg: "This is your registration id is " + result.insertedId + ".",
//         //     redirectPath: "/event",
//         //     btnName: "Go to Events",
//         // });
 
//     } catch (err) {
//         res.status(401).json({ error: err });

//         // console.log(err); 
//         // res.status(400).render('error', { 
//         //     errorTitle: "Failed to sumbit the registration form",
//         //     errorMsg: "Please refill the form and submit it again.",
//         //     redirectPath: "/become/volunteer",
//         //     btnName: "Go to registration",
//         // });
//     } finally {
//         db.client.close();
//     }
// });

// module.exports = router;