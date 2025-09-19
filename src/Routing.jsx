import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './routes/Home'
import Layout from './layout/Layout'
import Quiz from './routes/Quiz'



function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/quiz" element={<Quiz />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Routing