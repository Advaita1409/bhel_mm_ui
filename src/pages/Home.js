import React from "react";
import "../styles/pages.css";

function Home() {
    return (
        <div>
            <h1>Welcome to Materials Management</h1>
            <p className="subtitle">
                A simple, modern workspace for monitoring procurement and inventory flows.
            </p>

            <div className="cards">
                <div className="card">
                    <h3>PI to PO Monitoring</h3>
                    <p>Track progress from proforma invoices to purchase orders.</p>
                    <button>Open</button>
                </div>

                <div className="card">
                    <h3>Material Follow-up</h3>
                    <p>Stay on top of incoming materials and statuses.</p>
                    <button>Open</button>
                </div>

                <div className="card">
                    <h3>Inventory Management</h3>
                    <p>View stock levels and streamline inventory decisions.</p>
                    <button>Open</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
