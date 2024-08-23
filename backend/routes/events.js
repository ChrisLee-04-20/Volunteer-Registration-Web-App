const express = require('express');
const router = express.Router();
const eventsCollection = 'events';
const { connectToDB, ObjectId } = require('../utils/DBConnection');
const passport = require('passport');
const successPage = 'success';
const errorPage = 'error';
const { isRay } = require('../utils/auth');

// /**
//  * @COMPLETE
//  * @GET /event                                                          @TESTED  
//  * @SUCCESS render the first page of the events with content            @TESTED
//  * @FAILED render the error page and ask the user to try it later       @TESTED
//  * 
//  * @@COMPLETE
//  * @GET /event/page=?page=:number                                       @TESTED
//  * @SUCCESS render the first page of the events with content            @TESTED
//  * @FAILED render the error page and ask the user to try it later       @TESTED
//  */
// router.get('/', async (req, res) => {
//     const db = await connectToDB();
//     const eventsPerPage = 6;

//     try {
//         const events = await db.collection(eventsCollection).find().limit(6).toArray();
//         const totalEvents = await db.collection(eventsCollection).countDocuments();
//         let currentPageEventCount = 0;
//         let numberOfPages = parseInt(Math.ceil(totalEvents / eventsPerPage));

//         currentPageEventCount = events.length;

//         res.render('events', {
//             events, eventsPerPage, numberOfPages, currentPageEventCount
//         });

//     } catch (err) {
//         console.log(err)
//         res.status(401).render(errorPage, { 
//             errorTitle: "Failed to display the events",
//             errorMsg: "Please try to see the events later.",
//             redirectPath: "/",
//             btnName: "Home",
//         });
//     } finally {
//         db.client.close();
//     }

// }).get('/page', async (req, res) => {
//     const db = await connectToDB();
//     const eventsPerPage = 6;

//     try {
//         let currentPage = parseInt(req.query.page);
//         let skip = (currentPage - 1) * eventsPerPage;
//         let currentPageEventCount = 0;

//         const totalEvents = await db.collection(eventsCollection).countDocuments();
//         const events = await db.collection(eventsCollection).find().skip(skip).limit(eventsPerPage).toArray();
//         let numberOfPages = parseInt(Math.ceil(totalEvents / eventsPerPage));

//         currentPageEventCount = events.length;

//         res.render('eventsPage', {
//             events, currentPage, totalEvents, eventsPerPage, numberOfPages, currentPageEventCount
//         });

//     } catch (err) {
//         res.status(401).render(errorPage, { 
//             errorTitle: "Failed to display the events",
//             errorMsg: "Please try to see the events later.",
//             redirectPath: "/",
//             btnName: "Home",
//         });
//     } finally {
//         db.client.close();
//     }
// });

// /**
//  * @COMPLETE
//  * @GET /event/new display the form to create the event                     @TESTED
//  * 
//  * @POST /event/new send the data to the db                                 @TESTED
//  * @SUCCESS redirect to success page and display the insertedId             @TESTED
//  *          and add a button to redirect the new event detail page  
//  * @FAILED redirect to error page and ask the user to fill the form again   @TESTED
//  *         and add a button to redirect the create new event page
//  */
// // router.get('/new', (req, res) => {
// //     res.render('eventNew');
// // })
// router.post('/new', async (req, res) => {
//     const db = await connectToDB();

//     try {
//         const data = req.body;
//         data.highlight = data.highlight == 'on';
//         data.createdAt = new Date();
//         data.updatedAt = new Date();

//         // change the datetime type from 'string' to 'date' in ISO Format
//         data.datetime = new Date(data.datetime);

//         const result = await db.collection(eventsCollection).insertOne(data);

//         if (result) {
//             res.status(201).json({ message: `The new event id is ${result.insertedId}.` });
//             // res.status(201).render(successPage, {
//             //     successTitle: 'Successfully create the new event',
//             //     successMsg: 'The new event id is ' + result.insertedId,
//             //     redirectPath: '/event/detail/' + result.insertedId,
//             //     btnName: 'Go to new event'
//             // });
//             return;
//         }

//         throw Error("Cannot create the event");

