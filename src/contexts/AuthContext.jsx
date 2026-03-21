import { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthContext } from "./auth";

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    setCurrentUser(user);
                    setLoading(false);
                });
                return unsubscribe;
            })
            .catch((error) => {
                console.error("Auth persistence setup error:", error);
                setLoading(false);
            });
    }, []);

    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
