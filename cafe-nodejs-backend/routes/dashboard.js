const express = require('express');
const router = express.Router();
const connection = require('../connection');
const auth = require('../services/authentication');

router.get('/details',auth.authenticateToken,(req,res)=>{
    var categoryCount;
    var productCount;
    var billCount;
    var query = "select count(id) as cateoryCount *from category";
    connection.query(query,(err,result)=>{
        if(!err){
            categoryCount = result[0].categoryCount;
        }
        else{
            return res.status(500).json(err);
        }
    })
    var query = "select count(id) as productCount *from product"
    connection.query(query,(err,result)=>{
        if(!err){
            productCount = result[0].productCount;
        }
        else{
            return res.status(500).json(err);
        }
    })
    var query = "select count(id) as billCount *from bills";
    connection.query(query,(err,result)=>{
        if(!err){
            billCount = result[0].billCount;
            var data = {
                category: categoryCount,
                product: productCount,
                bill: billCount
            }
            return res.status(200).json(data);
        }
        else{
            return res.status(500).json(err);
        }
    })

})

module.exports = router;