//     } catch (err) {
//         res.status(401).json({ error: err });
//         // console.log(err);
//         // res.status(401).render(errorPage, {
//         //     errorTitle: "Failed to create the new event",
//         //     errorMsg: "Please refill the form and submit it again.",
//         //     redirectPath: "/event/new",
//         //     btnName: "Go to create event",
//         // });
//     } finally {
//         db.client.close();
//     }
// });

// /**
//  * @COMPLETE
//  * @GET /event/detail/:id                                                   @TESTED
//  * @SUCCESS redirect to event detail page and display event detail          @TESTED
//  * @FAILED redirect to error page and ask the user to find other event      @TESTED
//  *         and add a button to redirect the events page
//  */
// router.get('/detail/:id', async (req, res) => {
//     const db = await connectToDB();
//     try {
//         const event = await db.collection(eventsCollection).findOne({ _id: new ObjectId(req.params.id) });

//         if (event) {
//             res.status(201).json({ event });
//             // res.render('eventDetail', { event });
//             return;
//         }

//         throw Error("Cannot find the event");

//     } catch (err) {
//         res.status(401).json({ error: err });
//         // res.status(401).render(errorPage, { 
//         //     errorTitle: "Failed to find the event detail",
//         //     errorMsg: "Please find other event.",
//         //     redirectPath: "/event",
//         //     btnName: "Go to Events",
//         // });
//     } finally {
//         db.client.close();
//     }
// })

// /**
//  * @COMPLETE
//  * @GET /event/edit/:id                                                                    @TESTED
//  * @SUCCESS redirect to event edit page and provide the form which displays the current    @TESTED
//  *          data of the event and allow user to edit, delete and save
//  * @FAILED redirect to error page and ask the user to find the event again                 @TESTED
//  * 
//  * @POST /event/edit/:id                                                                   @TESTED
//  * @SUCCESS redirect to success page and display the insertedId                            @TESTED
//  *          and add a button to redirect the new event detail page                          
//  * @FAILED redirect to error page and ask the user delete it again                         @TESTED
//  *         and add a button to redirect the delete target event edit page
//  */
// router.get('/edit/:id', async (req, res) => {
//     const db = await connectToDB();

//     try {
//         const result = await db.collection(eventsCollection).findOne({ _id: new ObjectId(req.params.id) });

//         if (result) {
//             res.render('eventEdit', { event: result });
//             return;
//         }

//         throw Error("The target edit event not found!");

//     } catch (err) {
//         res.status(401).render(errorPage, { 
//             errorTitle: "Failed to find the target event to edit",
//             errorMsg: "Please try to find the event again.",
//             redirectPath: "/event",
//             btnName: "Go to Events",
//         });
//     } finally {
//         db.client.close();
//     }
// }).post('/edit/:id', async (req, res) => {
//     const db = await connectToDB();

//     try {
//         let data = req.body;
//         data.highlight = data.highlight == "on";
//         data.updatedAt = new Date();

//         // change the datetime type from 'string' to 'date' in ISO Format
//         data.datetime = new Date(data.datetime);

//         const result = await db.collection(eventsCollection).updateOne({ _id: new ObjectId(req.params.id) }, { $set: data });

//         if (result.modifiedCount == 1) {
//             res.status(201).render(successPage, { 
//                 successTitle: 'Successfully edit the event',
//                 successMsg: 'The event with id ' + req.params.id + ' is updated',
//                 redirectPath: '/event/detail/' + req.params.id,
//                 btnName: 'Go to updated event detail'
//             });
//             return;
//         }

//         throw Error("Cannot update the event");

//     } catch (err) {
//         res.status(401).render(errorPage, { 
//             errorTitle: "Failed to update the event",
//             errorMsg: "Please try to update it again.",
//             redirectPath: "/event/edit/" + req.params.id,
//             btnName: "Go back to edit event",
//         });
//     } finally {
//         db.client.close();
//     }
// });

// /**
//  * @COMPLETE
//  * @POST /event/delete/:id                                                  @TESTED
//  * @SUCCESS redirect to success page and display the deleted id             @TESTED
//  *          and add a button to redirect the events page                    
//  * @FAILED redirect to error page and ask the user delete it again          @TESTED
//  *         and add a button to redirect the delete target event edit page
//  */
// router.post('/delete/:id', async (req, res) => {
//     const db = await connectToDB();

