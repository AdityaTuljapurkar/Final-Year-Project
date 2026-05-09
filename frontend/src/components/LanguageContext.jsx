import React, { createContext, useState } from 'react';

// 1. Create the Context
export const LanguageContext = createContext();

// 2. Create the Provider Component
export const LanguageProvider = ({ children }) => {
  // Default is 'en' (English).
  const [userLanguage, setUserLanguage] = useState('en'); 

  return (
    <LanguageContext.Provider value={{ userLanguage, setUserLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};