import { createContext, useContext, useEffect, useState } from "react";
import { getLoggedUser } from "../api/userApi";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoadingUser(false);
                return;
            }

            try {
                const data = await getLoggedUser();
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            } catch (error) {
                console.error("Failed to load user:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        }

        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loadingUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}