import "./styles/LoginPage.scss"
import {type FormEvent, useState} from "react";
import {login, validateToken} from "../API/auth-actions.ts";
import {useNavigate} from "react-router-dom";
import type {User} from "../utils/types.ts";

type Props = {
    onLoginSuccess: (token: string, user: User) => void;
}

export default function LoginPage({onLoginSuccess}: Props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e:FormEvent){
        e.preventDefault();
        const token = await login(username,password);
        localStorage.setItem("token", token);
        const user = await validateToken();
        onLoginSuccess(token, user);
        navigate("/events");
    }

    return (
        <div className="login-page">
            <form className="login-card login-form" onSubmit={handleSubmit}>
                <h1 className="login-title">Connexion</h1>
                <p className="login-subtitle">Accède à tes événements</p>

                <div className="login-field">
                    <label>Nom d’utilisateur</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ex: julien"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="login-field">
                    <label>Mot de passe</label>
                    <input
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </div>

                <div className="login-actions">
                    <button type="submit">Se connecter</button>
                </div>

                <div className="login-hint">
                    Pas de compte ? <a href="/signup">Créer un compte</a>
                </div>
            </form>
        </div>
    );

}