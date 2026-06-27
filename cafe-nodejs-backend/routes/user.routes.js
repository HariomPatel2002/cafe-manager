const express = require('express');
const router = express.Router();
const connection = require('../connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email, password,role,status from users where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into users(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')"
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
router.post('/login', (req, res) => {
    const user = req.body;
    query = 'select email ,password, role ,status from users where email=?';
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0 || result[0].password != user.password) {
                return res.status(400).json({ message: "Incorrect Password" });
            }
            else if (result[0].status === 'false') {
                return res.status(401).json({ message: "Wait for the Admin Approval" })
            }
            else if (result[0].password === user.password) {
                const response = { email: result[0].email, role: result[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken, message: 'Successfully Login' })
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" })
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgot-password', (req, res) => {
    const user = req.body;
    query = 'select email,password from users where email=?';
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your email" })
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password bt Cafe Management System',
                    html: `<p><b>Your Login detail for cafe Management System</b> <b>Email:</b>` + results[0].email + `<b>Password:</b>` + results[0].password + `Click here to login: http://localhost:4200 </p>`
                }
                transporter.sendMail(mailOptions, (err, result) => {
                    if (!err) {
                        return res.status(200).json({ message: "Email Sent Successfully" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                });
                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;