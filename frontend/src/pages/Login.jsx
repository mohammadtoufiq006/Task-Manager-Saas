import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await API.post("/auth/login", form);
      const token = res.data?.token;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <Button className="w-full">Login</Button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}