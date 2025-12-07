"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface JwtPayload {
  companyId?: number | null;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getUsers = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No JWT found, user must log in first");
      return;
    }

    let companyId: number | null = null;
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      companyId = decoded.companyId ?? null;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return;
    }

    if (!companyId) {
      console.error("No companyId in JWT");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/company/${companyId}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        errorData.message.forEach((msg: string) => toast.error(msg));
        return;
      }

      const data = await response.json();
      setUsers(data); // ✅ populate table with backend data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleApplyChanges = async () => {
    if(!selectedUser)
        return;

    const token = localStorage.getItem("jwt");
    if(!token)
        return;

    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const companyId = decoded.companyId;

    try {
        const response = await fetch(`http://localhost:8080/company/${companyId}/users/${selectedUser.id}/role`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedUser.role),
            }
        );

        if(!response.ok) {
            const errorData = await response.json();
            errorData.message.forEach((msg: string) => toast.error(msg));
            return;
        }

        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success("Role updated succesfully!");
        setSettingsVisible(false);
    } catch (err) {
        console.error("Error updating role: ", err);
    }
  };

  const handleDeleteUser = async () => {
    if(!selectedUser)
        return;

    const token = localStorage.getItem("jwt");
    if(!token)
        return;

    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const companyId = decoded.companyId;

    const confirmDelete = window.confirm("Are you sure you want to remove this user from the company?")
    if(!confirmDelete)
        return;

    try {
        const response = await fetch(`http://localhost:8080/company/${companyId}/users/${selectedUser.id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if(!response.ok) {
            const errorData = await response.json();
            errorData.message.forEach((msg: string) => toast.error(msg));
            return;
        }

        setUsers(users.filter(u => u.id !== selectedUser.id));
        toast.success("User removed from company")
        setSettingsVisible(false);
    } catch (err) {
        console.error("Error removing user: ", err);
    }
  }

  const handleSettingsClick = (user: User) => {
    setSelectedUser(user);
    setSettingsVisible(true);
  };

  const handleCloseButtonClick = () => {
    setSettingsVisible(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full h-full flex flex-col items-end p-10">
      {/* Settings modal */}
      <div
        className={`w-full h-full fixed bg-[#1118] backdrop-blur-[2px] top-0 left-[90px] flex items-center justify-center ${
          settingsVisible ? "" : "hidden"
        }`}
      >
        {selectedUser && (
          <form
            onSubmit={(ev) => ev.preventDefault()}
            className="relative px-4 py-6 bg-white w-1/3 h-min flex flex-col gap-2"
          >
            <p className="text-[1.5rem]">{selectedUser.username}'s Settings</p>
            <select
              className="border border-black p-2 cursor-pointer"
              value={selectedUser.role}
              onChange={(ev) =>
                setSelectedUser({ ...selectedUser, role: ev.target.value })
              }
            >
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="MANAGER">Manager</option>
              <option value="OPERATOR">Operator</option>
              <option value="VIEWER">Viewer</option>
              <option value="USER">User</option>
            </select>
            <button
              className="absolute cursor-pointer font-bold text-[1.5rem] right-4 top-2"
              onClick={handleCloseButtonClick}
            >
              X
            </button>
            <button
              type="button"
              className="bg-red-500 p-2 font-bold cursor-pointer text-white"
            >
              Delete User
            </button>
            <button
              type="button"
              className="bg-[#0A3D62] p-2 font-bold cursor-pointer text-white"
              onClick={handleApplyChanges}
            >
              Apply Changes
            </button>
          </form>
        )}
      </div>

      {/* Users table */}
      <table className="text-white w-full">
        <thead className="bg-[#111]">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Role</th>
            <th className="bg-white"></th>
          </tr>
        </thead>
        <tbody className="bg-[#222]">
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td className="w-min bg-white">
                <button
                  onClick={() => handleSettingsClick(user)}
                  className="cursor-pointer hover:-rotate-90 transition-transform duration-100"
                >
                  <Image
                    src="/assets/settings-svgrepo-com.svg"
                    alt="Settings icon"
                    width={30}
                    height={30}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}