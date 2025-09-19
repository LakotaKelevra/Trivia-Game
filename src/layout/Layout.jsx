import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

function Layout() {
    return (
        <div data-theme="dark">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default Layout