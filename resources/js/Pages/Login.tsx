import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const API_URL = import.meta.env.VITE_API_URL as string;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_URL}/api/login`, {
        user_id: userId,
        password: password,
      });

      const userRes = await axios.get(`${API_URL}/api/user`);
      console.log("User:", userRes.data);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("ログインに失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>ログイン</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 16 }}>
          <label>ユーザーID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
