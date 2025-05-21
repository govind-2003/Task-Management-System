import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Task Manager</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/tasks">Tasks</Link>
                </li>
                <li>
                    <Link to="/add-task">Add Task</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;