//     try {
//         const result = await db.collection(eventsCollection).deleteOne({ _id: new ObjectId(req.params.id) });

//         if (result.deletedCount == 1) {
//             res.status(201).render(successPage, { 
//                 successTitle: 'Successfully delete the event',
//                 successMsg: 'The deleted event id is ' + req.params.id,
//                 redirectPath: '/event',
//                 btnName: 'Go to Events'
//             });
//             return;
//         }

//         throw Error("Cannot delete the event");

//     } catch (err) {
//         res.status(401).render(errorPage, {
//             errorTitle: "Failed to delete the event",
//             errorMsg: "Please delete it again.",
//             redirectPath: "/event/edit/" + req.params.id,
//             btnName: "Go back to edit event",
//         });
//     } finally {
//         db.client.close();
//     }
// });

/**
 * @GET
 */
router.get('/', async (req, res) => {
    const db = await connectToDB();

    try {
        let query = {};

        // search by the keywords
        // 2023/11/13 handle partical search later
        if (req.query.keywords) {
            let keywords = req.query.keywords;

            query.eventTitle = { 
                $regex: keywords, 
                $options: "i"
            };

            // query.description = { $regex: keywords, $options: "i" };
            // query.location = { $regex: keywords, $options: "i" };
        }

        let page = parseInt(req.query.page) || 1;
        let perPage = parseInt(req.query.perPage) || 6;
        let skip = (page - 1) * perPage;

        let total = await db.collection(eventsCollection).countDocuments(query);

        // default sort by updatedAt in desc order 
        let sort = {
            updatedAt: -1
        };

        let result = await db.collection(eventsCollection).find(query).sort(sort).skip(skip).limit(perPage).toArray();

        res.status(201).json({ events: result, total: total, page: page, perPage: perPage });

    } catch (err) {

    }

})

/**
 * @GET /api/v1/events/:id
 * @DESC Get the event by id
 */
router.get('/:id', async (req, res) => {
    const db = await connectToDB();

    try {
        const result = await db.collection(eventsCollection).findOne({ _id: new ObjectId(req.params.id) });

        if (result) {
            res.status(201).json({ event: result });
        }

    } catch (err) {
        res.status(401).json({ error: err });
    }
})

/**
 * @POST /api/v1/events
 * @DESC Add the new event record
 */
router.post('/', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const db = await connectToDB();

    try {
        const data = req.body;
        data.createdAt = new Date();
        data.updatedAt = new Date();

        // change the datetime type from 'string' to 'date' in ISO Format
        data.datetime = new Date(data.datetime);

        const result = await db.collection(eventsCollection).insertOne(data);

        if (result.insertedId) {
            res.status(201).json({ message: `The new event id is ${result.insertedId}.`, _id: `${result.insertedId}` })
        }

    } catch (err) {
        res.status(401).json({ error: err });
    }
})

/**
 * @PUT /api/v1/events/:id
 * @DESC Update the current event record
 */
router.put('/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const db = await connectToDB();

    try {
        const data = req.body;
        const id = data._id;
        data.updatedAt = new Date();

        // change the datetime type from 'string' to 'date' in ISO Format
        data.datetime = new Date(data.datetime);
        if (data.volunteersList) {
            let formattedList = data.volunteersList.map((id) => { return new ObjectId(id) }); 
            data.volunteersList = formattedList;   
        }

        delete data._id

        const result = await db.collection(eventsCollection).updateOne({ _id: new ObjectId(req.params.id) }, { $set: data });

        if (result.modifiedCount == 1) {
            res.status(201).json({ message: `The event is updated with id ${id}.` })
        }

    } catch (err) {
        res.status(401).json({ error: err });
    }
})

/**
 * @DELETE /api/v1/events/:id
 * @DESC Delete the current event record
 */
router.delete('/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const db = await connectToDB();

    try {
        const result = await db.collection(eventsCollection).deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount == 1) {
            res.status(201).json({ message: `The event with id ${req.params.id} is deleted.` })
        }

    } catch (err) {
        res.status(401).json({ error: err });
    }
})

module.exports = router;