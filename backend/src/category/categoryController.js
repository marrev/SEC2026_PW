const pool = require("../../db");

exports.getAllCategory = async(req,res)=>{
    const reqSQL = "SELECT * FROM categories;"

    const result = await pool.query(reqSQL);
    const categories = result.rows;

    if(!categories){
        return res.status(500).json({error:"Server error"});
    }
    return res.json({categories});
}