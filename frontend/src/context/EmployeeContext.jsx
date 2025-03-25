import { createContext, useState } from "react";

export const EmployeeContext = createContext();

const EmployeeContextProvider = ({ children }) => { // Fix: Destructure 'children' properly

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");

    const value = {
        // Define your context values here
        token,
        setToken,
        backendUrl
    };

    return (
        <EmployeeContext.Provider value={value}>
            {children} {/* Fix: Use 'children' directly */}
        </EmployeeContext.Provider>
    );
};

export default EmployeeContextProvider;
