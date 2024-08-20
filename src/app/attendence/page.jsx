"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/Modal/Modal";

const Attendence = () => {
  const [time, setTime] = useState(0);
  const [userId, setUserId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveDataStatus, setLeaveDataStatus] = useState([]);
  const [totalLeaveTaken, setTotalLeaveTaken] = useState(0);
  const [totalLeaveAllowed] = useState(20);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const result = await response.json();
        if (result.dataUser) {
          setUserId(result.dataUser._id);

          const attendanceResponse = await fetch(
            `/api/users/attendence-status/${result.dataUser._id}`,
          );
          if (attendanceResponse.ok) {
            const attendanceData = await attendanceResponse.json();
            if (attendanceData.isStarted) {
              setStartTime(attendanceData.startTime);
              setIsStarted(true);

              if (attendanceData.endTime) {
                setStartTime(null);
                setIsStarted(false);
                setTime(0);
              }
            } else {
              setStartTime(null);
              setIsStarted(false);
              setTime(0);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    leaveData();
  }, []);

  useEffect(() => {
    if (startTime && isStarted) {
      const startTimeDate = new Date(startTime);
      const id = setInterval(() => {
        const now = new Date();
        const elapsedTime = Math.max(
          0,
          Math.floor((now - startTimeDate) / 1000),
        );
        setTime(elapsedTime);
      }, 1000);
      setIntervalId(id);

      const eightHours = 8 * 60 * 60 * 1000;
      const notifyTimeout = setTimeout(
        () => {
          if (Notification.permission === "granted") {
            new Notification("Reminder", {
              body: "You have been working for 8 hours. Please take a break!",
              icon: "/images/brand/images.png",
            });
          }
        },
        eightHours - (new Date() - startTimeDate),
      );

      return () => {
        clearInterval(id);
        clearTimeout(notifyTimeout);
      };
    } else if (intervalId) {
      clearInterval(intervalId);
    }
  }, [startTime, isStarted]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const attendneceUser = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID is not available , Please try again");
      return;
    }

    if (isStarted) {
      toast.warning("Attendance already started today.");
      return;
    }

    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    const newStartTime = new Date().toISOString();

    try {
      const response = await axios.post(`/api/users/attendence/${userId}`, {
        startTime: newStartTime,
      });

      console.log(response);

      if (response.data.status) {
        setStartTime(newStartTime);
        setIsStarted(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error making request:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  const endAttendance = async () => {
    try {
      const response = await axios.post(`/api/users/end-attendance/${userId}`, {
        endTime: new Date().toISOString(),
      });
      console.log(response);
      setStartTime(null);
      setIsStarted(false);
      setTime(0);
      if (intervalId) {
        clearInterval(intervalId);
      }
      toast.success("Attendance ended successfully");
    } catch (error) {
      console.error("Error ending attendance:", error);
      toast.error("An error occurred while ending your attendance.");
    }
  };

  const modalOpen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(date)
      .toLocaleDateString(undefined, options)
      .replace(",", "");
  };

  const leaveData = async () => {
    try {
      const response = await axios.get(
        "/api/attendence/getLeaveAttendenceById",
      );
      console.log("Leave data response:", response.data);

      const leaveDataStatus = response.data;
      setLeaveDataStatus(leaveDataStatus);

      const totalLeave = leaveDataStatus.reduce((acc, leave) => {
        if (leave.isApproved) {
          return acc + 1;
        }
        return acc;
      }, 0);

      console.log("Total leave taken:", totalLeave);
      setTotalLeaveTaken(totalLeave);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const remainingLeave = totalLeaveAllowed - totalLeaveTaken;

  return (
    <DefaultLayout>
      <ToastContainer />
      <div className="p-4">
        <div className="flex justify-end">
          <button
            onClick={modalOpen}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Request
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Modal
              isOpen={isModalOpen}
              closeModal={closeModal}
              userId={userId}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4">
        <div className="flex space-x-4">
          {/* Attendance Card */}
          <div className="w-full flex-1 p-4">
            <div className="flex h-full transform flex-col justify-between rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-gray-800 mb-4 text-2xl font-extrabold tracking-tight">
                Attendance
              </h3>
              <div className="text-gray-700 mb-4 flex-grow space-y-3">
                <p className="text-lg font-medium">
                  Total Days Present:{" "}
                  <span className="font-bold text-blue-600">Working On it</span>
                </p>
                <p className="text-lg font-medium">
                  Total Days Absent:{" "}
                  <span className="text-red font-bold">Working On it</span>
                </p>
              </div>
            </div>
          </div>

          {/* Leave Card */}
          <div className="w-full flex-1 p-4">
            <div className="flex h-full transform flex-col justify-between rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="mb-4 text-2xl font-extrabold tracking-tight">
                Leave
              </h3>
              <div className="mb-4 flex-grow space-y-3 ">
                <p className="text-lg font-medium">
                  Total Leave Allowed:{" "}
                  <span className="font-bold">{totalLeaveAllowed}</span>
                </p>
                <p className="text-lg font-medium">
                  Leave Taken:{" "}
                  <span className="text-red font-bold">
                    {totalLeaveTaken}
                  </span>
                </p>
                <p className="text-lg font-medium">
                  Remaining Leave:{" "}
                  <span className="font-bold">{remainingLeave}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form>
            <div className="bg-gray flex min-h-screen flex-col items-center justify-start p-2">
              <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 text-center text-4xl font-bold">
                  {formatTime(time)}
                </div>
                <button
                  type="button"
                  onClick={isStarted ? endAttendance : attendneceUser}
                  className={`w-full rounded-lg px-4 py-2 font-semibold text-white shadow-md ${isStarted
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isStarted ? "End Time" : "Start Time"}
                </button>
              </div>

              <table className="mt-10 w-full border-collapse rounded-lg bg-white shadow-lg">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Leave Type</th>
                    <th className="p-4 text-left font-semibold">Start Time</th>
                    <th className="p-4 text-left font-semibold">End Time</th>
                    <th className="p-4 text-left font-semibold">Reason</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveDataStatus.map((leaveData, index) => (
                    <tr
                      key={leaveData._id}
                      className={`hover:bg-gray-100 transition-colors duration-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                      <td className="text-gray-800 border-gray-200 border-b p-4">
                        {leaveData.userDetails.name}
                      </td>
                      <td className="text-gray-800 border-gray-200 border-b p-4">
                        {leaveData.leaveType}
                      </td>
                      <td className="text-gray-800 border-gray-200 border-b p-4">
                        {formatDate(leaveData.startTime)}
                      </td>
                      <td className="text-gray-800 border-gray-200 border-b p-4">
                        {formatDate(leaveData.endTime)}
                      </td>
                      <td className="text-gray-800 border-gray-200 border-b p-4">
                        {leaveData.reason}
                      </td>
                      <td className="border-gray-200 border-b p-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 font-semibold text-white ${leaveData.isApproved
                              ? "bg-green-500"
                              : leaveData.isRejected
                                ? "bg-red"
                                : "bg-yellow-500"
                            }`}
                        >
                          {leaveData.isApproved
                            ? "Approved"
                            : leaveData.isRejected
                              ? "Rejected"
                              : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Attendence;
