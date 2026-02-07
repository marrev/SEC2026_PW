import { useEffect, useState } from "react";
import BriefEvent from "../Component/BriefEvent.tsx";
import { getPublicEvent } from "../API/event-actions.ts";
import type { EventModel } from "../utils/types.ts";

export default function HomePage(){
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPublicEvent()
            .then((list) => {
                setEvents(list);
                setError(null);
            })
            .catch((e) => {
                setError(e?.message ?? String(e));
                setEvents([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="stack">
            <h1>Événements publics en cours</h1>

            {loading ? <p className="helper">Chargement…</p> : null}
            {error ? <div className="error">{error}</div> : null}

            <div className="events-grid">
                {!loading && !error && events.length === 0 ? (
                    <p className="helper">Aucun événement public pour le moment.</p>
                ) : null}

                {events.map((ev) => (
                    <BriefEvent key={ev.event_id} event={ev} />
                ))}
            </div>
        </div>
    );
}