import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

const PROVIDER_ID = "tencent-tokenhub";
const DEFAULT_MODEL = "hy-image-lite";
const BASE_URL = "https://tokenhub.tencentmaas.com/v1/api/image/lite";

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "Tencent Hunyuan Image Lite",
  description: "Hunyuan Image Lite via TokenHub (fast image generation)",
  register(api) {
    api.registerImageGenerationProvider({
      id: PROVIDER_ID,
      label: "Tencent Hunyuan Image Lite",
      defaultModel: DEFAULT_MODEL,
      defaultTimeoutMs: 60_000,
      models: [DEFAULT_MODEL],
      capabilities: {
        generate: { maxCount: 1 },
        edit: { enabled: false, maxCount: 0, maxInputImages: 0 },
      },
      isConfigured: () =>
        !!(process.env.TOKENHUB_API_KEY || process.env.HUNYUAN_API_KEY),
      async generateImage(req) {
        const apiKey =
          process.env.TOKENHUB_API_KEY || process.env.HUNYUAN_API_KEY;
        if (!apiKey) {
          throw new Error(
            "Tencent TokenHub / Hunyuan API key missing. Set TOKENHUB_API_KEY or HUNYUAN_API_KEY."
          );
        }

        const body = {
          model: DEFAULT_MODEL,
          prompt: req.prompt,
          rsp_img_type: "url",
        };

        const response = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(60_000),
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `Hunyuan Image Lite generation failed (${response.status}): ${text}`
          );
        }

        const json = await response.json();

        const entries = json?.data;
        if (!Array.isArray(entries) || entries.length === 0) {
          throw new Error("Hunyuan Image Lite response missing image data");
        }

        const imageUrl = entries[0].url;
        if (!imageUrl) {
          throw new Error("Hunyuan Image Lite response entry missing url");
        }

        const imgRes = await fetch(imageUrl, {
          signal: AbortSignal.timeout(30_000),
        });
        if (!imgRes.ok) {
          throw new Error(
            `Failed to download generated image (${imgRes.status})`
          );
        }

        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const contentType = imgRes.headers.get("content-type") || "image/png";

        return {
          images: [
            {
              buffer,
              mimeType: contentType,
            },
          ],
          model: DEFAULT_MODEL,
        };
      },
    });
  },
});
