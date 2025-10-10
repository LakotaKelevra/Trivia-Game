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
    const shuffledAnswers = useMemo(() => shuffle(answers), [question, currentIndex, gameSessionId]);
    const timeLeft = useCountdown(15, started, () => onSelect(null), currentIndex);

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
            
        >
            
                <div className="card-body bg-[var(--peach)] text-[var(--purpledark)]">
                    <h2 className="card-title text-xl">
                        {decodeHtml(question)}
                    </h2>
                    <div className="flex flex-col gap-3">
                        <p className="text-lg">Time left: <span className="countdown">
                            <span style={{ "--value": timeLeft-1 }} aria-live="polite">{timeLeft-1}</span>
                        </span>s</p>
                        {shuffledAnswers.map((ans, i) => {
                            let btnClass = "btn btn-outline w-full whitespace-normal break-words py-3 min-h-[3rem]";

                            if (answered) {
                                if (ans === correctAnswer) {
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
    );
}

export default QuestionCard;