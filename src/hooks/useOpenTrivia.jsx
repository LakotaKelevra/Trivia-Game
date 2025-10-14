import { useEffect, useState } from "react";

function useOpenTrivia(userName, category, level, numberOfQuestions, token, gameSessionId, setReady) {
    const [trivia, setTrivia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // console.log(userName, category, level, numberOfQuestions, token);


    useEffect(() => {
        let didCancel = false;
        const fetchQuestions = async (retry = 0, delay = 1500) => {
            const params = new URLSearchParams({ amount: numberOfQuestions });
            if (category !== "0") params.append('category', category);
            if (level !== "0") params.append('difficulty', level.toLowerCase());
            if (token) params.append('token', token);
            const url = `https://opentdb.com/api.php?${params.toString()}`;

            try {
                const response = await fetch(url);
                if (response.status === 429) {
                    if (retry < 5) {
                        await new Promise(res => setTimeout(res, delay));
                        fetchQuestions(retry + 1, delay * 2);
                        return;
                    } else {
                        if (!didCancel) setError("Limite di richieste API raggiunto. Riprova più tardi.");
                        return;
                    }
                }
                const data = await response.json();
                if (!didCancel) {
                    setTrivia(data.results);
                    setError(null);
                }
            } catch (error) {
                if (!didCancel) setError(error);
            } finally {
                if (!didCancel) {
                    setLoading(false);
                    if (typeof setReady === 'function') setReady(true);
                }
            }
        };
        setLoading(true);
        setError(null);
        fetchQuestions();
        return () => { didCancel = true; };
    }, [category, level, numberOfQuestions, token, gameSessionId]);

    // console.log(trivia);
    
    return { trivia, loading, error };
}

export default useOpenTrivia;