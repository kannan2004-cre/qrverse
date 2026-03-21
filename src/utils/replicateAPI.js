import QRCode from 'qrcode';

export async function generateAIQRCode(targetUrl, userPrompt) {
    const token = import.meta.env.VITE_REPLICATE_API_TOKEN;
    
    if (!token) {
        throw new Error("Missing Replicate API Token. Please add VITE_REPLICATE_API_TOKEN to your .env file.");
    }

    console.log("Starting artistic QR generation for:", targetUrl);

    const qrBase64 = await QRCode.toDataURL(targetUrl, {
        width: 768,
        margin: 1,
        color: {
            dark: '#000000FF',
            light: '#FFFFFFFF'
        }
    });

    const createResponse = await fetch('/api/replicate/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: "628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557",
            input: {
                prompt: userPrompt,
                url: targetUrl,
                image: qrBase64,
                control_image: qrBase64,
                qr_conditioning_scale: 1.3,
                controlnet_conditioning_scale: 1.3,
                guidance_scale: 7.5,
                negative_prompt: "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry"
            }
        })
    });

    if (!createResponse.ok) {
        const errType = await createResponse.text();
        throw new Error(`Replicate API Error: ${errType}`);
    }

    const prediction = await createResponse.json();
    let predictionUrl = `/api/replicate/v1/predictions/${prediction.id}`;

    while (true) {
        const statusResponse = await fetch(predictionUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!statusResponse.ok) {
            throw new Error(`Failed to check prediction status`);
        }

        const statusData = await statusResponse.json();

        if (statusData.status === "succeeded") {
            return statusData.output[0];
        } else if (statusData.status === "failed") {
            throw new Error("Replicate image generation failed internally.");
        } else if (statusData.status === "canceled") {
            throw new Error("Replicate image generation was canceled.");
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
    }
}
