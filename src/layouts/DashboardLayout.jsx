import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { QrCode, LayoutGrid, LogOut, Settings, Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/");
    };

    const navItems = [
        { name: "Generate QR", path: "/dashboard/generate", icon: QrCode },
        { name: "My QRs", path: "/dashboard/my-qrs", icon: LayoutGrid },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col shadow-3d z-10">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-inner-3d">
                        Q
                    </div>
                    <span className="text-xl font-bold tracking-tight">QRVerse</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-primary text-primary-foreground shadow-3d translate-y-[-2px]"
                                        : "text-foreground hover:bg-secondary hover:shadow-inner-3d hover:translate-y-[-1px]"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-secondary shadow-inner-3d">
                        <button
                            onClick={() => setTheme("light")}
                            className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-card shadow-3d' : 'text-secondary-foreground hover:bg-secondary'}`}
                            title="Light Mode"
                        >
                            <Sun size={18} />
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-card shadow-3d' : 'text-secondary-foreground hover:bg-secondary'}`}
                            title="Dark Mode"
                        >
                            <Moon size={18} />
                        </button>
                        <button
                            onClick={() => setTheme("system")}
                            className={`p-2 rounded-md transition-all ${theme === 'system' ? 'bg-card shadow-3d' : 'text-secondary-foreground hover:bg-secondary'}`}
                            title="System Theme"
                        >
                            <Laptop size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 hover:shadow-inner-3d transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
