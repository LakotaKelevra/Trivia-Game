import { useEffect, useState } from "react";

function useCategories() {
    // const categories = [];
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://opentdb.com/api_category.php')
            .then(res => res.json())
            .then(data => setCategories(data.trivia_categories))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, []);


    return { categories, loading, error };
}

export default useCategories;