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
            <h1 className="text-3xl font-extrabold text-primary mb-6 drop-shadow-lg tracking-wide text-center">Ranking</h1>
            <div className="overflow-x-auto">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex items-center bg-base-200 text-base-content font-semibold rounded-lg px-4 py-3 mb-2">
                        <span className="w-8">#</span>
                        <span className="flex-1 pl-2">Name</span>
                        <span className="w-28 text-center">Avg. Score</span>
                        <span className="w-32 text-center">Total Questions</span>
                    </div>
                    {/* Righe dati */}
                    {useRanking().ranking.map((row, idx) => (
                        <div key={row.name} className="flex items-center bg-base-100 shadow-md rounded-lg my-2 px-4 py-3">
                            <span className="w-8 font-bold">{idx + 1}</span>
                            <span className="flex-1 pl-2">{row.name}</span>
                            <span className="w-28 text-center">{row.displayAvg}</span>
                    

                            <span className="w-32 text-center">{row.totalQuestions}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Ranking;