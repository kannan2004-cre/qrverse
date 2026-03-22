import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate, useParams } from "react-router-dom";

export function RedirectHandler() {
    const { shortId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInterstitial, setShowInterstitial] = useState(false);

    useEffect(() => {
        const handleRedirect = async () => {
            if (!shortId) {
                setError("Invalid short ID");
                setLoading(false);
                return;
            }

            try {
                const qrsRef = collection(db, "qrcodes");
                const q = query(qrsRef, where("shortId", "==", shortId));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("QR code not found");
                    setLoading(false);
                    return;
                }

                const qrDoc = querySnapshot.docs[0];
                const qrData = qrDoc.data();
                const targetUrl = qrData.targetUrl;

                // Check if visit tracking is enabled
                if (qrData.trackVisits) {
                    // Show interstitial screen
                    setShowInterstitial(true);
                    
                    // Log the visit immediately
                    try {
                        const updates = {
                            visits: (qrData.visits || 0) + 1
                        };
                        
                        console.log("Logging visit for interstitial:", updates);
                        await updateDoc(qrDoc.ref, updates);
                        
                        // Add timestamp to visits_log subcollection
                        const visitsLogRef = collection(qrDoc.ref, "visits_log");
                        await addDoc(visitsLogRef, {
                            timestamp: serverTimestamp(),
                            userAgent: navigator.userAgent,
                            referrer: document.referrer
                        });
                        
                        console.log("Successfully logged visit with timestamp");
                    } catch (visitError) {
                        console.error("Failed to log visit:", visitError);
                    }
                    
                    // Redirect after 1.5 seconds
                    setTimeout(() => {
                        window.location.replace(targetUrl);
                    }, 1500);
                } else {
                    // Standard tracking logic for non-interstitial QR codes
                    try {
                        const updates = {};
                        
                        if (qrData.trackVisitsOnly) {
                            // Only track visits, not clicks
                            updates.visits = (qrData.visits || 0) + 1;
                        } else {
                            // Track both clicks and visits
                            updates.clicks = (qrData.clicks || 0) + 1;
                            updates.visits = (qrData.visits || 0) + 1;
                        }
                        
                        console.log("Updating document with:", updates);
                        await updateDoc(qrDoc.ref, updates);
                        console.log("Successfully updated tracking data:", updates);
                    } catch (clickError) {
                        console.error("Failed to increment tracking data:", clickError);
                    }

                    window.location.replace(targetUrl);
                }
            } catch (err) {
                console.error("Redirect error:", err);
                setError("Failed to process redirect");
                setLoading(false);
            }
        };

        handleRedirect();
    }, [shortId]);

    if (showInterstitial) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting you to the destination...</h1>
                    <p className="text-gray-600">Please wait while we log your visit for analytics.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Processing redirect...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                    <div className="text-red-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirect Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
