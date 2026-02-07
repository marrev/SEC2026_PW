const bcrypt = require("bcryptjs");
const pool = require("../db");

async function seed() {
    const hash1 = await bcrypt.hash("mdp_alice", 10);
    await pool.query("INSERT INTO users (username, mdp) VALUES ($1,$2)",
        ["alice", hash1]
    );

    const hash2 = await bcrypt.hash("mdp_bob", 10);
    await pool.query("INSERT INTO users (username, mdp) VALUES ($1,$2)",
        ["bob", hash2]
    );

    const hash3 = await bcrypt.hash("mdp_charlie", 10);
    await pool.query("INSERT INTO users (username, mdp) VALUES ($1,$2)",
        ["charlie", hash3]
    );

    console.log("Users inserted : OK");
    process.exit;
}

seed()