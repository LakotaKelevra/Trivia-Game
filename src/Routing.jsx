import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './routes/Home'
import Layout from './layout/Layout'
import Quiz from './routes/Quiz'
import Ranking from './routes/Ranking'
import QuizPage from './routes/QuizPage'



function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/ranking" element={<Ranking />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Routing