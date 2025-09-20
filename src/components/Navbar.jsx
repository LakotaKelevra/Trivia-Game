
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl"><Link to="/">Trivia Game</Link></a>
            </div>
          
        </div>
    );
}

export default Navbar;