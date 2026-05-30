import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";
import { themes } from "../constants/colors";

type ThemeName = "light" | "dark";

type ThemeContextType = {
  theme: ThemeName;
  colors: typeof themes.light;
  toggleTheme: () => void;
  setTheme: (t: ThemeName) => void;
};

const defaultThemeName: ThemeName = (Appearance.getColorScheme() as ThemeName) || "light";

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultThemeName,
  colors: themes[defaultThemeName],
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(defaultThemeName);

  useEffect(() => {
    const sub = Appearance.addChangeListener((prefs) => {
      const sys = (prefs.colorScheme as ThemeName) || "light";
      setThemeState(sys);
    });
    return () => sub.remove();
  }, []);

  function setTheme(t: ThemeName) {
    setThemeState(t);
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }

  const value = useMemo(
    () => ({ theme, colors: themes[theme], toggleTheme, setTheme }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
