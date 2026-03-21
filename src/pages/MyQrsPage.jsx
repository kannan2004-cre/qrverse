import { useState, useEffect } from "react";
import { getUserQrCodes, deleteQrCode, updateQrCode } from "../lib/db";
import { useAuth } from "../hooks/useAuth";
import { QRCodeSVG } from 'qrcode.react';
import { MerchantExportCard } from "../components/MerchantExportCard";
import { MerchantTemplateExportCard } from "../components/MerchantTemplateExportCard";
import { exportToPdf } from "../utils/exportPdf";
import { exportPersonalPDF } from "../utils/exportMerchantPdf";
import { Loader2, Trash2, Edit3, Eye } from "lucide-react";

export function MyQrsPage() {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editUrl, setEditUrl] = useState("");

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this QR code?")) return;

        setDeletingId(id);
        try {
            await deleteQrCode(id);
            setQrs(currentQrs => currentQrs.filter(qr => qr.id !== id));
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete QR code.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (qr) => {
        setEditingId(qr.id);
        setEditUrl('');
    };

    const handleSaveEdit = async () => {
        const cleanUrl = editUrl.trim();
        
        if (!cleanUrl) {
            alert("Please enter a valid URL.");
            return;
        }

        try {
            new URL(cleanUrl);
        } catch {
            alert("Please enter a valid URL (e.g., https://example.com)");
            return;
        }

        try {
            await updateQrCode(editingId, { targetUrl: cleanUrl });
            setQrs(currentQrs => 
                currentQrs.map(qr => 
                    qr.id === editingId ? { ...qr, targetUrl: cleanUrl } : qr
                )
            );
            setEditingId(null);
            setEditUrl("");
        } catch (err) {
            console.error("Failed to update QR code", err);
            alert("Failed to update QR code. Please try again.");
        }
    };

    const handleCloseEdit = () => {
        setEditingId(null);
        setEditUrl("");
    };

    const handleDownload = async (qr) => {
        setDownloadingId(qr.id);
        try {
            const linkToEncode = qr.isDynamic 
                ? `${window.location.origin}/r/${qr.shortId}` 
                : qr.targetUrl;

            if (qr.isMerchantQR) {
                await exportToPdf(`merchant-export-${qr.id}`, `${qr.merchantName?.replace(/\s+/g, '-') || 'Export'}-QR.pdf`);
            } else {
                await exportPersonalPDF(qr.qrType, linkToEncode, qr.imageUrl);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to export PDF.");
        } finally {
            setDownloadingId(null);
        }
    };

    useEffect(() => {
        async function loadQrs() {
            if (!isAuthenticated) return;

            try {
                const qrData = await getUserQrCodes();
                const formattedQrs = qrData.map(qr => ({
                    ...qr,
                    formattedDate: qr.createdAt?.toDate ? qr.createdAt.toDate().toLocaleDateString() : "Just now"
                }));
                setQrs(formattedQrs);
            } catch (err) {
                console.error("Failed to fetch QRs", err);
                setError("Failed to load your QR codes.");
            } finally {
                setLoading(false);
            }
        }

        loadQrs();
    }, [isAuthenticated]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">My QRs</h1>
                <p className="text-secondary-foreground text-lg">Manage and view your previously generated QR codes.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-secondary-foreground">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 shadow-3d"></div>
                    <p>Loading your Oculus Zero QR codes...</p>
                </div>
            ) : error ? (
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl shadow-inner-3d border border-red-200">
                    {error}
                </div>
            ) : qrs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl shadow-3d border border-white/10 text-center space-y-4">
                    <p className="text-secondary-foreground text-lg">You haven't generated any QR codes yet.</p>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto space-y-4">
                    {qrs.map((qr) => (
                        <div
                            key={qr.id}
                            className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="w-32 h-32 flex-shrink-0 bg-white p-2 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600">
                                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                                    {qr.qrType === 'ai' && qr.imageUrl && !qr.imageUrl.includes('pollinations.ai') ? (
                                        <img src={qr.imageUrl} alt="AI QR Code" className="w-full h-full object-cover rounded" crossOrigin="anonymous" />
                                    ) : (
                                        <QRCodeSVG
                                            value={qr.isDynamic 
                                                ? `${window.location.origin}/r/${qr.shortId}`
                                                : qr.targetUrl || "https://qrverse.app"}
                                            size={120}
                                            level="H"
                                            includeMargin={false}
                                            fgColor={qr.qrType === 'ai' ? "#8b5cf6" : "#0f172a"}
                                            bgColor="#ffffff"
                                            imageSettings={qr.qrType === 'ai' && qr.imageUrl ? {
                                                src: qr.imageUrl,
                                                height: 32,
                                                width: 32,
                                                excavate: true
                                            } : undefined}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <h3 className="text-xl font-bold dark:text-white truncate" title={qr.merchantName || 'Target URL'}>
                                    {qr.merchantName || 'Link'}
                                </h3>
                                <p className="text-sm text-gray-500 truncate max-w-md mt-1" title={qr.targetUrl}>
                                    {qr.targetUrl}
                                </p>
                                
                                <div className="flex items-center gap-3 mt-3 text-xs font-medium">
                                    {qr.isDynamic && (
                                        <>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                                Dynamic QR
                                            </span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                                {qr.clicks || 0} clicks
                                            </span>
                                        </>
                                    )}
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {qr.formattedDate}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3 shrink-0">
                                {qr.isMerchantQR ? (
                                    <MerchantTemplateExportCard
                                        id={`merchant-template-export-${qr.id}`}
                                        merchantName={qr.merchantName}
                                        qrType={qr.qrType}
                                        targetUrl={qr.targetUrl}
                                        imageUrl={qr.imageUrl}
                                        shortId={qr.shortId}
                                        isDynamic={qr.isDynamic}
                                        onDownloadComplete={() => {
                                        }}
                                    />
                                ) : (
                                    <button
                                        onClick={() => handleDownload(qr)}
                                        disabled={downloadingId === qr.id || deletingId === qr.id}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:shadow-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingId === qr.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Download'}
                                    </button>
                                )}
                                
                                {qr.isDynamic && (
                                    <button
                                        onClick={() => handleEdit(qr)}
                                        disabled={editingId === qr.id}
                                        className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Edit Destination"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => handleDelete(qr.id)}
                                    disabled={deletingId === qr.id || downloadingId === qr.id}
                                    className="p-2 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete QR"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <EditModal
                isOpen={editingId !== null}
                onClose={handleCloseEdit}
                onSave={handleSaveEdit}
                url={editUrl}
                setUrl={setEditUrl}
                isLoading={false}
            />
        </div>
    );
}

function EditModal({ isOpen, onClose, onSave, url, setUrl, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-3d p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Destination URL</h2>
                <p className="text-sm text-gray-600 mb-4">Update the URL this QR code will redirect to.</p>
                
                <input
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="Paste the new destination URL here..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 text-gray-900 placeholder-gray-500"
                />
                
                <div className="flex gap-3">
                    <button
                        onClick={onSave}
                        disabled={isLoading}
                        className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
