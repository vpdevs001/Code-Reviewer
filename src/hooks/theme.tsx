import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import { themes } from "../constants/colors";
import { getTheme, saveTheme } from "../utils/userStorage";

type ThemeName = "light" | "dark";

type ThemeContextType = {
  theme: ThemeName;
  colors: typeof themes.light;
  toggleTheme: () => void;
  setTheme: (t: ThemeName) => void;
};

const defaultThemeName: ThemeName =
  (Appearance.getColorScheme() as ThemeName) || "light";

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultThemeName,
  colors: themes[defaultThemeName],
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(defaultThemeName);
  const [storedTheme, setStoredTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTheme() {
      const savedTheme = await getTheme();
      if (mounted && savedTheme) {
        setThemeState(savedTheme);
        setStoredTheme(savedTheme);
      }
    }

    loadTheme();

    const sub = Appearance.addChangeListener((prefs) => {
      if (storedTheme !== null) {
        return;
      }
      const sys = (prefs.colorScheme as ThemeName) || "light";
      setThemeState(sys);
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, [storedTheme]);

  async function setTheme(t: ThemeName) {
    setThemeState(t);
    setStoredTheme(t);
    await saveTheme(t);
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    void setTheme(nextTheme);
  }

  const value = useMemo(
    () => ({ theme, colors: themes[theme], toggleTheme, setTheme }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
