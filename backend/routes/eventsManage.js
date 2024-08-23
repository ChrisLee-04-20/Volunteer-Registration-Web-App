const express = require('express');
const router = express.Router();
const eventsCollection = 'events';
const volunteersCollection = 'volunteers';
const { connectToDB, ObjectId } = require('../utils/DBConnection');
const { isRay } = require('../utils/auth');

/**
 * @GET /api/v1/events/manage/getVolunteerRecord/:id
 * @DESC Get the specified volunteer-joined event record
 */
router.get('/getVolunteerRecord/:id', async (req, res) => {
    const db = await connectToDB();

    const volunteerId = req.params.id;

    try {
        let result = await db.collection(volunteersCollection).aggregate([
            {
                $lookup: {
                    from: eventsCollection,
                    localField: "_id",
                    foreignField: "volunteersList",
                    as: "joinedEvent"
                },
            }, 
            {
                $project: { password: 0}
            }
        ]).toArray();

        result = result.filter((volunteer) => volunteer._id == volunteerId)

        res.status(201).json(result);

    } catch (err) {
        console.log(err);
        res.status(401).json({ error: err });
    } finally {
        db.client.close();
    }
})

/**
 * @GET /api/v1/events/manage/getVolunteersDetail/:id
 * @DESC Event maps with the volunteer
 * Only the admin can get the list
 * @RETURN Get the joined event volunteers list with the detail with the array
 */
router.get('/getVolunteersDetail/:id', isRay, async (req, res) => {
    const db = await connectToDB();

    const eventId = req.params.id;

    try {
        let result = await db.collection(eventsCollection).aggregate([
            {
                $lookup: {
                    from: volunteersCollection,
                    localField: "volunteersList",
                    foreignField: "_id",
                    as: "volunteerRecords"
                }
            },
        ]).toArray();

        result = result.filter((event) => event._id == eventId)

        res.status(201).json(result[0].volunteerRecords);

    } catch (err) {
        console.log(err);
        res.status(401).json({ error: err });
    } finally {
        db.client.close();
    }
})

/**
 * @GET /api/v1/events/manage/getVolunteerEventsOrganizer/:id
 * @DESC get the data for the volunteer joined events' organizer
 * @RETURN
 */
router.get('/getVolunteerEventsOrganizer/:id', async (req, res) => {
    const db = await connectToDB();

    const volunteerId = req.params.id;

    try {
        let result = await db.collection(volunteersCollection).aggregate([
            {
                $lookup: {
                    from: eventsCollection,
                    localField: "_id",
                    foreignField: "volunteersList",
                    as: "joinedEvent"
                }
            },
        ]).toArray();

        result = result.filter((volunteer) => volunteer._id == volunteerId)

        // count the event organizer into new Array
        const joinedEvent = result[0].joinedEvent;
        const data = [];

        if (joinedEvent) {
            joinedEvent.forEach((event) => {
                let isAdded = false
                data.forEach((record) => {
                    if (record._id == event.organizer && !isAdded) {
                        record.total = record.total + 1;
                        isAdded = true;
                    }
                });

                // create new record for that event organizer
                if (!isAdded) {
                    data.push({
                        _id: event.organizer,
                        total: 1
                    });
                }
            });
        } else {
            return res.status(401).json({ error: "No record is found."})
        }

        res.status(201).json(data);

    } catch (err) {
        console.log(err);
        res.status(401).json({ error: err });
    } finally {
        db.client.close();
    }
})

/**
 * @POST /api/v1/events/manage
 * @DESC allow volunteer to join the event if the quota is not full
 * Update the volunteersList in the event record
 */
router.post('/', async (req, res) => {
    const db = await connectToDB();

    try {
        const eventId = req.body.eventId;
        const volunteerId = req.body.volunteerId;

        let targetEvent = await db.collection(eventsCollection).findOne({ _id: new ObjectId(eventId) });
        let targetVolunteer = await db.collection(volunteersCollection).findOne({ _id: new ObjectId(volunteerId) });
        let quota = targetEvent.quota;

        let eventRecord = await db.collection(eventsCollection).findOne({ _id: new ObjectId(eventId) });
        let result;

        if (eventRecord.volunteersList) {
            if (eventRecord.volunteersList.length >= quota) {
                res.status(401).json({ error: "The event quota is full." });
                return;
            }
            eventRecord.volunteersList.push(new ObjectId(volunteerId));
        } else {
            eventRecord.volunteersList = [new ObjectId(volunteerId)];
            delete eventRecord._id;
        }

        result = await db.collection(eventsCollection).updateOne({ _id: new ObjectId(eventId) }, { $set: eventRecord });

        if (result.acknowledged) {
            return res.status(201).json({ message: "You join the event successfully." });
        }

        res.status(401).json({ error: "Failed to join the event." });

    } catch (err) {
        console.log(err);
    } finally {
        db.client.close();
    }
})

/**
 * @POST /api/v1/events/manage/removeVolunteer
 * @DESC Remove volunteer from the event
 */
router.post('/removeVolunteer', isRay, async (req, res) => {
    const db = await connectToDB();

    try {
        const eventId = req.body.eventId;
        const volunteerId = req.body.volunteerId;

        let targetEvent = await db.collection(eventsCollection).findOne({ _id: new ObjectId(eventId) });
        let targetVolunteer = await db.collection(volunteersCollection).findOne({ _id: new ObjectId(volunteerId) });

        const udpatedVolunteerList = targetEvent.volunteersList = targetEvent.volunteersList.filter(id => id != volunteerId);
        
        console.log(udpatedVolunteerList);

        delete targetEvent._id;

        let result = await db.collection(eventsCollection).updateOne({ _id: new ObjectId(eventId) }, { $set: { volunteersList: udpatedVolunteerList } });

        if (result.acknowledged) {
            res.status(201).json({ message: `Removed volunteer ${targetVolunteer.name} from the event ${targetEvent.eventTitle}.` });
            return;
        }

        res.status(401).json({ error: "Cannot remove the volunteer from the event." });
    } catch (err) {
        res.status(401).json({ error: err });
        console.log(err);
    } finally {
        db.client.close();
    }
})

module.exports = router;