import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Declaration from "../pages/Declaration";
import Historique from "../pages/Historique";
import Impression from "../pages/Impression";
import Login from "../pages/Login";
 import Register from "../pages/Register";
import Profil from "../pages/Profil";
import MyAntCalendar from "../components/Calendar";
import MyChart from "../components/ChartIrsa";
import Notfound from "../pages/404";
// import Chatbot from "../components/ChatBot";

import SendEmailForm from "../pages/EnvoyerEmail";
import MainContent from "../pages/Table";
//import Profil from "../pages/ProfilEx";
import MadagascarMap from "../components/MadagascarMap";

// Wrapper pour gérer la condition d'affichage du Navbar et Footer
function Layout({ children }) {
    const location = useLocation();
    const hideNavAndFooter = ["/login", "/register"].includes(location.pathname); // Pages sans Navbar/Footer

    return (
        <>
            {!hideNavAndFooter && <NavigationBar />}
            {children}
            {!hideNavAndFooter && <Footer />}
        </>
    );
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/declaration" element={<Declaration />} />
                    <Route path="/historique" element={<Historique />} />
                    <Route path="/calendrier" element={<MyAntCalendar />} />
                    <Route path="/email" element={<SendEmailForm />} />
                    <Route path="/impression" element={<Impression />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/table" element={<MainContent />} />
                    <Route path="/chart" element={<MyChart />} />
                    <Route path="/carte" element={<MadagascarMap />} />
                    <Route path="*" element={<Notfound />} />
                    {/* <Route path="/chat" element={<Chatbot />} /> */}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default AppRouter;
