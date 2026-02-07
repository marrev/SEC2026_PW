import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Navbar.scss";

type Props = {
    isAuthenticated: boolean;
    toggleTheme: () => void;
    onLogout: () => void;
};

export default function Navbar({ isAuthenticated, toggleTheme, onLogout }: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const pageTitle =
        location.pathname === "/login" ? "Connexion"
        : location.pathname === "/signup" ? "Inscription"
        : location.pathname === "/events" ? "Events"
        : "Accueil";

    const buttonTitle =
        location.pathname === "/login" ? "Inscription"
        : "Connexion";

    const handleAuthClick = () => {
        if (isAuthenticated) {
            // logout
            onLogout();
            navigate("/login");
        } else {
            if (location.pathname === "/login") {
                navigate("/signup");
            } else {
                navigate("/login");
            }
        }
    };

    const handleBrandClick = () => {
        if (isAuthenticated) {
            navigate("/events");
        } else {
            navigate("/");
        }
    };

    return (
        <header className="navbar">
            <h2>{pageTitle}</h2>
            <h1
                className="navbar-brand"
                onClick={handleBrandClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleBrandClick();
                }}
            >
                Jvent
            </h1>
            <div className="navbar-actions">
                <button onClick={toggleTheme}>
                    🌙 / ☀️
                </button>

                <button onClick={handleAuthClick}>
                    {isAuthenticated ? "Déconnexion" : buttonTitle}
                </button>
            </div>
        </header>
    );
}
