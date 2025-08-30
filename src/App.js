import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/Home";
import PiToPo from "./pages/PitoPo";
import MaterialFollowUp from "./pages/MaterialFollowUp";
import SupplierPayment from "./pages/SupplierPayment";
import StockDetail from "./pages/StockDetail";
import Inventory from "./pages/Inventory";
import Mir from "./pages/Mir";
import Navbar from "./Navbar";

function App() {
  return (
      <Router>
        <Navbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pi-to-po" element={<PiToPo />} />
            <Route path="/material-followup" element={<MaterialFollowUp />} />
            <Route path="/supplier-payment" element={<SupplierPayment />} />
            <Route path="/stock-detail" element={<StockDetail />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/mir" element={<Mir />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
