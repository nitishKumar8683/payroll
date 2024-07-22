"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const TableThree = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [isModalOpen, setIsModalopen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  useEffect(() => {
    userDetail();
  }, []);

  const userDetail = async () => {
    fetch("/api/users/getUser")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.usersData)
        setUserData(data.usersData);
      })
      .catch((error) => console.error(error));
    // const response = await axios.get("/api/users/getUser");
    // const data = response.data.usersData;
    // setUserData(data);
  };

  const deleteUser = async (_id: any) => {
    const id: any = _id;
    const response = await axios.delete(`/api/users/deleteUser/${id}`);
    if (response) {
      toast.success(response.data.message);
    }
    userDetail();
  };

  const getUserById = async (_id: any) => {
    const fetchBookId = _id;
    try {
      const response = await axios.get(`/api/users/getUserById/${fetchBookId}`);
      console.log(response);
      setEditUser(response.data.getUserById);
      setIsModalopen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateUser = async (e: any) => {
    e.preventDefault();

    if (!editUser) {
      toast.error("No book selected for editing");
      return;
    }
    if (!editUser.name || !editUser.role || !editUser.email) {
      if (!editUser.name) {
        toast.error("Enter the Full Name");
      }
      if (!editUser.role) {
        toast.error("Select the role");
      }
      if (!editUser.email) {
        toast.error("Enter the Email");
      }
    } else {
      try {
        const response = await axios.put(
          `/api/users/updateUser/${editUser._id}`,
          editUser,
        );
        console.log(response);
        if (response.data.success == false) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setIsModalopen(false);
          userDetail();
        }
      } catch (error) {
        console.error("Error updating book:", error);
        toast.error("Failed to update book");
      }
    }
  };

  return (
    <>
      <ToastContainer />

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
                        data.role === "manager"
                          ? "bg-success text-success"
                          : "bg-warning text-warning"
                      }`}
                    >
                      {data.role}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => getUserById(data._id)}
                        className="hover:text-primary"
                      >
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

      {isModalOpen && (
        <div className="bg-gray-500 fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-lg backdrop-filter">
          <div className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg">
            <button
              className="text-gray-600 absolute right-2 top-2 cursor-pointer text-lg hover:text-black"
              onClick={() => setIsModalopen(false)}
            >
              &times;
            </button>
            <div className="p-4">
              <h2 className="mb-4 text-xl font-bold">Edit User</h2>
              {editUser && (
                <form className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="fullName" className="mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className="border-gray-300 rounded border p-2"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Select Role
                      </label>

                      <div className="relative z-20 bg-white dark:bg-form-input">
                        <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                fill="#637381"
                              ></path>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                fill="#637381"
                              ></path>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                fill="#637381"
                              ></path>
                            </g>
                          </svg>
                        </span>

                        <select
                          value={editUser.role}
                          onChange={(e) => {
                            setEditUser({
                              ...editUser,
                              role: e.target.value,
                            });
                            changeTextColor();
                          }}
                          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                            isOptionSelected ? "text-black dark:text-white" : ""
                          }`}
                        >
                          <option
                            value=""
                            disabled
                            className="text-body dark:text-bodydark"
                          >
                            Select Role
                          </option>
                          {/* <option
                                                        value="admin"
                                                        className="text-body dark:text-bodydark"
                                                    >
                                                        Admin
                                                    </option> */}
                          <option
                            value="manager"
                            className="text-body dark:text-bodydark"
                          >
                            Manager
                          </option>
                          <option
                            value="employee"
                            className="text-body dark:text-bodydark"
                          >
                            Employee
                          </option>
                        </select>

                        <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill="#637381"
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="border-gray-300 rounded border p-2"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={updateUser}
                    className="float-right cursor-pointer self-end rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
                  >
                    Update Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableThree;
