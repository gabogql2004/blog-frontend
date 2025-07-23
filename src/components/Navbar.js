import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">TaskManager</Link>
        <div className="ms-auto">
          <Link className="btn btn-outline-primary me-2" to="/">📋 Tasks</Link>
          <Link className="btn btn-primary" to="/add">➕ Add Task</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
