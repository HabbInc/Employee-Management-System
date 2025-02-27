import { createContext } from "react";

export const EmployeeContext = createContext();

const EmployeeContextProvider = ({ children }) => { // Fix: Destructure 'children' properly
    const value = {
        // Define your context values here
    };

    return (
        <EmployeeContext.Provider value={value}>
            {children} {/* Fix: Use 'children' directly */}
        </EmployeeContext.Provider>
    );
};

export default EmployeeContextProvider;
