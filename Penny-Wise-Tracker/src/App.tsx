import { useState } from "react";
import { ExpenseProvider } from "./store/expenseStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import Transactions from "./Components/Transactions";
import AddTransactionDialog from "./Components/AddTransactionDialog";
import "./App.css";

function AppContent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Header onAdd={() => setOpen(true)} />
      <main className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard onAdd={() => setOpen(true)} />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
      <AddTransactionDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
function App() {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ExpenseProvider>
  );
}

export default App;
