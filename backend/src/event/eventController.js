const pool = require("../../db");

exports.publicEvent = async (req,res)=>{
    const reqSQL = "SELECT " +
        "e.event_id,"+
        "e.nom,"+
        "e.descr,"+
        "e.event_date,"+
        "e.public,"+
        "e.max_inscriptions,"+
        "e.category_id,"+
        "c.nom AS category_name,"+
        "e.creator_id,"+
        "u.username AS creator_name,"+
        "COUNT(ue.user_id) AS nb_inscrits "+
        "FROM events e " +
        "JOIN categories c ON c.category_id = e.category_id " +
        "JOIN users u ON u.user_id = e.creator_id " +
        "LEFT JOIN users_events ue ON ue.event_id = e.event_id "+
        "WHERE e.public = true " +
        "GROUP BY "+
        "e.event_id, e.nom, e.descr, e.event_date, e.public, e.max_inscriptions, "+
        "e.category_id, c.nom, "+
        "e.creator_id, u.username "+
        "ORDER BY e.event_date ASC, LOWER(e.nom) ASC;"
    const result = await pool.query(reqSQL);
    const events = result.rows;

    if(!events){
        return res.status(500).json({error:"Server error"});
    }
    return res.json({events});
};

exports.allEvents = async(req,res)=>{
    const userId = req.user.id;

    const reqSQL = "SELECT " +
        "e.event_id,"+
        "e.nom,"+
        "e.descr,"+
        "e.event_date,"+
        "e.public,"+
        "e.max_inscriptions,"+
        "e.category_id,"+
        "c.nom AS category_name,"+
        "e.creator_id,"+
        "u.username AS creator_name,"+
        "COUNT(ue.user_id) AS nb_inscrits, "+
        "EXISTS ( " +
        "  SELECT 1 FROM users_events ue2 " +
        "  WHERE ue2.event_id = e.event_id AND ue2.user_id = $1 " +
        ") AS is_registered " +
        "FROM events e " +
        "JOIN categories c ON c.category_id = e.category_id " +
        "JOIN users u ON u.user_id = e.creator_id " +
        "LEFT JOIN users_events ue ON ue.event_id = e.event_id "+
        "GROUP BY "+
        "e.event_id, e.nom, e.descr, e.event_date, e.public, e.max_inscriptions, "+
        "e.category_id, c.nom, "+
        "e.creator_id, u.username "+
        "ORDER BY e.event_date ASC, LOWER(e.nom) ASC;"
    const result = await pool.query(reqSQL, [userId]);
    const events = result.rows;

    if(!events){
        return res.status(500).json({error:"Server error"});
    }
    return res.json({events});
};

exports.createdByEvents = async(req,res)=>{
    const userId = req.user.id;

    const reqSQL = "SELECT " +
        "e.event_id,"+
        "e.nom,"+
        "e.descr,"+
        "e.event_date,"+
        "e.public,"+
        "e.max_inscriptions,"+
        "e.category_id,"+
        "c.nom AS category_name,"+
        "e.creator_id,"+
        "u.username AS creator_name,"+
        "COUNT(ue.user_id) AS nb_inscrits "+
        "FROM events e " +
        "JOIN categories c ON c.category_id = e.category_id " +
        "JOIN users u ON u.user_id = e.creator_id " +
        "LEFT JOIN users_events ue ON ue.event_id = e.event_id "+
        "WHERE creator_id = $1 " +
        "GROUP BY "+
        "e.event_id, e.nom, e.descr, e.event_date, e.public, e.max_inscriptions, "+
        "e.category_id, c.nom, "+
        "e.creator_id, u.username "+
        "ORDER BY e.event_date ASC, LOWER(e.nom) ASC;"
    const result = await pool.query(reqSQL,[userId]);
    const events = result.rows;

    if(!events){
        return res.status(500).json({error:"Server error"});
    }
    return res.json({events});
};

exports.createEvent = async(req,res)=>{
    const {event} = req.body;
    const reqSQL = "INSERT INTO events ( "+
        "nom,descr,event_date,public, max_inscriptions, category_id, creator_id) "+
        "VALUES ($1,$2,$3,$4,$5,$6,$7);"

    const result = await pool.query(reqSQL,
        [event.nom,
        event.descr,
        event.event_date,
        event.public,
        event.max_inscriptions,
        event.category_id,
        req.user.id,
    ]);

    console.log("Event inserted : OK");

    const eventRes = result;
    return res.status(201).json({eventRes});
}

exports.changeEvent = async(req,res)=>{
    const {event} = req.body;

    //Sécurité
    const check = await pool.query(
        "SELECT creator_id FROM events WHERE event_id = $1",
        [event.event_id]
    );

    if (check.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
    }

    const creatorId = check.rows[0].creator_id;
    if (creatorId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
    }

    // Changements des valeurs de l'évènement
    const reqSQL = "UPDATE events "+
        "SET "+
        "nom = $1, "+
        "descr = $2, "+
        "event_date = $3, "+
        "category_id = $4, "+
        "public = $5, "+
        "max_inscriptions = $6 "+
        "WHERE event_id = $7;"

    const result = await pool.query(reqSQL,
        [event.nom,
        event.descr,
        event.event_date,
        event.category_id,
        event.public,
        event.max_inscriptions,
        event.event_id]);

    return res.json({ event: result.rows[0] });
}

exports.deleteEvent = async(req,res)=>{
    const {event} = req.body;

    // Sécurité
    const check = await pool.query(
        "SELECT creator_id FROM events WHERE event_id = $1",
        [event.event_id]
    );

    if (check.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
    }

    if (check.rows[0].creator_id !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
    }

    // Supression de l'évènement
    const reqSQL = "DELETE FROM events WHERE event_id = $1;"
    await pool.query(reqSQL,[event.event_id]);
    return res.json({ success: true });
}