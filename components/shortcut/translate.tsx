"use client";
import React, { FormEvent, useState } from "react";
import Textarea from "@/components/textarea";
import { SendButton } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const systemPrompt =
  "You are a professional, authentic translation engine. You only return the translated text, please do not explain original text. (Chinese-English bidirectional translation)";

function Translate({
  response,
  isLoading,
  onSend,
}: {
  response?: string;
  isLoading: boolean;
  onSend: (msg: string, systemPrompt: string) => void;
}) {
  const [input, setInput] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    onSend(input, systemPrompt);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    if (isLoading) {
      return;
    }
    onSubmit(e);
  }

  return (
    <>
      <form className="relative" onSubmit={onSubmit}>
        <Textarea
          maxRows={10}
          placeholder="请输入需要翻译的内容"
          disabled={isLoading}
          className="!pr-12"
          autoFocus={true}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <SendButton isLoading={isLoading} className="bottom-2 right-2" />
      </form>

      {response && (
        <div className="mt-3 w-fit max-w-full">
          <div className="overflow-x-auto whitespace-break-spaces rounded-md border bg-secondary p-2">
            {response}
          </div>
          {!isLoading && (
            <div className="mt-3 flex flex-row-reverse">
              <Button
                variant="outline"
                className="h-9 px-3"
                onClick={() => copyToClipboard(response)}
              >
                <Copy size={16} className="mr-1" />
                拷贝
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Translate;