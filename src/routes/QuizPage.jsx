import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import QuestionCard from "../components/QuestionCard";
import CircleAnimation from "../components/CircleAnimation";
import useOpenTrivia from "../hooks/useOpenTrivia";
import useRanking from "../hooks/useRanking";
import QuizCard from "../components/QuizCard";

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Recupera i dati da location.state o sessionStorage
    let { userName, category, level, numberOfQuestions, categoryName } = location.state || {};
    // Redirect automatico se i dati non sono presenti
    useEffect(() => {
        if (!category || !level || !numberOfQuestions) {
            navigate("/", { replace: true });
        }
    }, [userName, category, level, numberOfQuestions]);

    // Se non ci sono nello state, prova a recuperarli dalla sessione
    if (!userName || !category || !level || !numberOfQuestions || !categoryName) {
        const sessionData = sessionStorage.getItem("quizData");
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                userName = parsed.userName;
                category = parsed.category;
                level = parsed.level;
                numberOfQuestions = parsed.numberOfQuestions;
                categoryName = parsed.categoryName;
            } catch { }
        }
    }


    // Salva i dati in localStorage quando disponibili
    if (userName && category && level && numberOfQuestions && categoryName) {
        localStorage.setItem("quizData", JSON.stringify({ userName, category, level, numberOfQuestions, categoryName }));
    }
    const [token, setToken] = useState(null);
    const [gameSessionId, setGameSessionId] = useState(1);
    const { trivia, loading, error } = useOpenTrivia(userName, category, level, numberOfQuestions, token, gameSessionId);

    // Salva le domande (trivia) in localStorage quando vengono caricate
    useEffect(() => {
        if (trivia && trivia.length > 0) {
            localStorage.setItem("quizTrivia", JSON.stringify(trivia));
        }
    }, [trivia]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const { addRecord } = useRanking();


    const handleAnswer = useCallback((answer) => {
        const current = trivia[currentIndex];
        if (!current) return; // Evita errori se il round è finito
        setAnswered(true);
        setSelectedAnswer(answer);
        if (answer === current.correct_answer) {
            setScore(s => s + 1);
        }
        setTimeout(() => {
            setAnswered(false);
            setSelectedAnswer(null);
            setCurrentIndex(i => i + 1);
        }, 1000);
    }, [currentIndex, trivia]);

    const handleNextGame = () => {
        setToken(token);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setAnswered(false);
        setScore(score);
        setStarted(false);
        setGameOver(false);
        setGameSessionId(gameSessionId + 1);
    };

    // Ritarda la visualizzazione del blocco Game Over di 1 secondo
    useEffect(() => {
        if (currentIndex >= trivia.length && started) {
            const t = setTimeout(() => setGameOver(true), 1000);
            const fetchTokenAndSave = async () => {
                if (!token) {
                    try {
                        const result = await fetch('https://opentdb.com/api_token.php?command=request');
                        const data = await result.json();
                        setToken(data.token);

                        // usa il token appena ricevuto
                    } catch (err) {
                        console.error(err);
                    }
                }
                addRecord(token, userName, score, numberOfQuestions * gameSessionId);
            };
            fetchTokenAndSave();
            return () => clearTimeout(t);
        } else {
            setGameOver(false);
        }
    }, [currentIndex, started]);





    return (
        <div className="container mx-auto p-2 text-center mt-2 max-w-full overflow-x-hidden overflow-y-hidden">
            <h1 className="text-3xl font-extrabold text-center my-5">TRIVIA GAME</h1>
            <div className="card w-full sm:max-w-md card-lg shadow-xl justify-center mx-auto mt-2">


                <QuizCard
                    userName={userName}
                    numberOfQuestions={numberOfQuestions}
                    loading={loading}
                    error={error}
                    gameOver={gameOver}
                    categoryName={categoryName}
                    level={level}
                    key={gameSessionId + '-' + currentIndex}
                    trivia={trivia}
                    onSelect={handleAnswer}
                    started={started}
                    setStarted={setStarted}
                    answered={answered}
                    selectedAnswer={selectedAnswer}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    gameSessionId={gameSessionId}
                    score={score}
                    token={token}
                    setToken={setToken}
                    onNextGame={handleNextGame}
                />
            </div>
        </div>

    );
}

export default Quiz;