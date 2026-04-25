import { useEffect, useState } from "react";
import API from "../services/api";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // 🔹 Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      // ✅ Handle standard backend format
      setTasks(res.data.data || res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Add Task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await API.post("/tasks", { title });

      // ✅ Instant UI update (better UX)
      const newTask = res.data.data || res.data;
      setTasks((prev) => [...prev, newTask]);

      setTitle("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔹 Toggle Task Status
  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task.id}`, {
        status: task.status === "pending" ? "completed" : "pending",
      });

      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔹 Delete Task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tasks</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Add Task */}
        <div className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          />
          <Button onClick={addTask}>Add</Button>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No tasks yet. Add your first one 🚀
          </p>
        )}

        {/* Task List */}
        {Array.isArray(tasks) &&
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center hover:shadow-md transition mb-3"
            >
              {/* Left */}
              <div>
                <p
                  className={`font-medium ${
                    task.status === "completed" &&
                    "line-through text-gray-400"
                  }`}
                >
                  {task.title}
                </p>

                <span
                  className={`text-sm ${
                    task.status === "completed"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              {/* Right */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(task)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                  {task.status === "pending" ? "Mark Done" : "Undo"}
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}