import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Generator from './pages/Generator'
import Header from './components/Header'
import './style.css'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Generator />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App