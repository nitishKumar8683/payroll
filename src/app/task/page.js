"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/Modal/TaskStatusTable";

const TaskAssignmentForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const [selectedUser, setSelectedUser] = useState("");
    const [userData, setUserData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        userDetail();
    }, []);

    const modalOpen = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/api/task/assignTask", data);
            console.log(response);
            if (response.data.success) {
                toast.success("Task assigned successfully!");
                reset()
            } else {
                toast.error("Failed to assign task.");
            }
        } catch (error) {
            console.error("Error assigning task:", error);
            toast.error("Error assigning task.");
        }
    };

    const userDetail = async () => {
        try {
            const response = await axios.get("/api/users/getUser");
            const data = response.data.usersData;
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <DefaultLayout>
            <ToastContainer />
            <div className="p-4">
                <div className="flex justify-end">
                    <button
                        onClick={modalOpen}
                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Task Status
                    </button>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="modal-container mx-auto p-4 rounded-lg bg-white shadow-md">
                            <Modal onClose={closeModal} />
                        </div>
                    </div>
                )}
            </div>

            <div className="to-red mt-5 mx-auto w-full max-w-3xl rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 p-6 shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-white">Assign Task</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 rounded-lg bg-white p-6 shadow-md"
                >
                    <div>
                        <label
                            className="text-gray-700 mb-2 block font-medium"
                            htmlFor="taskName"
                        >
                            Task Name
                        </label>
                        <input
                            id="taskName"
                            type="text"
                            {...register("taskName", { required: "Task Name is required" })}
                            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.taskName && (
                            <p className="text-red-500 mt-1 text-sm">
                                {errors.taskName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="text-gray-700 mb-2 block font-medium"
                            htmlFor="taskDescription"
                        >
                            Task Description
                        </label>
                        <textarea
                            id="taskDescription"
                            {...register("taskDescription")}
                            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                        />
                    </div>

                    <div>
                        <label
                            className="text-gray-700 mb-2 block font-medium"
                            htmlFor="dueDate"
                        >
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            {...register("dueDate")}
                            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label
                            className="text-gray-700 mb-2 block font-medium"
                            htmlFor="bucketSelect"
                        >
                            Bucket or Project
                        </label>
                        <select
                            id="bucketSelect"
                            {...register("assignedBucket", {
                                required: "Bucket is required",
                            })}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select a Bucket</option>
                            <option value="WDD">
                                WDD
                            </option>
                            <option value="SEO">
                                SEO
                            </option>
                            <option value="SMO">
                                SMO
                            </option>
                            <option value="PAIDCAMPAIGN">
                                PAID CAMPAIGN
                            </option>
                            <option value="ADHOC">
                                ADHOC
                            </option>
                        </select>
                        {errors.assignedBucket && (
                            <p className="text-red-500 mt-1 text-sm">
                                {errors.assignedBucket.message}
                            </p>
                        )}
                    </div>

                    {/* <div>
                        <label
                            className="text-gray-700 mb-2 block font-medium"
                            htmlFor="userSelect"
                        >
                            Assign To
                        </label>
                        <select
                            id="userSelect"
                            {...register("assignedUser", {
                                required: "User selection is required",
                            })}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select a user</option>
                            {userData.map((user) => (
                                <option key={user.id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {errors.assignedUser && (
                            <p className="text-red-500 mt-1 text-sm">
                                {errors.assignedUser.message}
                            </p>
                        )}
                    </div> */}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Assign Task
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default TaskAssignmentForm;
