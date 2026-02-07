import {useEffect, useMemo, useState} from "react";
import {Navigate,Routes,Route} from "react-router-dom";
import type {User} from "./utils/types";
import LoginPage from "./Page/LoginPage.tsx";
import SignUpPage from "./Page/SignedUpPage.tsx";
import HomePage from "./Page/HomePage.tsx";
import EventPage from "./Page/EventPage.tsx";
import Navbar from "./Component/Navbar.tsx";
//import TestPage from "./Page/TestPage.tsx";

type AppRoutesProps = {
    user: User | null;
    token: string | null;
    onLoginSuccess: (token: string, user: User) => void;
    onLogout: () => void;
}


export default function AppRoutes({
                                      user,
                                      token,
                                      onLoginSuccess,
                                      onLogout,
}: AppRoutesProps){
    const isAuthenticated = useMemo(()=> Boolean(token && user),[token,user]);
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("theme");
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(t => (t === "light" ? "dark" : "light"));
    };

    return (
        <div className={`app ${theme}`}>
            <Navbar
                isAuthenticated={isAuthenticated}
                toggleTheme={toggleTheme}
                onLogout={onLogout}
            />
            <Routes>
                <Route
                    path='/'
                    element = {
                        isAuthenticated ? (
                            <Navigate to="/events" replace/>
                        ) : (
                            <HomePage/>
                        )
                    }
                />
                <Route
                    path='/login'
                    element = {
                        isAuthenticated ? (
                            <Navigate to="/events" replace/>
                        ) : (
                            <LoginPage onLoginSuccess={onLoginSuccess}/>
                        )
                    }
                />
                <Route
                    path='/signup'
                    element = {
                        isAuthenticated ? (
                            <Navigate to="/events" replace/>
                        ) : (
                            <SignUpPage/>
                        )
                    }
                />
                <Route
                    path='/events'
                    element = {
                        isAuthenticated ? (
                            <EventPage
                                isAuthenticated={isAuthenticated}
                                user={user}
                            />
                        ) : (
                            <Navigate to="/login" replace/>
                        )
                    }
                />
            </Routes>
        </div>
    );
}

/* Test
<Route
    path='/addEvent'
    element = {
        isAuthenticated ? (
            <TestPage isAuthenticated={isAuthenticated} user={user}/>
        ) : (
            <Navigate to="/login" replace/>
        )
    }
/>
 */