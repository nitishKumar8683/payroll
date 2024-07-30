"use client";
import React, { useEffect, useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from 'axios';
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

    return (
        <>
            <DefaultLayout>
                <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-8">
                    <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">

                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Task List</h1>
                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <div className="flex items-center justify-center p-4 bg-gray-200 text-gray-700 rounded-lg shadow-md">
                                    <span className="text-lg font-semibold">No Tasks Available</span>
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md cursor-pointer"
                                        onClick={() => openModal(task)}
                                    >
                                        <div className="text-lg font-semibold">{task.taskName}</div>
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full ${task.status === 'Completed'
                                                ? 'bg-green-500'
                                                : task.status === 'In Progress'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red'
                                                }`}
                                        >
                                            {task.status || 'Pending'}
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
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Task Details</h2>
                    <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
                        <p className="mb-2 text-lg"><strong className="font-semibold">Task Name: </strong> {selectedTask.taskName}</p>
                        <p className="mb-2 text-lg"><strong className="font-semibold">Description: </strong> {selectedTask.taskDescription}</p>
                        <p className="mb-2 text-lg"><strong className="font-semibold">Due Date: </strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                        <p className="mb-2 text-lg"><strong className="font-semibold">Assigned To: </strong> {selectedTask.userDetails.name} ({selectedTask.userDetails.email})</p>

                        <div className="mt-4 flex space-x-4">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                //onClick={() => handleStatusChange('completed')}
                            >
                                Mark as Completed
                            </button>
                            <button
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                //onClick={() => handleStatusChange('inProgress')}
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
