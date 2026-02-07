const JWT_SECRET = "supersecretkey";
const jwt = require("jsonwebtoken");

exports.requireAuth=(req, res, next) =>{
    //lire l'autorisation
    const authHeader = req.header("Authorization");

    //Si on a pas de token
    if(!authHeader){
        return res.status(401).json({error:"No token provided"});
    }

    //Récupère le token sans le "Bearer"
    const token = authHeader.replace("Bearer ", "");

    try{
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }
    catch{
        return res.status(401).json({error:"No token provided"});
    }
}