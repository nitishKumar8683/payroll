"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";

const Attendence = () => {
  const [time, setTime] = useState(0);
  const [userId, setUserId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

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
              setTime(0); // Reset time if attendance has ended
            }
          } else {
            setStartTime(null);
            setIsStarted(false);
            setTime(0); // Ensure time is reset if no attendance started
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
      const elapsedTime = Math.max(0, Math.floor((now - startTimeDate) / 1000));
      setTime(elapsedTime);
    }, 1000);
    setIntervalId(id); 

    return () => clearInterval(id); 
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
      alert("User ID is not available");
      return;
    }

    if (isStarted) {
      alert("Attendance already started today.");
      return;
    }

    const newStartTime = new Date().toISOString();

    try {
      const response = await axios.post(`/api/users/attendence/${userId}`, {
        startTime: newStartTime,
      });

      if (response.data.status) {
        setStartTime(newStartTime);
        setIsStarted(true);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error making request:", error);
      alert("An error occurred while processing your request.");
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
    alert("Attendance ended successfully");
  } catch (error) {
    console.error("Error ending attendance:", error);
    alert("An error occurred while ending your attendance.");
  }
};



  return (
    <DefaultLayout>
      <form>
        <div className="bg-gray-100 flex min-h-screen flex-col items-center justify-center p-2">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-1 text-center text-4xl font-bold">
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
