const express = require('express');
const { router } = express.Router();
const connection = require('../connection');

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email, password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,email,password,status,role) values(?,?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        res.status(200).json({ message: 'User successfully Registered' });
                    }
                    else {
                        res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Email Already Exists" })
            }
        }
        else {
            res.status(500).json(err);
        }
    })
})

module.exports = router;