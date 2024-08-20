"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Modal from "@/components/Modal/TaskModal";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWorkTimeModalOpen, setIsWorkTimeModalOpen] = useState(false);
    const [workDuration, setWorkDuration] = useState(0);
    const [workLogs, setWorkLogs] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("/api/task/getassignTask");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };

        fetchTasks();
    }, []);

    const handleUpdateWorkDuration = async () => {
        if (!selectedTask || workDuration <= 0) return;

        try {
            const response = await axios.post("/api/task/workOnTask", {
                taskId: selectedTask._id,
                workDuration: parseFloat(workDuration), 
            });

            if (response.status === 200) {
                setTasks(
                    tasks.map((task) =>
                        task._id === selectedTask._id
                            ? { ...task, workDuration: response.data.workLog.workDuration } // Store in hours
                            : task,
                    ),
                );
                closeModal();
            } else {
                console.error("Failed to save work duration:", response.data);
            }
        } catch (error) {
            console.error("Error saving work duration:", error);
        }
    };

    const fetchWorkLogs = async () => {
        try {
            const response = await axios.get("/api/task/getWorkOnTask", { withCredentials: true });
            if (response.status === 200) {
                setWorkLogs(response.data);
            } else {
                console.error("Failed to fetch work logs:", response.data);
            }
        } catch (error) {
            console.error("Error fetching work logs:", error);
        }
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const openWorkTimeModal = async () => {
        await fetchWorkLogs();
        setIsWorkTimeModalOpen(true);
    };

    const closeWorkTimeModal = () => {
        setIsWorkTimeModalOpen(false);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedTask) return;
        const validStatuses = ["pending", "inprogress", "completed"];
        if (!validStatuses.includes(newStatus)) {
            console.error("Invalid status value");
            return;
        }

        try {
            const response = await axios.put("/api/task/updateTaskStatus", {
                taskId: selectedTask._id,
                newStatus,
            });

            if (response.status === 200) {
                setTasks(
                    tasks.map((task) =>
                        task._id === selectedTask._id
                            ? { ...task, status: newStatus }
                            : task,
                    ),
                );
                closeModal();
            } else {
                console.error("Failed to update task status:", response.data);
            }
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const groupLogsByDate = (logs) => {
        return logs.reduce((acc, log) => {
            const date = new Date(log.createdAt).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            if (!acc[date]) {
                acc[date] = { logs: [], totalHours: 0 };
            }
            acc[date].logs.push(log);
            acc[date].totalHours += log.workDuration;
            return acc;
        }, {});
    };



    return (
        <>
            <DefaultLayout>
                <button
                    onClick={openWorkTimeModal}
                    className="mb-4 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    Work Time
                </button>
                <div className="bg-gray-100 flex min-h-screen items-start justify-center pt-8">
                    <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
                        <h1 className="text-gray-800 mb-6 text-3xl font-bold">Project Task List</h1>
                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <div className="bg-gray-200 text-gray-700 flex items-center justify-center rounded-lg p-4 shadow-md">
                                    <span className="text-lg font-semibold">
                                        No Tasks Available
                                    </span>
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex cursor-pointer items-center justify-between rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white shadow-md"
                                        onClick={() => openModal(task)}
                                    >
                                        <div className="text-lg font-semibold">{task.taskName}</div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${task.status === "completed"
                                                ? "bg-green-500"
                                                : task.status === "inprogress"
                                                    ? "bg-yellow-500"
                                                    : "bg-red"
                                                }`}
                                        >
                                            {task.status.charAt(0).toUpperCase() +
                                                task.status.slice(1) || "Pending"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DefaultLayout>

            {isModalOpen && selectedTask && (
                <Modal onClose={closeModal}>
                    <div className="p-6 mt-5">
                        <h2 className="text-gray-800 mb-4 border-b pb-2 text-2xl font-bold">
                            Task Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center text-lg">
                                <strong className="font-semibold text-gray-700 w-36">Task Name:</strong>
                                <span className="text-gray-900">{selectedTask.taskName}</span>
                            </div>
                            <div className="flex items-center text-lg">
                                <strong className="font-semibold text-gray-700 w-36">Description:</strong>
                                <p className="text-gray-900 ml-2">{selectedTask.taskDescription}</p>
                            </div>
                            <div className="flex items-center text-lg">
                                <strong className="font-semibold text-gray-700 w-36">Due Date:</strong>
                                <span className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-lg">
                                <strong className="font-semibold text-gray-700 w-36">Completed Date:</strong>
                                <span className="text-gray-900 ml-2">
                                    {selectedTask.completedAt
                                        ? new Date(selectedTask.completedAt).toLocaleDateString()
                                        : "Not completed yet"}
                                </span>
                            </div>
                            <div className="flex items-center text-lg space-x-4">
                                <strong className="font-semibold text-gray-700 w-36">Work Duration (hours):</strong>
                                <input
                                    type="number"
                                    value={workDuration}
                                    onChange={(e) => setWorkDuration(e.target.value)}
                                    className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-md shadow-sm p-2 w-32 text-gray-900"
                                    placeholder="0"
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                onClick={handleUpdateWorkDuration}
                            >
                                Save Work Duration
                            </button>
                            <button
                                className="rounded-lg bg-red px-6 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isWorkTimeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6 relative mr-10">
                        <h2 className="text-lg font-semibold text-orange-500 mb-4">Work Time Logs</h2>

                        {/* Container for grouping logs by date */}
                        <div className="space-y-4">
                            {Object.entries(groupLogsByDate(workLogs)).map(([date, { logs, totalHours }]) => (
                                <div key={date} className="border rounded-lg mb-4">
                                    <div className="bg-gray-200 p-4 font-semibold text-lg text-gray-700 flex justify-between">
                                        <span>{new Date(date).toLocaleDateString()}</span>
                                        <span className="text-gray-900 font-medium">{totalHours.toFixed(2)} hours</span>
                                    </div>
                                    <table className="w-full border-collapse">
                                        <thead className="bg-black text-white">
                                            <tr>
                                                <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Task Name</th>
                                                <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Working Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log) => (
                                                <tr key={log._id} className="border-b border-gray-200">
                                                    <td className="py-2 px-4 text-md text-gray-800">{log.task.taskName || "N/A"}</td>
                                                    <td className="py-2 px-4 text-md text-gray-800">{(log.workDuration).toFixed(2)} hours</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>

                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeWorkTimeModal}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}


        </>
    );
};

export default TaskList;
