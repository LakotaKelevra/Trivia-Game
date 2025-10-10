import { useEffect, useState } from "react";

function useOpenTrivia(userName, category, level, numberOfQuestions, token, gameSessionId) {
    const [trivia, setTrivia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // console.log(userName, category, level, numberOfQuestions, token);


    useEffect(() => {
        const params = new URLSearchParams({
            amount: numberOfQuestions
        });

        if (category !== "0") {
            params.append('category', category);
        }

        if (level !== "0") {
            params.append('difficulty', level.toLowerCase());
        }

        if (token) {
            params.append('token', token);
        }

        const url = `https://opentdb.com/api.php?${params.toString()}`;
        const now = new Date();
        // console.log(`[OpenTrivia Fetch] ${now.toISOString()} - Fetching:`, url);

        fetch(url)
            .then(response => {
                // console.log(`[OpenTrivia Fetch] ${new Date().toISOString()} - Response status:`, response.status);
                return response.json();
            })
            .then(data => setTrivia(data.results))
            .catch(error => {
                // console.log(`[OpenTrivia Fetch] ${new Date().toISOString()} - Error:`, error);
                setError(error);
            })
            .finally(() => setLoading(false));
    }, [category, level, numberOfQuestions, token, gameSessionId]);

    // console.log(trivia);
    
    return { trivia, loading, error };
}

export default useOpenTrivia;