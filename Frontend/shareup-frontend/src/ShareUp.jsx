import React from "react";

import { useState } from "react";
import "./ShareUp.css";

export default function ShareUp() {
  const [page, setPage] = useState("welcome");
  const [history, setHistory] = useState([]);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [items, setItems] = useState([
    { id: 1, name: "Drill Machine", category: "Tools", price: 200, requested: false },
    { id: 2, name: "DSLR Camera", category: "Electronics", price: 500, requested: false },
    { id: 3, name: "Camping Tent", category: "Travel", price: 300, requested: false }
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: ""
  });

  /* ---------- Navigation helpers ---------- */

  function navigate(nextPage) {
    setHistory(h => [...h, page]);
    setPage(nextPage);
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setPage(prev);
  }

  function logout() {
    setPage("welcome");
    setHistory([]);
    setRole(null);
    setEmail("");
    setPassword("");
  }

  /* ---------- Auth ---------- */

  function login() {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }
    navigate(role === "borrower" ? "borrower" : "owner");
  }

  /* ---------- Borrower ---------- */

  function borrowItem(id) {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, requested: true } : item
      )
    );
  }

  /* ---------- Owner ---------- */

  function addItem() {
    if (!newItem.name || !newItem.category || !newItem.price) {
      alert("Fill all fields");
      return;
    }

    setItems(items => [
      ...items,
      {
        id: Date.now(),
        name: newItem.name,
        category: newItem.category,
        price: Number(newItem.price),
        requested: false
      }
    ]);

    setNewItem({ name: "", category: "", price: "" });
  }

  function updatePrice(id, price) {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, price: Number(price) } : item
      )
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="app-container">

      {/* WELCOME */}
      {page === "welcome" && (
        <div className="center-card">
          <h1 className="logo">ShareUp</h1>
          <p className="tagline">Share more. Own less.</p>

          <div className="button-row">
            <button
              className="primary"
              onClick={() => {
                setRole("owner");
                navigate("login");
              }}
            >
              Owner
            </button>

            <button
              className="secondary"
              onClick={() => {
                setRole("borrower");
                navigate("login");
              }}
            >
              Borrower
            </button>
          </div>
        </div>
      )}

      {/* LOGIN */}
      {page === "login" && (
        <div className="center-card">
          <button className="back-btn" onClick={goBack}>← Back</button>

          <h2>Login</h2>

          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="primary full" onClick={login}>
            Login
          </button>
        </div>
      )}

      {/* BORROWER */}
      {page === "borrower" && (
        <>
          <header className="top-bar">
            <div>
              <button className="back-btn" onClick={goBack}>← Back</button>
              <h2>Available Items</h2>
            </div>
            <button className="danger" onClick={logout}>Logout</button>
          </header>

          <div className="grid">
            {items.map(item => (
              <div className="card" key={item.id}>
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>
                <p className="price">₹{item.price} / day</p>

                <button
                  className="primary full"
                  disabled={item.requested}
                  onClick={() => borrowItem(item.id)}
                >
                  {item.requested ? "Requested" : "Borrow"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* OWNER */}
      {page === "owner" && (
        <>
          <header className="top-bar">
            <div>
              <button className="back-btn" onClick={goBack}>← Back</button>
              <h2>My Items</h2>
            </div>
            <button className="danger" onClick={logout}>Logout</button>
          </header>

          <div className="card add-card">
            <h3>Add New Item</h3>

            <input
              className="input"
              placeholder="Item name"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            />

            <input
              className="input"
              placeholder="Category"
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
            />

            <input
              className="input"
              type="number"
              placeholder="Price per day"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })}
            />

            <button className="secondary full" onClick={addItem}>
              Add Item
            </button>
          </div>

          <div className="grid">
            {items.map(item => (
              <div className="card" key={item.id}>
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>

                <input
                  className="input"
                  type="number"
                  defaultValue={item.price}
                  onBlur={e => updatePrice(item.id, e.target.value)}
                />

                <p className="muted">Edit price & click outside</p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
