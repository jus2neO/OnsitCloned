const jwt = require('jsonwebtoken');
const SecretModelClass = require('../models/secret.js');

//get secrets
const getAllSecret = async () => {
    try{
      return new Promise((myResolve, myReject) => {
        SecretModelClass.get_all().then((value) => 
        {
          return myResolve(value);
        })
        .catch((error) => {
          return myReject(error);
        });
      }); 
    } catch(err) {
        return err;
    }
  }

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization');
    // Check of no token
    if(!token) return res.status(401).json({msg: "Authorization denied."});
    const newToken = token.split("Bearer ");
    if(newToken.length < 2) return res.status(401).json({msg: "Authorization denied."});

    const mysecret = await getAllSecret().then((res) => {
        return res[0].secret;
    }).catch((err) => {return "error"});
      
    if(mysecret === "error"){
        return res.status(400).json("Server error");
    }

    // Verify token
    try{
        const decoded = jwt.verify(newToken[1], mysecret);

        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({msg: "Token is not valid."})
    }
}