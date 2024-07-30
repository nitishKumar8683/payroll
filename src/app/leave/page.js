"use client";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";

const LeavePage = () => {
    const [leaves, setLeaves] = useState({
        pending: [],
        approved: [],
        rejected: [],
    });

    useEffect(() => {
        leaveApplyResponse();
    }, []);

    const leaveApplyResponse = async () => {
        try {
            const response = await axios.get("/api/attendence/getLeaveAppy/userId");
            const leavesData = response.data;

            const categorizedLeaves = {
                pending: leavesData.filter(
                    (leave) => !leave.isApproved && !leave.isRejected,
                ),
                approved: leavesData.filter((leave) => leave.isApproved),
                rejected: leavesData.filter((leave) => leave.isRejected),
            };

            setLeaves(categorizedLeaves);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        }
    };

    const handleAction = async (_id, action) => {
        try {
            const isApproved = action === "approve";
            const isRejected = action === "reject";

            const response = await axios.put(
                `/api/attendence/updateLeaveApply/${_id}`,
                {
                    isApproved,
                    isRejected,
                },
            );

            if (response.data.status) {
                alert(`Leave ID: ${_id}, Action: ${action}`);
                console.log(`Leave ID: ${_id}, Action: ${action}`);
                leaveApplyResponse();
            } else {
                alert(`Failed to update leave request. ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error handling action:", error);
            alert("An error occurred while updating the leave request.");
        }
    };

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        const date = new Date(dateTimeString);
        return date.toLocaleString(undefined, options);
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffInMs = end - start;
        const diffInMinutes = Math.round(diffInMs / (1000 * 60));
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        return `${hours} hours ${minutes} minutes`;
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <h1 className="text-gray-800 mb-6 text-3xl font-bold">
                    Leave Requests
                </h1>
                <div>
                    {leaves.pending.length === 0 ? (
                        <h2 className="mb-6 mt-10 text-2xl font-semibold text-blue-800">
                            No Pending Requests
                        </h2>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {leaves.pending.map((leave) => (
                                <div
                                    key={leave._id}
                                    className="group relative rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl"
                                >
                                    <div className="relative z-10 mb-4">
                                        <p className="text-gray-700 text-lg font-semibold">
                                            <strong>Name:</strong> {leave.userDetails.name}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <strong>Leave Type:</strong> {leave.leaveType}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <strong>Reason:</strong> {leave.reason}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <strong>Start Time:</strong>{" "}
                                            {formatDateTime(leave.startTime)}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <strong>End Time:</strong>{" "}
                                            {formatDateTime(leave.endTime)}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <strong>Total Time:</strong>{" "}
                                            {calculateDuration(leave.startTime, leave.endTime)}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white bg-opacity-80 p-4 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleAction(leave._id, "approve")}
                                                className="z-30 transform rounded-lg bg-green-500 px-6 py-3 text-white shadow-md transition-transform hover:scale-105 hover:bg-green-600 focus:outline-none"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(leave._id, "reject")}
                                                className="z-30 transform rounded-lg bg-red px-6 py-3 text-white shadow-md transition-transform hover:scale-105 hover:bg-red focus:outline-none"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <h2 className="text-gray-800 mb-6 mt-10 text-2xl font-semibold">
                    Approved Requests
                </h2>
                <table className="mb-8 w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
                    <thead className="bg-gray-100 border-gray-300 border-b-2">
                        <tr>
                            <th className="text-gray-700 border p-4 text-left">Name</th>
                            <th className="text-gray-700 border p-4 text-left">
                                Leave Type
                            </th>
                            <th className="text-gray-700 border p-4 text-left">
                                Total Time
                            </th>
                            <th className="text-gray-700 border p-4 text-left">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.approved.map((leave) => (
                            <tr key={leave._id} className="hover:bg-gray-50">
                                <td className="text-gray-600 border p-4">
                                    {leave.userDetails.name}
                                </td>
                                <td className="text-gray-600 border p-4">
                                    {leave.leaveType}
                                </td>
                                <td className="text-gray-600 border p-4">
                                    {calculateDuration(leave.startTime, leave.endTime)}
                                </td>
                                <td className="text-gray-600 border p-4">{leave.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className="text-gray-800 mb-6 text-2xl font-semibold">
                    Rejected Requests
                </h2>
                <table className="w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
                    <thead className="bg-gray-100 border-gray-300 border-b-2">
                        <tr>
                            <th className="text-gray-700 border p-4 text-left">Name</th>
                            <th className="text-gray-700 border p-4 text-left">
                                Leave Type
                            </th>
                            <th className="text-gray-700 border p-4 text-left">
                                Total Time
                            </th>
                            <th className="text-gray-700 border p-4 text-left">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.rejected.map((leave) => (
                            <tr key={leave._id} className="hover:bg-gray-50">
                                <td className="text-gray-600 border p-4">
                                    {leave.userDetails.name}
                                </td>
                                <td className="text-gray-600 border p-4">
                                    {leave.leaveType}
                                </td>
                                <td className="text-gray-600 border p-4">
                                    {calculateDuration(leave.startTime, leave.endTime)}
                                </td>
                                <td className="text-gray-600 border p-4">{leave.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    );
};

export default LeavePage;
