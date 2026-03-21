import { useState } from 'react';
import { exportMerchantPDF } from '../utils/exportMerchantPdf';

export function MerchantTemplateExportCard({ 
    id, 
    merchantName, 
    qrType,
    targetUrl,
    imageUrl,
    shortId,
    isDynamic,
    onDownloadComplete 
}) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        
        try {
            const linkToEncode = isDynamic 
                ? `${window.location.origin}/r/${shortId}` 
                : targetUrl;

            await exportMerchantPDF(
                qrType || 'standard',
                linkToEncode || "https://qrverse.app",
                imageUrl,
                merchantName || "Merchant"
            );
            
            if (onDownloadComplete) {
                onDownloadComplete();
            }
        } catch (error) {
            console.error("PDF Export error:", error);
            alert(error.message || "Failed to export PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div
                id={id}
                className="pointer-events-none"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '0',
                    zIndex: -50,
                    display: 'none'
                }}
            >
            </div>

            <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                {isDownloading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Merchant QR
                    </>
                )}
            </button>
        </>
    );
}
