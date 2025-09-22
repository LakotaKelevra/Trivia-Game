import { useLocation } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import QuestionCard from "../components/QuestionCard";
import useOpenTrivia from "../hooks/useOpenTrivia";

function Quiz() {
    const { state } = useLocation();
    const { userName, category, level, numberOfQuestions } = state || {};
    const [token, setToken] = useState(null);
    const [gameSessionId, setGameSessionId] = useState(1);
    const { trivia, loading, error } = useOpenTrivia(userName, category, level, numberOfQuestions, token);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);


    const handleAnswer = useCallback((answer) => {
        const current = trivia[currentIndex];
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

    // Ritarda la visualizzazione del blocco Game Over di 1 secondo
    useEffect(() => {
        if (currentIndex >= trivia.length && started) {
            const t = setTimeout(() => setGameOver(true), 1000);
            return () => clearTimeout(t);
        } else {
            setGameOver(false);
        }
    }, [currentIndex, trivia.length, started]);



    return (
    <div className="container mx-auto p-2 text-center mt-2 max-w-full overflow-x-hidden">
            {!started && 
            <>
                <h1 className="text-3xl font-extrabold text-primary mb-3 drop-shadow-lg tracking-wide">Trivia Game: </h1>
                <h2 className="text-lg font-semibold text-secondary mb-2 tracking-wide">You've selected {numberOfQuestions} questions from {category !== "0" ? category : "various"} categories and {level !== "0" ? level : "mixed"} difficulty level</h2>
                </>
            }
                <div className="card w-full sm:max-w-md bg-base-100 card-lg shadow-xl justify-center mx-auto mt-2">
                {loading && <p>Loading questions...</p>}
                {error && <p>Error loading questions, please try again.</p>}

                <div className="card-body text-center w-full">
                    {!started && currentIndex === 0 && (
                        <>
                            <h2 className="mt-2">Good luck, {userName}!</h2>
                            <button className="btn btn-primary" onClick={() => setStarted(true)}>Start Quiz</button>
                        </>
                    )}
                    <AnimatePresence mode="wait">
                        {started && currentIndex < trivia.length && (
                            <QuestionCard
                                key={gameSessionId + '-' + currentIndex}
                                question={trivia[currentIndex].question}
                                answers={[
                                    trivia[currentIndex].correct_answer,
                                    ...trivia[currentIndex].incorrect_answers
                                ]}
                                correctAnswer={trivia[currentIndex].correct_answer}
                                onSelect={handleAnswer}
                                started={started}
                                answered={answered}
                                selectedAnswer={selectedAnswer}
                                currentIndex={currentIndex}
                                gameSessionId={gameSessionId}
                            />
                        )}
                    </AnimatePresence>

                    {started && currentIndex >= trivia.length && gameOver && (
                        <>
                            <h2 className="mt-4 mb-10">Quiz Finished!</h2>
                            <p className="mb-4">Your score: {score} out of {trivia.length * (gameSessionId)}</p>
                            <button className="btn btn-primary mr-2" onClick={() => {
                                setCurrentIndex(0);
                                setStarted(false);
                                setToken(null);
                                setScore(0);
                                setSelectedAnswer(null);
                                setAnswered(false);
                                navigate("/");
                            }}>Start a new game</button>
                            <button className="btn btn-secondary mr-2" onClick={async () => {
                                const result = await fetch('https://opentdb.com/api_token.php?command=request');
                                const data = await result.json();
                                setToken(data.token);
                                setCurrentIndex(0);
                                setStarted(true);
                                setSelectedAnswer(null);
                                setAnswered(false);
                                setGameSessionId(id => id + 1);
                                setScore(score);
                            }}>Go on playing</button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Quiz;