import { useState, useEffect } from "react";
import useCategories from "../hooks/useCategories";
import { useNavigate } from "react-router-dom";

function Home() {
    const { categories, loading, error } = useCategories();
    const [userName, setUserName] = useState('Player');
    const [category, setCategory] = useState('0');
    const [level, setLevel] = useState('0');
    const [numberOfQuestions, setNumberOfQuestions] = useState('5');
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true);

    // Abilita il pulsante dopo 5 secondi dal mount
    useEffect(() => {
        const timer = setTimeout(() => setDisabled(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/quiz", {
            state: { userName, category, level, numberOfQuestions }
        });
    }

    return (
    <div className="container mx-auto p-4 text-center max-w-full overflow-x-hidden">
            <h1>Welcome to the Trivia Game!</h1>
            <div className="card w-full sm:max-w-md bg-base-100 card-lg shadow-xl justify-center mx-auto mt-4">
                {loading && <p>Loading categories...</p>}
                {error && <p>Error loading categories, please try again.</p>}
                <div className="card-body text-center w-full">
                    <form onSubmit={handleSubmit}>
                        {/* nome giocatore */}
                        <input type="text" placeholder="Type here your name" className="input input-ghost" value={userName} onChange={(e) => setUserName(e.target.value)}/>

                        {/* selezione categoria */}
                        <select className="select select-ghost " value={category}
              onChange={(e) => setCategory(e.target.value)}>
                            <option value="0">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        {/* selezione livello */}
                        <select className="select select-ghost"
                        value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="0">All levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        {/* Numero di domande */}
                        <select className="select select-ghost" value={numberOfQuestions} onChange={(e) => setNumberOfQuestions(e.target.value)}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>

                        <button className="btn btn-primary mt-5" type="submit" disabled={disabled}>Start Game {disabled && <span className="loading loading-dots loading-md"></span>}</button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home