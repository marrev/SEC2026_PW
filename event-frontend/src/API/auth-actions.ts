import type {LoginResponse, User} from "../utils/types.ts";

export async function login(username:string, password:string):Promise<string>{
    const res=await fetch("/api/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username, password})
    })

    if(!res.ok){
        throw new Error("Invalid credentials");
    }
    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);

    return data.token;
}

export async function validateToken():Promise<User>{
    const token=localStorage.getItem("token");

    if(!token){
        throw new Error("no token");
    }
    const res = await fetch("/api/me",{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });

    if (!res.ok){
        throw new Error("Invalid token");
    }
    const data = await res.json();
    console.log(data.user);
    return data.user;
}

export async function signup(username:string, password:string):Promise<string>{
    const res=await fetch("/api/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username, password})
    })

    if(!res.ok){
        throw new Error("Invalid credentials");
    }
    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);

    return data.token;
}