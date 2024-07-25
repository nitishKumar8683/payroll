import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import axios from "axios";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  icon: JSX.Element;
  label: string;
  route: string;
  adminOnly?: boolean;
  managerOnly?: boolean;
  employeeOnly?: boolean;
  children?: MenuItem[];
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashboard SVG path */}
          </svg>
        ),
        label: "Dashboard",
        route: "/",
        adminOnly: true,
        managerOnly: true,
        employeeOnly: true,
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Calendar SVG path */}
          </svg>
        ),
        label: "Calendar",
        route: "/calendar",
        adminOnly: true,
        managerOnly: true,
        employeeOnly: true,
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Profile SVG path */}
          </svg>
        ),
        label: "Profile",
        route: "/profile",
        adminOnly: true,
        managerOnly: true,
        employeeOnly: true,
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Forms SVG path */}
          </svg>
        ),
        label: "Forms",
        route: "#",
        children: [
          {
            label: "Add Employee",
            route: "/forms/form-layout",
            icon: (
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Add Employee SVG path */}
              </svg>
            ),
            adminOnly: true,
          },
        ],
        adminOnly: true,
        managerOnly: true,
        employeeOnly: true,
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Tables SVG path */}
          </svg>
        ),
        label: "Tables",
        route: "/tables",
        adminOnly: true,
        managerOnly: true,
        employeeOnly: true,
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [dataUser, setDataUser] = useState<string>("");
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setDataUser(response.data.dataUser.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const pathname = usePathname();

  let dashboardHeading = "Dashboard";

  switch (dataUser) {
    case "admin":
      dashboardHeading = "Admin Dashboard";
      break;
    case "manager":
      dashboardHeading = "Manager Dashboard";
      break;
    case "employee":
      dashboardHeading = "Employee Dashboard";
      break;
    default:
      dashboardHeading = "Dashboard";
      break;
  }

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <h1 className="text-2xl font-semibold text-white dark:text-white">
            {dashboardHeading}
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hamburger menu SVG path */}
            </svg>
          </button>
        </div>

        {/* Sidebar menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems
                    .filter((menuItem) => {
                      if (dataUser === "admin" ) {
                        return true;
                      } else if (dataUser === "manager" || dataUser === "employee") {
                        return (
                          menuItem.label === "Dashboard" ||
                          menuItem.label === "Calendar" ||
                          menuItem.label === "Profile"
                        );
                      }
                      return false;
                    })
                    .map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
