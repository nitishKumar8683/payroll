"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

interface datats {
  name: string;
  email: string;
  role: string;
}

const TableThree = () => {
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    userDetail();
  }, []);

  const userDetail = async () => {
    const response = await axios.get("/api/users/getUser");
    console.log(response.data.usersData);
    const data = response.data.usersData;
    setUserData(data);
  };

  const deleteUser = async (_id: any) => {
    const id = _id;
    console.log(id);
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {userData.map((data, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {data.name}
                  </h5>
                  {/* <p className="text-sm">{data.email}</p> */}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{data.email}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                      data.status === "Paid"
                        ? "bg-success text-success"
                        : data.status === "Unpaid"
                          ? "bg-danger text-danger"
                          : "bg-warning text-warning"
                    }`}
                  >
                    {data.role}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteUser(data._id)}
                      className="hover:text-primary"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
