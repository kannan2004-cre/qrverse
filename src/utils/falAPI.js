import { fal } from "@fal-ai/client";

export async function generateAIQRCode(targetUrl, userPrompt) {
  console.log("Starting Fal.ai QR generation for:", targetUrl);
  try {
    const result = await fal.subscribe("fal-ai/qr-monster", {
      input: {
        prompt: userPrompt,
        qr_code_data: targetUrl,
        guidance_scale: 7.5,
        controlnet_conditioning_scale: 1.5,
        negative_prompt: "blurry, low quality, bad anatomy, deformed"
      }
    });

    if (result && result.image && result.image.url) {
      return result.image.url;
    } else {
      throw new Error("Fal.ai returned an empty response.");
    }
  } catch (error) {
    console.error("Fal.ai Generation Error:", error);
    throw error;
  }
}
