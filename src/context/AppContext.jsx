import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n/i18n"; 

const AppContext = createContext();

export function AppProvider({ children }) {

  const [mode, setMode] = useState(
    localStorage.getItem("mode") || "light"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const direction = language === "fa" ? "rtl" : "ltr";

 
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);


  function toggleLanguage() {
    const newLang = language === "en" ? "fa" : "en";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  }


  function toggleTheme() {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  }

 
  function login(username) {
    const newUser = {
      name: username || "User",
      avatar: username ? username[0].toUpperCase() : "U"
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

 
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }


  return (
    <AppContext.Provider
      value={{
        mode,
        direction,
        language,
        toggleLanguage,
        toggleTheme,
        user,
        login,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);