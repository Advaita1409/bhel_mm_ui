import React from "react";
import { NavLink } from "react-router-dom";
import "./styles/layout.css";
import avatar from "./assets/avatar.jpeg";
import logo from "./assets/logo.png";

function Navbar() {
    return (
        <header className="navbar">
            {/* Top header */}
            <div className="navbar-top">
                <img src={logo} alt={"logo"} className="logo"/>
                <h1 className="app-title">Department: Materials Management</h1>
                <div className="user-info">
                    <span className="user-name">User</span>
                    <img src={avatar} alt="User Avatar" className="avatar" />
                </div>
            </div>

            {/* Bottom navigation tabs */}
            <nav className="nav-tabs">
                <NavLink to="/" end className="tab">Home</NavLink>
                <NavLink to="/pi-to-po" className="tab">PI to PO Monitoring</NavLink>
                <NavLink to="/material-followup" className="tab">Material Follow-up</NavLink>
                <NavLink to="/supplier-payment" className="tab">Supplier Payment Monitoring</NavLink>
                <NavLink to="/stock-detail" className="tab">Material Stock Detail</NavLink>
                <NavLink to="/inventory" className="tab">Inventory Management</NavLink>
                <NavLink to="/mir" className="tab">MIR</NavLink>
            </nav>
        </header>
    );
}

export default Navbar;
