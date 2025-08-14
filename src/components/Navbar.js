import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

function Navbar() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className={`navbar navbar-expand-lg ${isDark ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow-sm py-3`}>
      <div className="container">
        <Link className={`navbar-brand fw-bold fs-4 ${isDark ? 'text-light' : 'text-primary'}`} to="/">TaskManager</Link>
        <div className="ms-auto d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary" onClick={toggle} aria-label="Toggle theme">
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Link className={`btn ${isDark ? 'btn-outline-light' : 'btn-outline-primary'} me-2`} to="/">📋 Tasks</Link>
          <Link className="btn btn-primary" to="/add">➕ Add Task</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
