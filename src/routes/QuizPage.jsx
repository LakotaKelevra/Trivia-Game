import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import QuestionCard from "../components/QuestionCard";
import CircleAnimation from "../components/CircleAnimation";
import useOpenTrivia from "../hooks/useOpenTrivia";
import useRanking from "../hooks/useRanking";
import QuizCard from "../components/QuizCard";
import { div } from "framer-motion/client";
import Ready from "../components/Ready";

function Quiz() {
    const [ready, setReady] = useState(false);
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
    const { trivia, loading, error } = useOpenTrivia(userName, category, level, numberOfQuestions, token, gameSessionId, setReady);

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
        if (Array.isArray(trivia) && trivia.length > 0 && currentIndex >= trivia.length && started) {
            setGameOver(true);
            const fetchTokenAndSave = async () => {
                if (!token) {
                    try {
                        const result = await fetch('https://opentdb.com/api_token.php?command=request');
                        const data = await result.json();
                        // usa il token appena ricevuto
                        setToken(data.token);
                        addRecord(data.token, userName, score, numberOfQuestions * gameSessionId);
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    addRecord(token, userName, score, numberOfQuestions * gameSessionId);
                }
            };
            fetchTokenAndSave();            
        } else {
            setGameOver(false);
        }
    }, [currentIndex, started]);

    // Ready è diventa true al termine del caricamento delle domande
    useEffect(() => {
        console.log("Ready = false");
        setReady(false);
    }, [gameSessionId]);



    return (
        <div className="container mx-auto p-2 px-5 text-center max-w-full overflow-x-hidden overflow-y-hidden">
            <h1 className="text-3xl font-extrabold text-center mb-5">TRIVIA GAME</h1>
            <div className="card w-full sm:max-w-md card-lg shadow-xl justify-center mx-auto mt-2">
                {(!ready || loading) && (
                    <Ready />
                )}
                {ready && (
                    <QuizCard
                        userName={userName}
                        numberOfQuestions={numberOfQuestions}
                        loading={loading}
                        error={error}
                        gameOver={gameOver}
                        category={category}
                        categoryName={categoryName}
                        level={level}
                        key={gameSessionId + '-' + currentIndex}
                        trivia={trivia}
                        onSelect={handleAnswer}
                        started={started}
                        setStarted={setStarted}
                        answered={answered}
                        setAnswered={setAnswered}
                        selectedAnswer={selectedAnswer}
                        setSelectedAnswer={setSelectedAnswer}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        gameSessionId={gameSessionId}
                        score={score}
                        setScore={setScore}
                        token={token}
                        setToken={setToken}
                        onNextGame={handleNextGame}
                        ready={ready}
                    />
                )}
            </div>
        </div>
    );
}

export default Quiz;