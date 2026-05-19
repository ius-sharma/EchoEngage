/**
 * Navbar - Top navigation bar with branding and user menu
 */
import { Sprout, Radio } from 'lucide-react';

export default function Navbar({ seeded, onSeedMemories }) {
  return (
    <nav className="navbar-container">
      {/* Navbar Content */}
      <div className="navbar-content">
        {/* Left: Brand + Logo */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            <div className="logo-icon">E</div>
            <div>
              <h1 className="logo-text">EchoEngage</h1>
              <p className="logo-subtitle">Creator Memory Agent</p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions">
          {/* Seed Button */}
          {!seeded && (
            <button
              className="btn-seed"
              onClick={onSeedMemories}
            >
              <Sprout size={18} />
              <span>Seed Memories</span>
            </button>
          )}
          {seeded && (
            <span className="seed-status">
              <span className="status-dot"></span>
              Seeded
            </span>
          )}

          {/* Live Indicator */}
          <div className="live-indicator">
            <Radio size={16} className="live-dot-icon" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
