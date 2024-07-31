"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Modal from "@/components/Modal/TaskModal";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
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

    return (
        <>
            <DefaultLayout>
                <div className="bg-gray-100 flex min-h-screen items-start justify-center pt-8">
                    <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
                        <h1 className="text-gray-800 mb-6 text-3xl font-bold">Task List</h1>
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
                    <h2 className="text-gray-800 mb-4 border-b pb-2 text-2xl font-bold">
                        Task Details
                    </h2>
                    <div className="mt-4 rounded-lg border bg-white p-4 shadow-lg">
                        <p className="mb-2 text-lg">
                            <strong className="font-semibold">Task Name: </strong>{" "}
                            {selectedTask.taskName}
                        </p>
                        <p className="mb-2 text-lg">
                            <strong className="font-semibold">Description: </strong>{" "}
                            {selectedTask.taskDescription}
                        </p>
                        <p className="mb-2 text-lg">
                            <strong className="font-semibold">Due Date: </strong>{" "}
                            {new Date(selectedTask.dueDate).toLocaleDateString()}
                        </p>
                        <p className="mb-2 text-lg">
                            <strong className="font-semibold">Assigned To: </strong>{" "}
                            {selectedTask.userDetails.name} ({selectedTask.userDetails.email})
                        </p>
                        <p className="mb-2 text-lg">
                            <strong className="font-semibold">Completed Date: </strong>{" "}
                            {selectedTask.completedAt
                                ? new Date(selectedTask.completedAt).toLocaleDateString()
                                : "Not completed yet"}
                        </p>
                        <div className="mt-4 flex space-x-4">
                            <button
                                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                onClick={() => handleStatusChange("completed")}
                            >
                                Mark as Completed
                            </button>
                            <button
                                className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                onClick={() => handleStatusChange("inprogress")}
                            >
                                Mark as In Progress
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default TaskList;
