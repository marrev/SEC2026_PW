const bcrypt = require("bcryptjs");
const pool = require("../db");
exports.signup = async (req, res)=> {
    const {username, password} = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    const userExist = result.rows[0];

    if (userExist) {
        return res.status(409).json({error: "Username already taken"});
    }

    const hash = await bcrypt.hash(password, 10);
    const resultInsert = await pool.query("INSERT INTO users (username, mdp) VALUES ($1,$2)",
        [username, hash]
    );
    console.log("User inserted : OK");

    const user = result;
    return res.status(201).json({user});
}