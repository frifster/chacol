import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Community from './pages/Community'
import Events from './pages/Events'
import Game from './pages/Game'
import Gameplay from './pages/Gameplay'
import Graphics from './pages/Graphics'
import Home from './pages/Home'
import Merchandise from './pages/Merchandise'
import News from './pages/News'
import Support from './pages/Support'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gameplay" element={<Gameplay />} />
          <Route path="/graphics" element={<Graphics />} />
          <Route path="/community" element={<Community />} />
          <Route path="/news" element={<News />} />
          <Route path="/support" element={<Support />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/events" element={<Events />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App 