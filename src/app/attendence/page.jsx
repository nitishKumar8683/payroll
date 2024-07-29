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
      toast.error("User ID is not available");
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

  const modalOpen = (e) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            Add Request
          </button>
        </div>
        <Modal isOpen={isModalOpen} closeModal={closeModal} userId={userId} />
      </div>
      <form>
        <div className="bg-gray-100 flex min-h-screen flex-col items-center justify-start p-2">
          <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-center text-4xl font-bold">
              {formatTime(time)}
            </div>
            <button
              type="button"
              onClick={isStarted ? endAttendance : attendneceUser}
              className={`w-full rounded-lg px-4 py-2 font-semibold text-white shadow-md ${
                isStarted
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isStarted ? "End Time" : "Start Time"}
            </button>
          </div>
        </div>
      </form>
    </DefaultLayout>
  );
};

export default Attendence;
