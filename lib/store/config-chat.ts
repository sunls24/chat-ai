import { Store, StoreVersion } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

export type Plugins = typeof defaultPlugins;
const defaultPlugins = {
  googleSearch: {
    enabled: false,
    apiKey: "",
    engineId: "",
  },
};

const defaultConfig = {
  autoGenerateTitle: true,
  apiConfig: {
    apiKey: "",
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    plugins: defaultPlugins,
  },
};

export const useConfig = createConfig(
  defaultConfig,
  Store.ConfigChat,
  StoreVersion,
);
