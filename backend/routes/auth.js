const express = require('express');
const router = express.Router();
const volunteersCollection = 'volunteers';
const usersCollection = 'users';
const { connectToDB, ObjectId } = require('../utils/DBConnection');
const { generateToken } = require('../utils/auth');

/**
 * @POST /api/v1/auth/login
 * 
 */
router.post('/login', async(req, res) => {
    const db = await connectToDB();
    let isLoginSuccess = false;

    try {
        const email = req.body.email;
        const password = req.body.password;
        
        // if the user is volunteer or not
        let user = await db.collection(volunteersCollection).findOne({ email: email });

        if (user) {
            isLoginSuccess = user.password == password;

            if (isLoginSuccess) {
                delete user.password;

                // generate the token
                const token = generateToken(user);
                res.status(200).json({ message: `Welcome ${user.name}.`, token: token });
            } else {
                res.status(401).json({ error: "The password is incorrect."});
            }
            return;
        }


        // check the user is admin or not
        user = await db.collection(usersCollection).findOne({ email: email });
        if (user) {
            isLoginSuccess = user.password == password;

            if (isLoginSuccess) {
                delete user.password;

                // generate the token
                const token = generateToken(user);
                res.status(200).json({ message: `Welcome ${user.name}.`, token: token });
            } else {
                res.status(401).json({ error: "The password is incorrect."});
            }
            return;
        }

        res.status(401).json({ error: "User not found" });
    } catch (err) {
        res.status(401).json({ error: err });
    } finally {
        await db.client.close();
    }

});

module.exports = router;