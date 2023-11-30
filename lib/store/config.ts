import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Store, StoreVersion } from "@/lib/constants";

export interface Plugins {
  [key: string]: {
    enabled: boolean;
  };
}

export const defaultConfig = {
  autoGenerateTitle: false,
  apiConfig: {
    apiKey: "",
    model: "gpt-3.5-turbo-1106",
    temperature: 0.5,
    plugins: {
      googleSearch: {
        enabled: false,
        apiKey: "",
        engineId: "",
      },
      browseWebsite: {
        enabled: false,
        maxLength: 10000,
      },
      weatherInfo: {
        enabled: false,
        amapKey: "",
      },
      imageGeneration: {
        enabled: false,
      },
    },
  },
};

type Config = typeof defaultConfig & {
  Update(fn: (c: Config) => void): void;
};

export type ApiConfig = typeof defaultConfig.apiConfig;

export const useConfig = create<Config>()(
  persist(
    (set, get) => ({
      ...defaultConfig,

      Update(fn: (c: Config) => void) {
        const config = get();
        fn(config);
        set({ ...config });
      },
    }),
    {
      name: Store.Config,
      version: StoreVersion,
      migrate(persistedState) {
        const state = persistedState as Config;
        if (!state.apiConfig.plugins.imageGeneration) {
          state.apiConfig.plugins.imageGeneration =
            defaultConfig.apiConfig.plugins.imageGeneration;
        }
        return state;
      },
    },
  ),
);
