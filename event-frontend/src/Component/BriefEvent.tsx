import type { ReactNode } from "react";
import type { EventModel } from "../utils/types.ts";


type Props = {
    event: EventModel;
    onClick?: (event: EventModel) => void;
    actions?: ReactNode;

    onEdit?: (event: EventModel) => void;
    onDelete?: (event: EventModel) => void;
};

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
    }).format(d);
}

export default function BriefEvent({ event, onClick, actions, onEdit, onDelete }: Props) {
    const date = formatDateTime(event.event_date);

    return (
        <article
            className="event-card"
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick ? () => onClick(event) : undefined}
            onKeyDown={
                onClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") onClick(event);
                } : undefined
            }>
            <div className="event-top">
                <h3 className="event-title">{event.nom}</h3>
                <div className="event-actions">
                    {actions}

                    {onEdit ? (
                        <button className="button" onClick={(e) => {
                            e.stopPropagation();
                            onEdit(event);
                        }}>Modifier</button>
                    ) : null}

                    {onDelete ? (
                        <button className="button button-danger" onClick={(e) => {
                            e.stopPropagation();
                            onDelete(event);
                        }}>Supprimer</button>
                    ) : null}
                </div>
            </div>

            <div className="event-meta">
                <span>🗓️ {date}</span>
            </div>

            <p>{event.max_inscriptions === 0 ?`👥 ${event.nb_inscrits} inscrit(s)`
                : `👥 ${event.nb_inscrits} / ${event.max_inscriptions}`}</p>

        </article>
    );
}
