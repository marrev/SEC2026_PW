import type {Participant} from "../utils/types.ts";

export async function subscribeEvent(event_id:number){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res=await fetch("/api/subscribeEvent",{
        method:"POST",
        headers:{"Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({event_id})
    })

    if (!res.ok) throw new Error(await res.text());
}

export async function unsubscribeEvent(event_id : number){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res=await fetch("/api/unsubscribeEvent",{
        method:"DELETE",
        headers:{"Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({event_id})
    })

    if (!res.ok) throw new Error(await res.text());
}

export async function getEventParticipants(event_id: number): Promise<Participant[]> {
    const res=await fetch(`/api/events/${event_id}/participants`,{
        method:"GET",
    })

    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${text}`);

    const data = text ? JSON.parse(text) : { participants: [] };
    return data.participants ?? [];
}