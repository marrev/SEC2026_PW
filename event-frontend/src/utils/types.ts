export interface LoginResponse {
    token:string;
}

export interface User {
    id:number;
    username:string;
}

export type EventModel = {
    event_id: number;
    nom: string;
    descr: string | null;
    event_date: string;

    category_id: number;
    category_name: string;

    creator_id: number;
    creator_name: string;

    public: boolean;
    max_inscriptions: number;

    nb_inscrits: number;

    is_registered?: boolean;
};

export type Category = {
    category_id: number;
    nom: string
};

export type Participant = {
    user_id: number;
    username: string;
    date_inscription: string;
};

export type UpdateEventPayload = {
    event_id: number;
    nom: string;
    descr: string | null;
    event_date: string;       // ISO string
    category_id: number;
    public: boolean;
    max_inscriptions: number; // 0 = illimité
};

export type CreateEventPayload = {
    nom: string;
    descr: string | null;
    event_date: string;
    category_id: number;
    public: boolean;
    max_inscriptions: number;
};
