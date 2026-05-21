import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
      const [user, setUser] = useState(() => {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        });
    const [loadingUser] = useState(false);

    return (
        <UserContext.Provider value={{ user, setUser, loadingUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}