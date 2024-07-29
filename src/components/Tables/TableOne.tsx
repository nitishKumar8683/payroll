"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

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
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const attendenceEdit = (_id: any) => {
    const id = _id;
    alert(id);
  };

  const attendenceDelete = (_id: any) => {
    const id = _id;
    alert(id);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Attendance
      </h4>

      <div className="flex flex-col">
        <div className="hidden grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5 md:grid">
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
            className={`flex grid-cols-3 flex-col sm:grid-cols-5 md:grid ${
              key === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={entry._id}
          >
            {/* Desktop View */}
            <div className="hidden items-center gap-3 p-2.5 md:flex xl:p-5">
              <p className="text-black dark:text-white">
                {entry.userDetails?.name || "N/A"}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 md:flex xl:p-5">
              <p className="text-black dark:text-white">
                {entry.userDetails?.email || "N/A"}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 md:flex xl:p-5">
              <p className="text-center text-meta-3">
                {entry.startTime
                  ? new Date(entry.startTime).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 md:flex xl:p-5">
              <p className="text-center text-black dark:text-white">
                {entry.endTime ? new Date(entry.endTime).toLocaleString() : "-"}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 md:flex xl:p-5">
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={() => attendenceEdit(entry._id)}
                  className="hover:text-primary"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => attendenceDelete(entry._id)}
                  className="hover:text-primary"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>

            {/* Mobile View */}
            <div className="mb-4 rounded-lg border border-stroke p-4 dark:border-strokedark md:hidden">
              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  Name:
                </strong>
                <p className="text-black dark:text-white">
                  {entry.userDetails?.name || "N/A"}
                </p>
              </div>
              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  Email:
                </strong>
                <p className="text-black dark:text-white">
                  {entry.userDetails?.email || "N/A"}
                </p>
              </div>
              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  Start Time:
                </strong>
                <p className="text-meta-3">
                  {entry.startTime
                    ? new Date(entry.startTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  End Time:
                </strong>
                <p className="text-black dark:text-white">
                  {entry.endTime
                    ? new Date(entry.endTime).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={() => attendenceEdit(entry._id)}
                    className="hover:text-primary"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => attendenceDelete(entry._id)}
                    className="hover:text-primary"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
