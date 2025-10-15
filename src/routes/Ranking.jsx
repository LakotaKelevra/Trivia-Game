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
    const ranking = useRanking().ranking;
    return (
        <div className="container mx-auto px-2 w-full overflow-x-auto">
            <h1 className="text-3xl font-extrabold mb-6 tracking-wide text-center ">Ranking</h1>
            <div className="block sm:w-full md:w-1/2 px-2 mx-auto">
                <table className="min-w-full table-auto border-separate border-spacing-y-4 rounded-3xl overflow-hidden mx-auto">
                    <thead>
                        <tr className="bg-[var(--peach)] rounded-3xl text-[var(--purpledark)] ">
                            <th className="px-2 py-3 text-left font-semibold rounded-l-full ">#</th>
                            <th className="px-2 py-3 text-left font-semibold max-w-[120px] truncate">Name</th>
                            <th className="px-2 py-3 text-center font-semibold">Score</th>
                            <th className="px-2 py-3 text-center font-semibold rounded-r-full">Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((row, idx) => (
                            <tr
                                key={row.name + idx}
                                className="bg-[var(--yellow)] rounded-3xl shadow-md hover:bg-[var(--peach)] transition"
                                style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
                            >
                                <td className="px-2 py-2 font-bold text-[var(--purpledark)] text-left rounded-l-3xl">{idx + 1}</td>
                                <td className="px-2 py-2 text-[var(--purpledark)] text-left truncate max-w-[120px]">{row.name}</td>
                                <td className="px-2 py-2 text-[var(--purpledark)] text-center">{row.displayAvg}</td>
                                <td className="px-2 py-2 text-[var(--purpledark)] text-center rounded-r-3xl">{row.totalQuestions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Ranking;