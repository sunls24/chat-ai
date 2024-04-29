"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChat } from "ai/react";
import { useConfig } from "@/lib/store/config-chat";
import { Message } from "ai";
import { toast } from "sonner";
import { shortcuts } from "@/lib/constants";
import { useShortcutConfig } from "@/lib/store/config-shortcut";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function Shortcut() {
  const { append, messages, setMessages, isLoading, stop } = useChat({
    onError(err) {
      toast.error(err.message);
      setMessages([]);
    },
  });

  const apiConfig = useConfig((state) => state.apiConfig);
  const config = useShortcutConfig();

  function getOptions() {
    return {
      options: {
        body: {
          config: {
            ...apiConfig,
            systemPrompt: false,
            temperature: 0.3,
            plugins: {},
          },
        },
      },
    };
  }

  function onSend(msg: string, systemMessage: Message[]) {
    setMessages(systemMessage);
    append({ role: "user", content: msg }, getOptions());
  }

  function getResponse(presetCount: number) {
    if (messages.length === 0 || messages.length === presetCount) {
      return;
    }
    const last = messages[messages.length - 1];
    if (last && last.role === "assistant") {
      return last.content;
    }
  }

  return (
    <Tabs
      value={config.current}
      className="p-3"
      onValueChange={(tv) => {
        stop();
        setMessages([]);
        config.update((cfg) => (cfg.current = tv));
      }}
    >
      <Mounted fallback={<Skeleton className="h-9" />}>
        <TabsList>
          {shortcuts.map((v, i) => (
            <TabsTrigger key={i} value={v.value}>
              {v.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {shortcuts.map((v, i) => (
          <TabsContent key={i} value={v.value} className="mt-3">
            <v.component
              onSend={onSend}
              isLoading={isLoading}
              getResponse={getResponse}
            />
          </TabsContent>
        ))}
      </Mounted>
    </Tabs>
  );
}

export default Shortcut;
