import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-dungeon-light py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-medieval text-dungeon-accent">
            Chacol
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/gameplay" className="nav-link">Gameplay</Link>
            <Link to="/graphics" className="nav-link">Graphics</Link>
            <Link to="/community" className="nav-link">Community</Link>
            <Link to="/news" className="nav-link">News</Link>
            <Link to="/support" className="nav-link">Support</Link>
            <Link to="/download" className="nav-link">Download</Link>
            <Link to="/merchandise" className="nav-link">Merchandise</Link>
            <Link to="/events" className="nav-link">Events</Link>
          </div>
          
          <button className="md:hidden text-dungeon-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 