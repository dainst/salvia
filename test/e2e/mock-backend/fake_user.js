const express = require('express');
const path = require('path');


module.exports = function fakeUser(req, res, next) {
    const test_auth = "Basic dGVzdDp0ZXN0"; //username : test, password : test
    if (req.method === "GET") {
        if(req.headers.authorization === test_auth){
            res.status("200").json({success: true});
        }else{
            res.status("401").json({success: false});
        }

        return;
    }

    next();

};