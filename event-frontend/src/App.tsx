import './App.css'
import AppRoutes from "./AppRoutes.tsx";
import {validateToken} from "./API/auth-actions.ts";
import {useEffect, useState} from "react";
import type {User} from "./utils/types.ts";
import {BrowserRouter} from "react-router-dom";

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            return;
        }
        setToken(token);
        validateToken()
            .then((u)=>{
                setUser(u);
            })
            .catch(()=>{
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            });
    },[]);

    const handleLoginSuccess = (t:string, u: User)=> {
        localStorage.setItem("token", t);
        localStorage.setItem("userId", u.id.toString());
        setToken(t);
        setUser(u);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return (
        <BrowserRouter>
          <AppRoutes
            user = {user}
            token = {token}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        </BrowserRouter>
    );
}
