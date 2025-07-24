
import React, { useState, useEffect } from "react";

const API_URL = "https://btbsporttips.co.uk/api";


function App() {
  const [tips, setTips] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [matchInput, setMatchInput] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const fetchTips = async () => {
    const res = await fetch(`${API_URL}/tips`);
    const data = await res.json();
    setTips(data);
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const login = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      alert("Logged in!");
      fetchTips();
    } else {
      alert("Login failed");
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setPrediction(null);
    setConfidence(null);
  };

  const getPrediction = async () => {
    if (!matchInput) return alert("Enter a match");
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ match: matchInput }),
    });
    const data = await res.json();
    if (data.prediction) {
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      // Optionally reload tips
      fetchTips();
    } else {
      alert("Prediction failed");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>AI Sports Prediction Tips</h1>
      {!token ? (
        <div>
          <h2>Login</h2>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>

          <h2>Get AI Prediction</h2>
          <input
            placeholder="Match e.g. TeamA vs TeamB"
            value={matchInput}
            onChange={(e) => setMatchInput(e.target.value)}
          />
          <button onClick={getPrediction}>Predict</button>
          {prediction && (
            <div>
              <h3>Prediction: {prediction}</h3>
              <p>Confidence: {(confidence * 100).toFixed(0)}%</p>
            </div>
          )}

          <h2>Latest Tips</h2>
          {tips.length === 0 && <p>No tips yet</p>}
          <ul>
            {tips.map((tip) => (
              <li key={tip._id}>
                <strong>{tip.match}</strong>: {tip.prediction} (
                {(tip.confidence * 100).toFixed(0)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
