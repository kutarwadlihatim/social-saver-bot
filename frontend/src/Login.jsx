import { useState } from "react";

export default function Login({ setUserData }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login clicked");
    console.log("Phone entered:", phone);

    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      setUserData(data);

    } catch (error) {
      console.error("Login error:", error);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl mb-6 font-bold">Login</h1>

      <input
        type="text"
        placeholder="Enter your WhatsApp number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-3 text-black rounded w-64"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}