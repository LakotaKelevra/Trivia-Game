import { useState, useEffect } from "react";
import useCategories from "../hooks/useCategories";
import { useNavigate } from "react-router-dom";

function Home() {
    const { categories, loading, error } = useCategories();
    const [userName, setUserName] = useState('');
    const [category, setCategory] = useState('0');
    const [level, setLevel] = useState('0');
    const [numberOfQuestions, setNumberOfQuestions] = useState('5');
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true);

    // Abilita il pulsante dopo 3 secondi dal mount per dar tempo all'API di rispondere
    // questo controllo è deprecato a seguito del div di loading delle domande, in test
    useEffect(() => {
        const timer = setTimeout(() => setDisabled(false));
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        let categoryName = "All categories";
        const finalUserName = userName || "Player";
        if (category !== "0") {
            const found = categories.find(cat => String(cat.id) === String(category));
            if (found) categoryName = found.name;
        }
        console.log("Quiz params (handleSubmit):", { finalUserName, category, level, numberOfQuestions, categoryName });

        navigate("/quiz", {
            state: { userName: finalUserName, category, level, numberOfQuestions, categoryName }
        });
    }

    const handleRandomGame = (event) => {
        event.preventDefault();
        if (!userName) setUserName("Player");

        // Scegli categoria casuale tra quelle disponibili
        let randomCategory = "0";
        let categoryName = "All categories";
        if (categories.length > 0) {
            const randomCat = categories[Math.floor(Math.random() * categories.length)];
            randomCategory = String(randomCat.id);
            categoryName = randomCat.name;
        }
        const levels = ["easy", "medium", "hard"];
        const nums = ["5", "10", "15"];
        const randomLevel = levels[Math.floor(Math.random() * levels.length)];
        const randomNum = nums[Math.floor(Math.random() * nums.length)];
        console.log("Quiz params (handleRandomGame):", { userName, category, level, numberOfQuestions, categoryName });

        navigate("/quiz", {
            state: {
                userName : userName || "Player",
                category: randomCategory,
                level: randomLevel,
                numberOfQuestions: randomNum,
                categoryName
            }
        });
    };

    return (
        <div className="container mx-auto p-4 text-center max-w-full overflow-x-hidden">
            <h1 className="text-3xl font-extrabold text-center mb-5">WELCOME TO THE <br /> TRIVIA GAME</h1>
            <div className="card w-full sm:max-w-md  card-lg shadow-xl justify-center mx-auto mt-4">
                {loading && <p>Loading categories...</p>}
                {error && <p>Error loading categories, please try again.</p>}
                <div className="card-body text-center w-full bg-[var(--peachdark)] text-[var(--purpledark)] px-0 pb-1 pt-2 rounded-3xl ">
                    <h2 className="text-2xl font-bold text-center">Get Ready!</h2>
                    <div className="w-full min-w-full block bg-[var(--peach)] p-4 rounded-3xl">
                        <form onSubmit={handleSubmit}>
                            {/* nome giocatore */}
                            <input type="text" placeholder="Type here your name" className="input !bg-[var(--yellow)] focus:!bg-[var(--bluelight)] hover:!bg-[var(--yellow)] mb-2" value={userName} maxLength="16"  onChange={(e) => setUserName(e.target.value)} />

                            {/* selezione categoria */}
                            <select className="select bg-[var(--yellow)] mb-2" value={category}
                                onChange={(e) => setCategory(e.target.value)}>
                                <option className="hover:!bg-[var(--bluelight)]" value="0" >All categories</option>
                                {categories.map((cat) => (
                                    <option className="hover:!bg-[var(--bluelight)]" key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            {/* selezione livello */}
                            <select className="select bg-[var(--yellow)] mb-2"
                                value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option className="hover:!bg-[var(--bluelight)]" value="0">All levels</option>
                                <option className="hover:!bg-[var(--bluelight)]" value="easy">Easy</option>
                                <option className="hover:!bg-[var(--bluelight)]" value="medium">Medium</option>
                                <option className="hover:!bg-[var(--bluelight)]" value="hard">Hard</option>
                            </select>

                            {/* Numero di domande */}
                            <select className="select bg-[var(--yellow)] mb-2" value={numberOfQuestions} onChange={(e) => setNumberOfQuestions(e.target.value)}>
                                <option className="hover:!bg-[var(--bluelight)]" value="5">5</option>
                                <option className="hover:!bg-[var(--bluelight)]" value="10">10</option>
                                <option className="hover:!bg-[var(--bluelight)]" value="15">15</option>
                            </select>

                            <button className="btn bg-[var(--blue)] mt-5 w-25 border-0" type="submit" disabled={disabled}>
                                {!disabled ? "Start!" : <span className="loading loading-dots loading-md"></span>}
                                </button>
                        </form>

                        {/* Il nome viene preso dallo userName attuale */}
                        <button
                            className="btn bg-[var(--blue)] border-0 mt-2 w-25"
                            type="button"
                            disabled={disabled}
                            onClick={handleRandomGame}
                        >
                             {!disabled ? "Random" : <span className="loading loading-dots loading-md"></span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home