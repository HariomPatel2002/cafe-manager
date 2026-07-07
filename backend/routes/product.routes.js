const express = require('express');
const router = express.Router();
const connection = require('../connection');
var auth = require('../services/authentication');
const { checkRole } = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole, (req, res) => {
    let product = req.body;
    var query = "insert into products(name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Product Added Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, (req, res) => {
    var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from products as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getByCategory/:id', auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var query = "select * from products where categoryId = ? and status = 'true'";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select * from products where id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update-product', (req, res) => {
    let product = req.body;
    var query = 'update products set name=?, categoryId=?, description=?, price=? where id=?';
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'Product id does not exist' })
            }
            return res.status(200).json({ message: "Product Updated Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete-product/:id', auth.authenticateToken, checkRole, (req, res) => {
    const id = req.params.id;
    var query = "delete from products where id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'Product id does not exist' })
            }
            return res.status(200).json({ message: "Product Deleted Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus', auth.authenticateToken, checkRole, (req, res) => {
    let user = req.body;
    var query = "update products set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'Product id does not exist' })
            }
            return res.status(200).json({ message: "Product Updated Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})
module.exports = router;
