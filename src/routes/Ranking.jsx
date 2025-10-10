import { use } from "react";
import useRanking from "../hooks/useRanking";

const mockRanking = [
    { name: "Alice", avgScore: 8.5, totalQuestions: 60 },
    { name: "Bob", avgScore: 7.2, totalQuestions: 45 },
    { name: "Charlie", avgScore: 6.8, totalQuestions: 30 },
    { name: "Diana", avgScore: 9.1, totalQuestions: 80 },
    { name: "Eve", avgScore: 7.9, totalQuestions: 55 },
];



function Ranking() {
    return (
        <div className="container mx-auto p-4 max-w-full overflow-x-auto">
            {console.log(useRanking().ranking)}
            <h1 className="text-3xl font-extrabold mb-6 drop-shadow-lg tracking-wide text-center">Ranking</h1>
            <div className="overflow-x-auto">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex items-center bg-[var(--purpledark)] text-base-content font-semibold rounded-lg px-4 py-3 mb-2">
                        <span className="w-8"><h3>#</h3></span>
                        <span className="flex-1 pl-2"><h3>Name</h3></span>
                        <span className="w-28 text-center"><h3>Avg. Score</h3></span>
                        <span className="w-40 text-center"><h3>Total Questions</h3></span>
                    </div>
                    {/* Righe dati */}
                    {useRanking().ranking.map((row, idx) => (
                        <div key={row.name + idx} className="flex items-center bg-[var(--blue)] shadow-md rounded-lg my-2 px-4 py-3">
                            <span className="w-8 font-bold"><h3>{idx + 1}</h3></span>
                            <span className="flex-1 pl-2"><h2>{row.name}</h2></span>
                            <span className="w-28 text-center"><h3>{row.displayAvg}</h3></span>
                    

                            <span className="w-40 text-center"><h3>{row.totalQuestions}</h3></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Ranking;