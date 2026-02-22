import { useState } from "react";

export default function Login({ setUserData }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone.trim()) {
      alert("Enter your phone number");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to send OTP");
        return;
      }

      setStep(2);

    } catch (err) {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Invalid OTP");
        return;
      }

      setUserData(data);

    } catch (err) {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Social Saver Login
        </h1>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter WhatsApp number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              OTP sent to {phone}
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}