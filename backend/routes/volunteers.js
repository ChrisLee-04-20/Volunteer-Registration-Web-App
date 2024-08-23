const express = require('express');
const router = express.Router();
const passport = require('passport');
const { connectToDB, ObjectId } = require('../utils/DBConnection');
const volunteersCollection = 'volunteers'; 

/**
 * @TESTED
 * @GET /volunteers
 * @DESC Get all volunteers, Only the admin can get all the volunteers
 * @RETURN volunteers json array 
 */
router.get('/', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const db = await connectToDB();

    try {
        let query = {};

        let page = parseInt(req.query.page) || 1;
        let perPage = parseInt(req.query.perPage) || 20;
        let skip = (page - 1) * perPage;

        let total = await db.collection(volunteersCollection).countDocuments(query);

        // default sort by name
        let sort = {
            name: -1
        };

        // const result = await db.collection(volunteersCollection).find().toArray();
        // let result = await db.collection(volunteersCollection).find(query).sort(sort).skip(skip).limit(perPage).toArray();
        let result = await db.collection(volunteersCollection).find(query).sort(sort).toArray();

        res.status(200).json({ volunteers: result, total, page, perPage});
    } catch (err) {
        res.status(400).json({ error: err});
    } finally {
        db.client.close();
    }
})

/**
 * @TESTED
 * @GET /volunteer/:id
 * @DESC Get the volunteer by id
 * @RETURN 
 */
router.get('/:id', async(req, res) => {
    const db = await connectToDB();

    try {
        const result = await db.collection(volunteersCollection).findOne({ _id: new ObjectId(req.params.id) });

        // does not return the volunteer's password to the front-end 
        delete result.password;

        res.status(201).json({ volunteer: result });
    } catch (err) {
        res.status(400).json({ error: err });
    } finally {
        db.client.close();
    }
})

/**
 * @TESTED
 * @POST /volunteer/:id
 * @DESC Create a new volunteer record
 * @RETURN
 */
router.post('/', async(req, res) => {
    const db = await connectToDB();

    try {
        let data = req.body;
        // data.terms = data.terms == 'on';
        data.createdAt = new Date();
        data.updatedAt = new Date();

        const result = await db.collection(volunteersCollection).insertOne(data);

        res.status(201).json({ message: `Your registration is success. Your volunteer id is ${result.insertedId}`});
 
    } catch (err) {
        res.status(401).json({ error: err });
    } finally {
        db.client.close();
    }
});

/**
 * @TESTED
 * @PUT /volunteer/:id
 * @DESC Update the volunteer info
 * @RETURN
 */
router.put('/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const db = await connectToDB();

    try {
        let data = req.body;
        data.updatedAt = new Date();

        // udpate the password if the password is not different
        // const targetVolunteer = await db.collection(volunteersCollection).findOne({ _id: new ObjectId(data._id)});
        if (data.password == null || data.password == '') {
            delete data.password;
        }
        delete data._id

        const result = await db.collection(volunteersCollection).updateOne({ _id: new ObjectId(req.params.id) }, { $set: data });

        if (result.modifiedCount == 1) {
            res.status(201).json({ message: `The volunteer with id ${req.params.id} is updated.`});
        }
    } catch (err) {
        res.status(400).json({ error: err });
    } finally {
        db.client.close();
    }
})

/**
 * @TESTED
 * @DELETE /volunteer/:id
 * @DESC Delete the volunteer record only for the admin
 * @RETURN
 */
router.delete('/:id', passport.authenticate('bearer', { session: false }), async(req, res) => {
    const db = await connectToDB();

    try {
        const result = await db.collection(volunteersCollection).deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount == 1) {
            res.status(201).json({ message: `The volunteer with id ${req.params.id} is deleted.`});
        }

    } catch (err) {
        res.status(400).json({ error: err });
    } finally {
        db.client.close();
    }

})

module.exports = router;