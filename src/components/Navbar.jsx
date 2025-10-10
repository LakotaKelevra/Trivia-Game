import { Link, useLocation } from "react-router-dom";
import Home from '../assets/Home.svg';
import Ranking from '../assets/Rank.svg';

function Navbar() {
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className="navbar bg-[var(--purple)] mx-0">
            <div className="flex-1  m-2 me-2">
                {path !== "/" && (
                    <Link to="/" className="icon"><img src={Home} alt="Trivia Game" /></Link>
                )}
            </div>
            <div className="flex-none m-2 me-2 ">
                    {path == "/" && (
                        <Link to="/ranking" className="icon"><img src={Ranking} alt="Ranking" /></Link>
                    )}
               
            </div>
        </div>
    );
}

export default Navbar;