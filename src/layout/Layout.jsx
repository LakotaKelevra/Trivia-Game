import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--purple)] text-[var(--peach)] px-5">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default Layout