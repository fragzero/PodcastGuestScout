// Types for the different settings
import { z } from "zod";

// Profile settings type
export type ProfileSettings = {
  displayName: string;
  email: string;
  bio?: string;
};

// Notification settings type
export type NotificationSettings = {
  newCandidates: boolean;
  candidateUpdates: boolean;
  systemUpdates: boolean;
  emailDigest: boolean;
};

// Appearance settings type
export type AppearanceSettings = {
  theme: "light" | "dark" | "system";
  accentColor: "blue" | "green" | "violet" | "pink" | "orange";
  fontScale: "90%" | "100%" | "110%" | "120%";
};

// API settings type
export type ApiSettings = {
  apiKey: string | undefined;
  enableApi: boolean;
};

// All settings combined
export type Settings = {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  api: ApiSettings;
};

// Default settings
export const defaultSettings: Settings = {
  profile: {
    displayName: "John Doe",
    email: "john.doe@example.com",
    bio: "Podcast host and content creator",
  },
  notifications: {
    newCandidates: true,
    candidateUpdates: true,
    systemUpdates: false,
    emailDigest: true,
  },
  appearance: {
    theme: "system",
    accentColor: "blue",
    fontScale: "100%",
  },
  api: {
    apiKey: "",
    enableApi: false,
  },
};

// Load settings from localStorage
export function loadSettings(): Settings {
  try {
    const savedSettings = localStorage.getItem("podcastAppSettings");
    if (!savedSettings) {
      return defaultSettings;
    }
    
    const parsedSettings = JSON.parse(savedSettings);
    return {
      profile: {
        ...defaultSettings.profile,
        ...parsedSettings.profile,
      },
      notifications: {
        ...defaultSettings.notifications,
        ...parsedSettings.notifications,
      },
      appearance: {
        ...defaultSettings.appearance,
        ...parsedSettings.appearance,
      },
      api: {
        ...defaultSettings.api,
        ...parsedSettings.api,
      },
    };
  } catch (error) {
    console.error("Error loading settings:", error);
    return defaultSettings;
  }
}

// Save settings to localStorage
export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem("podcastAppSettings", JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

// Save a specific section of settings
export function saveSettingSection<K extends keyof Settings>(
  section: K,
  value: Settings[K]
): Settings {
  try {
    const currentSettings = loadSettings();
    const newSettings = {
      ...currentSettings,
      [section]: value,
    };
    saveSettings(newSettings);
    return newSettings;
  } catch (error) {
    console.error(`Error saving ${section} settings:`, error);
    return loadSettings();
  }
}

// Apply appearance settings to document
export function applyAppearanceSettings(appearance: AppearanceSettings): void {
  // Apply theme
  const root = document.documentElement;
  
  // Clear previous theme classes
  root.classList.remove("light", "dark");
  
  if (appearance.theme === "light" || appearance.theme === "dark") {
    root.classList.add(appearance.theme);
  } else if (appearance.theme === "system") {
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
  }
  
  // Apply font scaling
  const htmlFontSize = appearance.fontScale;
  root.style.fontSize = htmlFontSize;
  
  // Update primary color in the CSS variables based on accent color
  let primaryColor = "#3b82f6"; // Default blue
  switch (appearance.accentColor) {
    case "green":
      primaryColor = "#10b981";
      break;
    case "violet":
      primaryColor = "#8b5cf6";
      break;
    case "pink":
      primaryColor = "#ec4899";
      break;
    case "orange":
      primaryColor = "#f97316";
      break;
  }
  
  // Update CSS variables
  root.style.setProperty("--primary", primaryColor);
  
  // Create or update theme.json content
  const themeContent = {
    primary: primaryColor,
    variant: "professional",
    appearance: appearance.theme === "system" ? "system" : appearance.theme,
    radius: 0.5,
  };
  
  // In a real app, you might want to actually update theme.json
  // For this demo, we'll just log what would be updated
  console.log("Theme settings to apply:", themeContent);
}