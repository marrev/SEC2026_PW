import {useEffect, useState} from "react";
import Event from "../Component/Event.tsx";
import AddEvent from "../Component/AddEvent.tsx";
import type { EventModel, User } from "../utils/types.ts";
import {deleteEvent, getAllEvent} from "../API/event-actions.ts";
import {subscribeEvent, unsubscribeEvent} from "../API/linkUserEvent-actions.ts";
import EditEvent from "../Component/EditEvent.tsx";
import ConsultEvent from "../Component/ConsultEvent.tsx";

type Tab = "all" | "admin" | "subscribed";

type Props = {
    isAuthenticated: boolean | null;
    user: User|null;
}

export default function EventPage({isAuthenticated, user}: Props) {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editing, setEditing] = useState<EventModel | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selected, setSelected] = useState<EventModel | null>(null);
    const [tab, setTab] = useState<Tab>("all");


    const handleSubscribe = async (ev: EventModel) => {
        // UI instant
        setEvents(prev =>
            prev.map(e =>
                e.event_id === ev.event_id
                    ? { ...e, is_registered: true, nb_inscrits: Number(e.nb_inscrits) + 1 }
                    : e
            )
        );

        try {
            await subscribeEvent(ev.event_id);
        } catch (err) {
            // rollback si erreur
            setEvents(prev =>
                prev.map(e =>
                    e.event_id === ev.event_id
                        ? { ...e, is_registered: false, nb_inscrits: Math.max(0, Number(e.nb_inscrits) - 1) }
                        : e
                )
            );
            throw err;
        }
    };

    const handleUnsubscribe = async (ev: EventModel) => {
        setEvents(prev =>
            prev.map(e =>
                e.event_id === ev.event_id
                    ? { ...e, is_registered: false, nb_inscrits: Math.max(0, Number(e.nb_inscrits) - 1) }
                    : e
            )
        );

        try {
            await unsubscribeEvent(ev.event_id);
        } catch (err) {
            setEvents(prev =>
                prev.map(e =>
                    e.event_id === ev.event_id
                        ? { ...e, is_registered: true, nb_inscrits: Number(e.nb_inscrits) + 1 }
                        : e
                )
            );
            throw err;
        }
    };


    const reload = () => {
        setLoading(true);
        getAllEvent()
            .then((list) => {
                setEvents(list);
                setError(null);
            })
            .catch((e) => {
                setError(e?.message ?? String(e));
                setEvents([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        reload();
    }, []);

    const visibleEvents = events.filter((ev) => {
        if (tab === "all") return true;
        if (tab === "admin") return !!user && user.id === ev.creator_id;
        if (tab === "subscribed") return !!ev.is_registered;
        return true;
    });

    return (
        <div className="stack">
            <h1>Bienvenue {user?.username}</h1>
            <h2>Événements en cours</h2>

            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                {isAuthenticated ? (
                    <button className="button-primary" onClick={() => setShowAdd(true)}>
                        Ajouter
                    </button>
                ) : null}
                <button
                    className={tab === "all" ? "button-primary" : "button"}
                    onClick={() => setTab("all")}
                    type="button"
                >
                    Tous
                </button>

                <button
                    className={tab === "admin" ? "button-primary" : "button"}
                    onClick={() => setTab("admin")}
                    type="button"
                    disabled={!user}
                    title={!user ? "Connecte-toi pour voir tes événements" : undefined}
                >
                    Mes événements
                </button>

                <button
                    className={tab === "subscribed" ? "button-primary" : "button"}
                    onClick={() => setTab("subscribed")}
                    type="button"
                    disabled={!user}
                    title={!user ? "Connecte-toi pour voir tes inscriptions" : undefined}
                >
                    Inscrit
                </button>
            </div>


            {loading ? <p className="helper">Chargement…</p> : null}
            {error ? <div className="error">{error}</div> : null}

            <div className="events-grid">
                {!loading && !error && visibleEvents.length === 0 ? (
                    <p className="helper">
                        {tab === "all"
                            ? "Aucun événement pour le moment."
                            : tab === "admin"
                                ? "Tu n’administres aucun événement."
                                : "Tu n’es inscrit à aucun événement."}
                    </p>
                ) : null}

                {visibleEvents.map((ev) => {
                    const isOwner = !!user && user.id === ev.creator_id;

                    return (
                    <Event
                        key = {ev.event_id}
                        isAuthenticated = {isAuthenticated}
                        event={ev}
                        onEdit={isOwner ? () => { setEditing(ev); setShowEdit(true); } : undefined}
                        onDelete={isOwner ? async () => { await deleteEvent(ev); reload(); } : undefined}
                        onSubscribe={handleSubscribe}
                        onUnsubscribe={handleUnsubscribe}
                        onClick={(ev) => { setSelected(ev); setShowDetails(true); }}
                    />
                    )
                })}
            </div>

            {showAdd ? (
                <div
                    className="modal-overlay"
                    onMouseDown={() => setShowAdd(false)}
                >
                    <div onMouseDown={(e) => e.stopPropagation()}>
                        <AddEvent
                            user={user}
                            onClose={() => setShowAdd(false)}
                            onCreated={reload}
                        />
                    </div>
                </div>
            ) : null}

            {showEdit && editing ? (
                <div
                    className="modal-overlay"
                    onMouseDown={()=>setShowEdit(false)}>
                    <div onMouseDown={(e) => e.stopPropagation()}>
                        <EditEvent
                            event={editing}
                            user = {user}
                            onClose={()=>setShowEdit(false)}
                            onSaved={()=>{reload();}}
                        />
                    </div>
                </div>
            ) : null}

            {showDetails && selected ? (
                <div className="modal-overlay" onMouseDown={() => { setShowDetails(false); setSelected(null); }}>
                    <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                        <ConsultEvent
                            event={selected}
                            onClose={() => { setShowDetails(false); setSelected(null); }}
                        />
                    </div>
                </div>
            ) : null}

        </div>
    );
}
