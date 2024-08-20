import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';

const TaskStatusTable = ({ onClose, children }) => {
    const modalRef = useRef(null);
    const [assignTask, setAssignTask] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(3);

    useEffect(() => {
        assignTaskData();

        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                event.target.closest('.modal-content') === null
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const assignTaskData = async () => {
        try {
            const response = await axios.get("/api/task/getAssignTaskAdmin");
            console.log(response.data);
            setAssignTask(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = assignTask.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-20">
            <div className="container mx-auto mt-4 p-4" ref={modalRef}>
                <div className="lg:ml-64">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-orange-500 mb-4">Task Status</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-black text-white">
                                            <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Task Name</th>
                                            <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Task Description</th>

                                       
                                            <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Due Date</th>
                                            <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Assigned Date</th>
                                            <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Completed Date</th>
                                            <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTasks.map(task => (
                                            <tr key={task._id} className="border-b border-r-emerald-800">
                                                <td className="py-2 px-4 text-md text-pink-800">{task.taskName}</td>
                                                <td className="py-2 px-4 text-md text-pink-800">{task.taskDescription}</td>

                                                <td className="py-2 px-4 text-md text-pink-800">{new Date(task.dueDate).toLocaleDateString()}</td>
                                                <td className="py-2 px-4 text-md text-pink-800">{task.createdAt ? format(new Date(task.createdAt), 'dd/MM/yyyy') : 'N/A'}</td>
                                                <td className="py-2 px-4 text-md text-pink-800">{task.completedAt
                                                    ? format(new Date(task.completedAt
                                                    ), 'dd/MM/yyyy') : 'Not completed yet'}</td>

                                                <td className="px-3 py-1 text-sm font-medium rounded-full">
                                                    <span className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${task.status === 'completed'
                                                        ? 'bg-green-500 text-white'
                                                        : task.status === 'inprogress'
                                                            ? 'bg-yellow-500 text-black'
                                                            : 'bg-red text-white'
                                                        }`}>
                                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1) || 'Pending'}
                                                    </span>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="mt-4 flex justify-center">
                                <ul className="flex">
                                    {Array.from({ length: Math.ceil(assignTask.length / tasksPerPage) }, (_, index) => (
                                        <li key={index}>
                                            <button
                                                className={`mx-1 px-3 py-1 rounded ${index + 1 === currentPage ? 'bg-black text-white' : 'bg-green-100'
                                                    }`}
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default TaskStatusTable;
