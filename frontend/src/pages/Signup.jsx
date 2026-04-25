import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();


  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await API.post("/auth/signup", form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
        >
          Signup
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}