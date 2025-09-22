import { useState, useEffect } from "react";

const LS_KEY = "trivia_ranking";

function useRanking() {
    const [ranking, setRanking] = useState([
        { token: 'abc123', name: 'Player1', score: 4, totalQuestions: 5, avg: 0.8 },
        { token: 'def456', name: 'Player2', score: 3, totalQuestions: 5, avg: 0.6 },
        { token: 'ghi789', name: 'Player3', score: 5, totalQuestions: 5, avg: 1.0 }
    ]);

    // Carica la classifica da localStorage all'inizio
    useEffect(() => {
        const chart = localStorage.getItem(LS_KEY);
        if (chart) {
            try {
                setRanking(JSON.parse(chart));
            } catch { }
        }
    }, []);

    // Aggiungi un nuovo risultato
    function addRecord(token, name, score, totalQuestions) {
        const avg = parseFloat((score / totalQuestions).toFixed(2));
        const displayAvg = Math.round(avg * 100); // 0.73 → 73

        // filtra eventuali record con lo stesso token
        const filtered = ranking.filter(r => r.token !== token);

        const newEntry = { token, name, score, totalQuestions, avg, displayAvg };
        const updated = [...filtered, newEntry];
        setRanking(updated.sort((a, b) => b.avg - a.avg)); 
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
        console.log("Added record", newEntry, "Updated ranking:", updated);
        
    }
    return { ranking, addRecord };
}

export default useRanking;
