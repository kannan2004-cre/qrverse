import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { createQrCode } from "../lib/db";
import { nanoid } from 'nanoid';
import { cn } from "../utils/cn";

export function GeneratePage() {
    const navigate = useNavigate();

    const [targetUrl, setTargetUrl] = useState("");
    const [isDynamicQR, setIsDynamicQR] = useState(false);
    const [isMerchantQR, setIsMerchantQR] = useState(false);
    const [merchantName, setMerchantName] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleGenerate = async () => {
        if (!targetUrl) {
            setError("Please enter a destination URL.");
            return;
        }

        if (isMerchantQR && !merchantName) {
            setError("Please enter a merchant name.");
            return;
        }

        setError(null);
        setIsGenerating(true);

        try {
            let finalTargetUrl = targetUrl;

            if (isDynamicQR) {
                const shortId = nanoid(6);
                finalTargetUrl = `${window.location.origin}/r/${shortId}`;

                await createQrCode({
                    targetUrl: targetUrl,
                    shortId,
                    isDynamic: true,
                    isMerchantQR,
                    merchantName: merchantName || null,
                    clicks: 0,
                });
            } else {
                await createQrCode({
                    targetUrl: finalTargetUrl,
                    isDynamic: false,
                    isMerchantQR,
                    merchantName: merchantName || null,
                });
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard/my-qrs");
            }, 1000);

        } catch (err) {
            console.error("Error generating QR:", err);
            setError("Failed to save QR code. Please try again.");
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Generate QR Code</h1>
                <p className="text-secondary-foreground text-lg">Create a new QR code with custom styles.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 md:p-8 bg-card rounded-3xl shadow-3d border border-white/5 space-y-8">

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl shadow-inner-3d border border-red-200 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl shadow-inner-3d border border-green-200 flex items-center gap-2 text-sm font-medium">
                            <Check className="w-5 h-5" />
                            Success! Redirecting to your gallery...
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground pl-1 text-shadow-sm">Destination URL</label>
                        <input
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-5 py-4 bg-background border border-border rounded-2xl shadow-inner-3d focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-6 h-6">
                                <input
                                    type="checkbox"
                                    checked={isDynamicQR}
                                    onChange={(e) => setIsDynamicQR(e.target.checked)}
                                    className="peer appearance-none w-6 h-6 bg-background border-2 border-border rounded-md shadow-inner-3d checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <Check className="absolute w-4 h-4 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="font-bold text-sm select-none group-hover:text-primary transition-colors">Dynamic QR (Editable URL)</span>
                        </label>
                        {isDynamicQR && (
                            <p className="text-sm text-secondary-foreground pl-9">
                                This QR code will redirect to your URL and can be edited later from your dashboard.
                            </p>
                        )}
                    </div>

                    <div className="w-full h-px bg-white/5 my-6"></div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-6 h-6">
                                <input
                                    type="checkbox"
                                    checked={isMerchantQR}
                                    onChange={(e) => setIsMerchantQR(e.target.checked)}
                                    className="peer appearance-none w-6 h-6 bg-background border-2 border-border rounded-md shadow-inner-3d checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <Check className="absolute w-4 h-4 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="font-bold text-sm select-none group-hover:text-primary transition-colors">Setup as Merchant QR</span>
                        </label>

                        <div className={cn(
                            "space-y-3 transition-all duration-300 overflow-hidden",
                            isMerchantQR ? "opacity-100 max-h-40 mt-4" : "opacity-0 max-h-0"
                        )}>
                            <label className="text-sm font-bold text-foreground pl-1 text-shadow-sm">Merchant Name</label>
                            <input
                                type="text"
                                value={merchantName}
                                onChange={(e) => setMerchantName(e.target.value)}
                                placeholder="Your Business Name"
                                className="w-full px-5 py-4 bg-background border border-border rounded-2xl shadow-inner-3d focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || success}
                        className="w-full py-5 mt-4 bg-primary text-primary-foreground font-extrabold rounded-2xl shadow-3d hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-inner-3d transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-lg"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : "Generate QR Code"}
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-secondary rounded-3xl shadow-inner-3d min-h-[500px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-50"></div>

                    <div className={cn(
                        "w-72 h-72 bg-card rounded-3xl shadow-3d flex items-center justify-center text-secondary-foreground/50 transition-all duration-500 relative z-10",
                        isDynamicQR ? "border-4 border-green-500/20" : "border-4 border-primary/20",
                        isGenerating ? "animate-pulse scale-95" : "hover:scale-105 hover:-rotate-2 rotate-3"
                    )}>
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-4 text-center px-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <span className="font-bold text-sm">
                                    {isDynamicQR ? 'Creating Dynamic QR...\nThis will be editable later.' : 'Generating QR Code...'}
                                </span>
                            </div>
                        ) : targetUrl ? (
                            <QRCodeSVG
                                value={targetUrl}
                                size={240}
                                level="H"
                                includeMargin={false}
                                fgColor={isDynamicQR ? "#10b981" : "#0f172a"}
                                bgColor="#ffffff"
                                className="w-full h-full p-6"
                            />
                        ) : (
                            <div className="text-center space-y-2">
                                <span className="font-extrabold text-xl opacity-30 select-none">Live Preview</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
