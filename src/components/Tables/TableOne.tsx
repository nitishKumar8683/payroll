"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Attendance {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  userDetails?: User;
}

const TableOne = () => {
  const [data, setData] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Attendance[]>(
          "/api/users/combined-data/userId",
        );
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Attendance
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Start Time
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              End Time
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {data.map((entry, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={entry._id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block">
                {entry.userDetails?.name || "N/A"}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {entry.userDetails?.email || "N/A"}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-center text-meta-3">
                {entry.startTime
                  ? new Date(entry.startTime).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-center text-black dark:text-white">
                {entry.endTime ? new Date(entry.endTime).toLocaleString() : "-"}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button className="text-blue-500 hover:underline">Action</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
