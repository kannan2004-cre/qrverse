import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleCreateQr = () => {
        if (isAuthenticated) {
            navigate("/dashboard/generate");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-3xl space-y-8 p-12 bg-card rounded-3xl shadow-3d border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                    Welcome to <span className="text-primary">QRVerse</span>
                </h1>
                <p className="text-xl text-secondary-foreground md:text-2xl max-w-2xl mx-auto">
                    Generate stunning AI-powered QR codes that blend seamlessly into your brand identity.
                </p>

                <div className="pt-8">
                    <button
                        onClick={handleCreateQr}
                        className="px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-2xl shadow-3d hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-inner-3d transition-all duration-200"
                    >
                        Create QR Code
                    </button>
                </div>
            </div>
        </div>
    );
}
