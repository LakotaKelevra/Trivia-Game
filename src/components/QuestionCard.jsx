import { motion } from "framer-motion";
import { useMemo } from "react";
import useCountdown from "../hooks/useCountdown";

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function QuestionCard({ question, answers, onSelect, correctAnswer, started, answered, selectedAnswer, currentIndex, gameSessionId }) {
    const shuffledAnswers = useMemo(() => shuffle(answers), [currentIndex, gameSessionId]);
    const timeLeft = useCountdown(10, started, () => onSelect(null), currentIndex);

    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="card w-96 bg-base-100 shadow-lg p-6 mx-auto"
        >
            <div className="card w-full max-w-md bg-base-100 shadow-xl mx-auto p-4">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4">
                        {decodeHtml(question)}
                    </h2>
                    <div className="flex flex-col gap-3">
                        <p className="mb-2 text-lg">Time left: <span className="countdown">
                            <span style={{ "--value": timeLeft-1 }} aria-live="polite">{timeLeft-1}</span>
                        </span>s</p>
                        {shuffledAnswers.map((ans, i) => {
                            let btnClass = "btn btn-outline";

                            if (answered) {
                                if (ans === correctAnswer) {
                                    btnClass = "btn btn-success"; // verde per corretta
                                } else if (ans === selectedAnswer) {
                                    btnClass = "btn btn-error";   // rosso se sbagliata
                                }
                            } else if (ans === selectedAnswer) {
                                btnClass = "bg-primary text-white"; // evidenzia selezione prima della conferma
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => onSelect(ans)}
                                    className={btnClass}
                                >
                                    {decodeHtml(ans)}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default QuestionCard;