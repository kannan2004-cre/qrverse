import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { GeneratePage } from "./pages/GeneratePage";
import { MyQrsPage } from "./pages/MyQrsPage";
import { RedirectHandler } from "./pages/RedirectHandler";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qrverse-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/r/:shortId" element={<RedirectHandler />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="generate" element={<GeneratePage />} />
                <Route path="my-qrs" element={<MyQrsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
