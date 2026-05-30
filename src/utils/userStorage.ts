import AsyncStorage from "@react-native-async-storage/async-storage";

const USERNAME_KEY = "code-reviewer_username";

export async function getUsername(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(USERNAME_KEY);
  } catch {
    return null;
  }
}

export async function saveUsername(username: string): Promise<void> {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username);
  } catch {
    // ignore storage errors for now
  }
}

const THEME_KEY = "code-reviewer_theme";

type ThemeName = "light" | "dark";

export async function getTheme(): Promise<ThemeName | null> {
  try {
    const stored = await AsyncStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

export async function saveTheme(theme: ThemeName): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore storage errors for now
  }
}
