import { useEffect, useMemo, useState } from "react";
import type {EventModel, Participant} from "../utils/types";
import { getEventParticipants} from "../API/linkUserEvent-actions.ts";
import "./styles/consultEvent.scss";

type Props = {
    event: EventModel;
    onClose: () => void;
};

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(d);
}

export default function ConsultEvent({ event, onClose }: Props) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const date = useMemo(() => formatDateTime(event.event_date), [event.event_date]);

    useEffect(() => {
        let alive = true;

        setLoading(true);
        setError(null);

        getEventParticipants(event.event_id)
            .then((list) => {
                if (!alive) return;
                setParticipants(list);
            })
            .catch((e) => {
                if (!alive) return;
                setError(e?.message ?? String(e));
                setParticipants([]);
            })
            .finally(() => {
                if (!alive) return;
                setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [event.event_id]);

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <h2 style={{ margin: 0 }}>{event.nom}</h2>
                    <button className="button" onClick={onClose} type="button">Fermer</button>
                </div>

                <div className="modal-body">
                    <div className="detail-grid">
                        <div><strong>Date</strong><div>{date}</div></div>
                        <div><strong>Catégorie</strong><div>{event.category_name}</div></div>
                        <div><strong>Créateur</strong><div>{event.creator_name}</div></div>
                        <div><strong>Visibilité</strong><div>{event.public ? "🌍 Public" : "🔒 Privé"}</div></div>
                        <div>
                            <strong>Inscriptions</strong>
                            <div>
                                {event.max_inscriptions === 0
                                    ? `${event.nb_inscrits} inscrit(s)`
                                    : `${event.nb_inscrits} / ${event.max_inscriptions}`}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <strong>Description</strong>
                        <div style={{ marginTop: 6 }}>
                            {event.descr ? event.descr : <em>Aucune description.</em>}
                        </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <strong>Participants</strong>

                        {loading ? <p className="helper">Chargement…</p> : null}
                        {error ? <div className="error">{error}</div> : null}

                        {!loading && !error && participants.length === 0 ? (
                            <p className="helper">Aucun participant pour le moment.</p>
                        ) : null}

                        {!loading && !error && participants.length > 0 ? (
                            <ul className="participant-list">
                                {participants.map((p) => (
                                    <li key={p.user_id} className="participant-item">
                                        <span>{p.username}</span>
                                        <span className="participant-date">
                      {new Date(p.date_inscription).toLocaleString("fr-FR")}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
