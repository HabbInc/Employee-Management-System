import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => { // Fix: Destructure 'children' properly


    const [aToken, setAToken] = useState(localStorage.getItem("aToken")? localStorage.getItem("aToken"):"");
    const backendUrl = import.meta.env.VITE_BACKEND_URL



    const value = {
        aToken,
        setAToken,backendUrl
    };

    return (
        <AdminContext.Provider value={value}>
            {children} {/* Fix: Use 'children' directly */}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
