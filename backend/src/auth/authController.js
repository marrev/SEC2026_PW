const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../db");

const JWT_SECRET = "supersecretkey";

exports.login = async (req, res)=>{
    const {username, password} = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    const user = result.rows[0];

    if(!user){
        return res.status(401).json({error:"Invalid credentials"});
    }

    //Password -> mdp envoyé par le user en clair
    //user.mdp -> mdp crypté en base
    //bcrypt.compare -> crypté le password et de comparer les 2 passwords cryptés
    const isMatch = await bcrypt.compare(password, user.mdp);

    if(!isMatch){
        return res.status(401).json({error:"Invalid credentials"});
    }

    const token = jwt.sign({id:user.user_id, username:user.username}, JWT_SECRET, {expiresIn:"1h"});

    return res.json({token});
}

/**
 * Get /api/me (protégé)
 * req.user vient de middleware
*/
exports.me = async (req,res)=>{
    return res.json({
        user:{
            id: req.user.id,
            username: req.user.username,
        },
    });
};
