import { useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "../components/QuestionCard";
import useOpenTrivia from "../hooks/useOpenTrivia";


function Quiz() {
    const { state } = useLocation();
    const { userName, category, level, numberOfQuestions } = state || {};
    const { trivia, loading, error } = useOpenTrivia(userName, category, level, numberOfQuestions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [token, setToken] = useState(null);
    const [started, setStarted] = useState(false);


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



    return (
        <div className="container mx-auto p-4 text-center mt-10 py-10">
            <h1>Welcome to the Trivia Game!</h1>
            <div className="card w-96 bg-base-100 card-lg shadow-sm justify-center mx-auto mt-4">
                {loading && <p>Loading questions...</p>}
                {error && <p>Error loading questions, please try again.</p>}

                <div className="card-body text-center">
                    {!started && (
                        <>
                            <h2 className="mt-4">Good luck, {userName}!</h2>
                            <button className="btn btn-primary" onClick={() => setStarted(true)}>Start Quiz</button>
                        </>
                    )}
                    <AnimatePresence mode="wait">
                        {started && currentIndex < trivia.length && (
                            <QuestionCard
                                key={currentIndex}
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
                            />
                        )}
                    </AnimatePresence>

                    {started && currentIndex >= trivia.length && (
                        <>
                            <h2 className="mt-4">Quiz Finished!</h2>
                            <p>Your score: {score} out of {trivia.length}</p>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Quiz;