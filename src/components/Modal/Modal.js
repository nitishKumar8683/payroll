import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveRequestModal = ({ isOpen, closeModal, userId }) => {
  const [leave, setLeave] = useState({
    leaveType: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevLeave) => ({ ...prevLeave, [name]: value }));
  };

  const leaveRequest = async (e) => {
    e.preventDefault();
    console.log("Leave Request Data:", leave);

    if (
      !leave.leaveType ||
      !leave.startTime ||
      !leave.endTime ||
      !leave.reason
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    const startTime = new Date(leave.startTime);
    const endTime = new Date(leave.endTime);

    if (endTime <= startTime) {
      toast.error("End Time must be greather than Start Time.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/attendence/leaveApply/${userId}`,
        leave,
      );
      console.log("Response from Server:", response);
      toast.success(response.data.message);
      setTimeout(() => {
        setLeave({
          leaveType: "",
          startTime: "",
          endTime: "",
          reason: "",
        });
        closeModal();
      }, 3000);
    } catch (error) {
      console.error("Error sending leave request:", error);
      toast.error("Failed to submit leave request. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 mt-20 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white p-8 shadow-lg">
          <button
            className="text-gray-500 hover:text-gray-700 absolute right-4 top-4 text-2xl"
            onClick={closeModal}
          >
            &times;
          </button>
          <h2 className="text-gray-900 mb-6 text-2xl font-semibold">
            Leave Request Form
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="leaveType"
                className="text-gray-700 block text-sm font-medium"
              >
                Leave Type:
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={leave.leaveType}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">Select Leave Type</option>
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="wfh">Work From Home</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="startTime"
                className="text-gray-700 block text-sm font-medium"
              >
                Start Time:
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={leave.startTime}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="text-gray-700 block text-sm font-medium"
              >
                End Time:
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={leave.endTime}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="reason"
                className="text-gray-700 block text-sm font-medium"
              >
                Reason:
              </label>
              <textarea
                id="reason"
                name="reason"
                rows="4"
                value={leave.reason}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={leaveRequest}
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveRequestModal;
