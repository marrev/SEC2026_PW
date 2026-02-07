import type {CreateEventPayload, EventModel, UpdateEventPayload} from "../utils/types.ts";

type EventsResponse = {
    events: EventModel[];
};

export async function getPublicEvent():Promise<EventModel[]>{
    const res=await fetch("/api/publicEvent",{
        method:"GET",
        headers:{"Content-Type":"application/json"}
    })

    const text = await res.text();
    if(!res.ok){
        throw new Error(`HTTP ${res.status} - ${text}`);
    }

    const data: EventsResponse = text ? JSON.parse(text) : { events: [] };
    return data.events ?? [];
}

export async function getAllEvent():Promise<EventModel[]>{
    const token = localStorage.getItem("token");
    const res=await fetch("/api/allEvents",{
        method:"GET",
        headers:{"Content-Type":"application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    })

    const text = await res.text();
    if(!res.ok){
        throw new Error(`HTTP ${res.status} - ${text}`);
    }

    const data: EventsResponse = text ? JSON.parse(text) : { events: [] };
    return data.events ?? [];
}

export async function getCreatedByEvent(username : string):Promise<EventModel[]>{
    const token = localStorage.getItem("token");
    const res=await fetch("/api/createdByEvents",{
        method:"GET",
        headers:{"Content-Type":"application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({username})
    })

    const text = await res.text();
    if(!res.ok){
        throw new Error(`HTTP ${res.status} - ${text}`);
    }

    const data: EventsResponse = text ? JSON.parse(text) : { events: [] };
    return data.events ?? [];
}

export async function createEvent(event: CreateEventPayload){
    const token = localStorage.getItem("token");
    const res=await fetch("/api/createEvent",{
        method:"POST",
        headers:{"Content-Type":"application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body:JSON.stringify({event})
    })

    if (!res.ok) throw new Error(await res.text());

}

export async function modifyEvent(event: UpdateEventPayload){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res=await fetch("/api/modifyEvent",{
        method:"PUT",
        headers:{"Content-Type":"application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({event})
    })

    if (!res.ok) throw new Error(await res.text());
}

export async function deleteEvent(event: EventModel){
    const token = localStorage.getItem("token");
    const res= await fetch("/api/deleteEvent",{
        method:"DELETE",
        headers:{"Content-Type":"application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({event})
    })

    if (!res.ok) throw new Error(await res.text());
}
