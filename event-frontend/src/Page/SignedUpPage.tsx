import "./styles/SignedUpPage.scss"
import {type FormEvent, useState} from "react";
import {signup} from "../API/auth-actions.ts";
import { useNavigate } from "react-router-dom";

export default function SignedUpPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await signup(username, password);
        navigate("/login");
    }

    return (
        <div className="signup-page">
            <form className="signup-card signup-form" onSubmit={handleSubmit}>
                <h1 className="signup-title">Créer un compte</h1>
                <p className="signup-subtitle">Rejoins l’app et inscris-toi aux événements</p>

                <div className="signup-field">
                    <label>Nom d’utilisateur</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ex: julien"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="signup-field">
                    <label>Mot de passe</label>
                    <input
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="signup-actions">
                    <button type="submit">S&apos;inscrire</button>
                </div>

                <div className="signup-hint">
                    Déjà un compte ? <a href="/login">Se connecter</a>
                </div>
            </form>
        </div>
    );
}