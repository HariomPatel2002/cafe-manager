const express = require('express');
const router = express.Router();
const connection = require('../connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRole')


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

router.get('/get',auth.authenticateToken, (req, res) => {
    var query = "select id, name,email,contactNumber,status from users where role= 'user'";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update',auth.authenticateToken, (req, res) => {
    let user = req.body;

    // First get current status
    var selectQuery = "SELECT status FROM users WHERE id = ?";
    connection.query(selectQuery, [user.id], (err, result) => {
        if (!err) {
            if (result.length == 0) {
                return res.status(404).json({ message: "User id does not exist" });
            }

            // Toggle status
            const currentStatus = result[0].status;
            const newStatus = currentStatus === 'true' ? 'false' : 'true';

            var updateQuery = "UPDATE users SET status = ? WHERE id = ?";
            connection.query(updateQuery, [newStatus, user.id], (err, result) => {
                if (!err) {
                    return res.status(200).json({ message: "User Updated Successfully" });
                } else {
                    return res.status(500).json(err);
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"true"})
})

router.post('/change-password', auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.user.email;
    var query = "select * from users where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update users set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Updated Successfully" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;