"use client"
import {  createContext, useContext, useState } from "react";

const SignupContext = createContext();

export const SignUpProvider = ({ children }) => {
    const [signUpData, setSignUpData] = useState({
        FullName: '',
        CompanyName: '',
        WebSite: '',
        FullName2: '',
        Email: ''
    });

    return(
        <SignupContext.Provider value={{signUpData, setSignUpData}}>
            {children}
        </SignupContext.Provider>
    )
}

export const useSignUp = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignUp must be used within a SignUpProvider');
    }
    return context;
};