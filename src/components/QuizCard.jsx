import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCountdown from "../hooks/useCountdown";
import CircleAnimation from "./CircleAnimation";
import Ready from "./Ready";

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function QuizCard({ userName, numberOfQuestions, loading, error, gameOver, categoryName, category, level, trivia, onSelect, started, answered, setAnswered, selectedAnswer, setSelectedAnswer, currentIndex, setCurrentIndex, gameSessionId, setStarted, score, setScore, setToken, onNextGame, ready }) {
    const navigate = useNavigate();
    const question = trivia && trivia.length > 0 ? trivia[currentIndex] : null;
    const shuffledAnswers = useMemo(() => {
        if (!question) return [];
        return shuffle([question.correct_answer, ...question.incorrect_answers]);
    }, [question, currentIndex, gameSessionId]);

    const initialTime = 15; // modificare qui se si vuole cambiare il tempo
    const timeLeft = useCountdown(initialTime, started, () => onSelect(null), currentIndex);
    const progress = (initialTime - timeLeft) / initialTime;


    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    return (
        <>
            {/* Nickname e domande */}
            <div className="mb-4 bg-[var(--purpledark)] text-[var(--peach)] px-5 py-3 rounded-xl shadow-lg text-start flex items-center justify-between">
                <div className="my-2">
                    <h2 className="text-lg font-semibold">{userName}</h2>
                    <h2 className="text-lg font-semibold">Question  {currentIndex+1>numberOfQuestions ? numberOfQuestions : currentIndex + 1}/{numberOfQuestions}</h2>
                </div>
                <div className="relative flex items-center justify-center me-7 overflow-visible">
                    {/* Cerchio animato, posizionato fuori dal div */}
                    <div className="absolute -top-4 left-1/4 -translate-x-1/6 -translate-y-1/12 z-10">
                        <CircleAnimation progress={gameOver ? 0 : progress} duration={initialTime} />
                    </div>
                    {/* Countdown centrato sopra il cerchio */}
                    <p className="relative z-20 text-3xl font-bold">{gameOver ? '00' : (timeLeft < 10 ? `0${timeLeft}` : timeLeft)}s</p>
                </div>
            </div>



            <div className="card-body text-center w-full bg-[var(--peach)] px-5 pb-3 pt-2 rounded-3xl mt-2">
                {/* Caricamento */}
                {loading && <p>Loading questions...</p>}
                {error && <>
                    <p>Error loading questions, please try again.</p>
                    <button className="btn bg-[var(--peachdark)] mt-2" onClick={() => navigate(-1)}>Back</button>
                </>}
                {/* Pulsante start */}
                {!started && currentIndex === 0 && (
                    <>
                        <h3 className="text-lg font-semibold text-[var(--purpledark)] mt-5 mb-2 tracking-wide px-5">You've selected <span className="font-bold">{numberOfQuestions}</span> questions from <span className="font-bold">{categoryName || (category !== "0" ? category : "various")}</span> and <span className="font-bold">{level !== "0" ? level : "mixed"}</span> difficulty level</h3>
                        <h2 className="text-lg font-semibold text-[var(--purpledark)] my-2 tracking-wide px-5">Good luck, {userName}!</h2>
                        <button className="btn bg-[var(--blue)] w-25 mx-auto" onClick={() => setStarted(true)}>Start!</button>
                    </>
                )}

                {/* Quiz Card */}
                <AnimatePresence mode="wait">
                    {!ready && !loading && (
                        <Ready />
                    )}
                    {started && trivia && Array.isArray(trivia) && trivia.length > 0 && currentIndex < trivia.length && ready && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}

                        >

                            <div className="card-body bg-[var(--peach)] text-[var(--purpledark)] py-2">
                                <h2 className="card-title text-lg">
                                    {decodeHtml(question.question)}
                                </h2>
                                <div className="flex flex-col gap-3">

                                    {shuffledAnswers.map((ans, i) => {
                                        let btnClass = "btn btn-outline w-full whitespace-normal break-words py-3 min-h-[3rem] answer-btn";

                                        if (answered) {
                                            if (ans === question.correct_answer) {
                                                btnClass = "btn btn-success w-full whitespace-normal break-words py-3 min-h-[3rem]"; // verde per corretta
                                            } else if (ans === selectedAnswer) {
                                                btnClass = "btn btn-error w-full whitespace-normal break-words py-3 min-h-[3rem]";   // rosso se sbagliata
                                            }
                                        } else if (ans === selectedAnswer) {
                                            btnClass = "bg-primary text-white w-full whitespace-normal break-words py-3 min-h-[3rem]"; // evidenzia selezione prima della conferma
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => onSelect(ans)}
                                                className={btnClass}
                                                style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                                            >
                                                {decodeHtml(ans)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Game over */}
                {started && Array.isArray(trivia) && trivia.length > 0 && currentIndex >= trivia.length && gameOver && (
                    <>
                        <h2 className="my-4 text-[var(--purpledark)]">Quiz Finished!</h2>
                        <h3 className="mb-4 text-[var(--purpledark)]">Your score: {score} out of {trivia.length * (gameSessionId)}</h3>
                        <div className="m-0 p-0 justify-center">
                            <button className="btn bg-[var(--blue)] mr-2 w-50 mb-2" onClick={() => {
                                setCurrentIndex(0);
                                setStarted(false);
                                setToken(null);
                                setScore(0);
                                setSelectedAnswer(null);
                                setAnswered(false);
                                navigate("/");
                            }}>Start a new game</button>
                            <button className="btn bg-[var(--peachdark)] mr-2 w-50 mb-2" onClick={() => {
                                onNextGame();
                            }}>Go on playing</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default QuizCard;