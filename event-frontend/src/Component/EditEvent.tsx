import {type FormEvent, useEffect, useState} from "react";
import type {User, Category, EventModel, UpdateEventPayload} from "../utils/types.ts";
import {modifyEvent} from "../API/event-actions.ts";
import {getCategories} from "../API/category-actions.ts";

import './styles/AddEvent.scss';

type Props = {
    event: EventModel;
    user: User | null;
    onClose: () => void;
    onSaved: () => void;
};

function toDateTimeLocal(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEvent({event, user, onClose, onSaved }: Props) {
    const [nom, setNom] = useState(event.nom);
    const [descr, setDescr] = useState(event.descr? event.descr : "");
    const [eventDate, setEventDate] = useState(toDateTimeLocal(event.event_date));
    const [categoryId, setCategoryId] = useState<number>(event.category_id);
    const [isPublic, setIsPublic] = useState(event.public);
    const [maxInscriptions, setMaxInscriptions] = useState<number>(event.max_inscriptions);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoadingCats(true);
        getCategories()
            .then((list) => {
                setCategories(list);
                if (list.length === 0) return;
                const exists = list.some((c) => c.category_id === event.category_id);
                setCategoryId(exists ? event.category_id : list[0].category_id);
            })
            .catch((e) => setError(e?.message ?? String(e)))
            .finally(() => setLoadingCats(false));
    }, [event.category_id]);

    useEffect(() => {
        setNom(event.nom);
        setDescr(event.descr ?? "");
        setEventDate(toDateTimeLocal(event.event_date));
        setIsPublic(event.public);
        setMaxInscriptions(event.max_inscriptions);
        setCategoryId(event.category_id);
    }, [event]);


    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("Vous devez être connecté pour modifier un événement.");
            return;
        }
        if (!nom.trim()) {
            setError("Le nom est obligatoire.");
            return;
        }
        if (!eventDate) {
            setError("La date est obligatoire.");
            return;
        }
        if (!categoryId) {
            setError("Veuillez choisir une catégorie.");
            return;
        }
        if (maxInscriptions < 0) {
            setError("Le max d'inscriptions doit être ≥ 0.");
            return;
        }

        const payload: UpdateEventPayload = {
            event_id : event.event_id,
            nom: nom.trim(),
            descr: descr.trim() ? descr.trim() : null,
            event_date: new Date(eventDate).toISOString(),
            category_id: categoryId,
            public: isPublic,
            max_inscriptions: maxInscriptions,
        };

        try {
            setSubmitting(true);
            await modifyEvent(payload as any);
            onSaved();
            onClose();
        } catch (e: any) {
            setError(e?.message ?? String(e));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Modifier un événement">
            <div className="modal-header">
                <h2>Modifier un événement</h2>
                <button className="icon-btn" type="button" onClick={onClose} aria-label="Fermer">
                    ✕
                </button>
            </div>

            {error ? <div className="error">{error}</div> : null}

            <form className="form" onSubmit={handleSubmit}>
                <label>Nom</label>
                <input value={nom} onChange={(e) => setNom(e.target.value)} />

                <label>Description</label>
                <textarea value={descr} onChange={(e) => setDescr(e.target.value)} rows={4} />

                <label>Date & heure</label>
                <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                />

                <label>Catégorie</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    disabled={loadingCats || categories.length === 0}
                >
                    {categories.length === 0 ? (
                        <option value={0}>Aucune catégorie</option>
                    ) : (
                        categories.map((c) => (
                            <option key={c.category_id} value={c.category_id}>
                                {c.nom}
                            </option>
                        ))
                    )}
                </select>

                <label className="row">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Événement public
                </label>

                <label>Max inscriptions (0 = illimité)</label>
                <input
                    type="number"
                    min={0}
                    value={maxInscriptions}
                    onChange={(e) => setMaxInscriptions(Number(e.target.value))}
                />

                <div className="row" style={{ justifyContent: "flex-end" }}>
                    <button type="button" className="button" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="button-primary" type="submit" disabled={submitting}>
                        {submitting ? "Modification…" : "Modifier"}
                    </button>
                </div>
            </form>
        </div>
    );
}