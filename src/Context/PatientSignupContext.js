import React, { createContext, useContext, useState } from 'react';



const PatientContext = createContext({})

const PatientSignupContext = ({ children }) => {
    const [patientData, setPatientData] = useState([])

    return (
        <PatientContext.Provider value={{ patientData, setPatientData }} >
            {children}
        </PatientContext.Provider>
    );
};


export const usePatientContext = () => {
    const usePatient = useContext(PatientContext)
    return usePatient
}



export { PatientSignupContext }
