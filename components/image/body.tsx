"use client";
import React, { useState } from "react";
import Settings from "@/components/image/settings";
import Result from "@/components/image/result";
import { useImageConfig } from "@/lib/store/image/config";
import { fetchPost } from "@/lib/utils";
import { useConfig } from "@/lib/store/config";
import { ApiKeyPool } from "@/lib/pool";
import toast from "react-hot-toast";

const apiKeyPool = new ApiKeyPool();

function Body() {
  const config = useImageConfig();
  const apiKey = useConfig((state) => state.apiConfig.apiKey);
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState<string>();

  async function onGenerate(text: string) {
    setImg(undefined);
    setIsLoading(true);
    try {
      const res = await fetchPost("/api/image", {
        apiKey: apiKeyPool.update(apiKey).getNext(),
        config: config,
        prompt: text,
      });
      const url = await res.text();
      if (!res.ok) {
        throw new Error(url);
      }
      setImg(url);
      toast.success("图像生成成功");
    } catch (err: any) {
      toast.error(err.toString());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Settings isLoading={isLoading} onGenerate={onGenerate} />
      <Result img={img} isLoading={isLoading} />
    </div>
  );
}

export default Body;