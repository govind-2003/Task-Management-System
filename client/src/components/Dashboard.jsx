import React, { useState } from "react";

const initialTasks = [
    { id: 1, title: "Design UI", status: "In Progress" },
    { id: 2, title: "Set up backend", status: "Pending" },
    { id: 3, title: "Write documentation", status: "Completed" },
];

const statusColors = {
    "Pending": "#fbbf24",
    "In Progress": "#3b82f6",
    "Completed": "#10b981",
};

function Dashboard() {
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState("");

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([
            ...tasks,
            { id: Date.now(), title: newTask, status: "Pending" },
        ]);
        setNewTask("");
    };

    const handleStatusChange = (id, status) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status } : task
        ));
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
            <h1>Task Management Dashboard</h1>
            <form onSubmit={handleAddTask} style={{ marginBottom: 24 }}>
                <input
                    type="text"
                    placeholder="Add new task..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    style={{ padding: 8, width: "70%" }}
                />
                <button type="submit" style={{ padding: 8, marginLeft: 8 }}>Add</button>
            </form>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Task</th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Status</th>
                        <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td style={{ padding: 8 }}>{task.title}</td>
                            <td style={{ padding: 8 }}>
                                <span style={{
                                    background: statusColors[task.status],
                                    color: "#fff",
                                    borderRadius: 4,
                                    padding: "2px 8px",
                                    fontSize: 14
                                }}>
                                    {task.status}
                                </span>
                            </td>
                            <td style={{ padding: 8 }}>
                                <select
                                    value={task.status}
                                    onChange={e => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option>Pending</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;