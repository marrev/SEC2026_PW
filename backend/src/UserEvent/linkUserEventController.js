const pool = require("../../db");

exports.subscribeEvent = async (req, res) => {
    const userId = req.user.id;
    const { event_id } = req.body;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Verrouille la ligne event (empêche 2 inscriptions concurrentes de passer)
        const evRes = await client.query(
            "SELECT max_inscriptions FROM events WHERE event_id = $1 FOR UPDATE",
            [event_id]
        );

        if (evRes.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Event not found" });
        }

        const max = Number(evRes.rows[0].max_inscriptions);

        // Si limité, on compte les inscrits (dans la même transaction)
        if (max > 0) {
            const countRes = await client.query(
                "SELECT COUNT(*)::int AS nb FROM users_events WHERE event_id = $1",
                [event_id]
            );
            const nb = Number(countRes.rows[0].nb);

            if (nb >= max) {
                await client.query("ROLLBACK");
                return res.status(409).json({ error: "Event full" });
            }
        }

        // Inscription (ON CONFLICT DO NOTHING => déjà inscrit)
        const insRes = await client.query(
            "INSERT INTO users_events (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userId, event_id]
        );

        await client.query("COMMIT");

        // Si déjà inscrit, insRes.rowCount = 0
        return res.status(201).json({ success: true, already_registered: insRes.rowCount === 0 });
    } catch (e) {
        await client.query("ROLLBACK");
        return res.status(500).json({ error: "Server error" });
    } finally {
        client.release();
    }
};

exports.unsubscribeEvent = async(req,res)=>{
    const userId = req.user.id;
    const {event_id} = req.body;
    const reqSQL = "DELETE FROM users_events WHERE "+
        "user_id = $1 AND event_id = $2;"

    const result = await pool.query(reqSQL,
        [userId, event_id]);

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Inscription introuvable" });
    }

    console.log("Event unsubscribe : OK");

    return res.json({ success: true });
}

exports.getEventParticipants = async (req, res) => {
    const eventId = Number(req.params.id);
    if (!Number.isFinite(eventId)) return res.status(400).json({ error: "Invalid event id" });

    const reqSQL = "SELECT u.user_id, u.username, ue.date_inscription "+
        "FROM users_events ue "+
        "JOIN users u ON u.user_id = ue.user_id "+
        "WHERE ue.event_id = $1 "+
        "ORDER BY ue.date_inscription ASC, LOWER(u.username) ASC;"

    const result = await pool.query(reqSQL,[eventId]);

    return res.json({ participants: result.rows });
};