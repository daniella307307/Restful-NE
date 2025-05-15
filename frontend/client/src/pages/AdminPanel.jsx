import React, { useState, useEffect } from "react";
import { fetchUsers ,deleteUser as apiDeleteUser} from "../apis/userApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers(page, 10);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Could not load users.");
    } finally {
      setLoading(false);
    }
  };
const deleteUser = async (userId) => {
  try {
    setLoading(true);
    const res = await apiDeleteUser(userId);  // call API to delete user by id
    toast.success(res.data.message || "User deleted successfully");
    getUsers();  // refresh list after deletion
  } catch (err) {
    console.error("Failed to delete user:", err);
    toast.error("Could not delete user.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getUsers();
  }, [page]);
  return (
    <div className="flex w-full h-full gap-2 ">
    <Sidebar/>
      <div className="h-full lg:min-w-[84%]">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-200 p-4 rounded">Total Slots: 100</div>
        <div className="bg-green-200 p-4 rounded">Available: 40</div>
        <div className="bg-red-200 p-4 rounded">Occupied: 60</div>
        <div className="bg-yellow-200 p-4 rounded">Revenue: $4500</div>
      </div>
      <h2 className="text-xl font-bold mb-4">All Registered Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <table className="w-full border table-auto">
            <thead>
              <tr className="bg-blue-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">
                    <ul className="flex justify-center gap-8">
                      <li>
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="lg"
                          color="red"
                          onClick={()=>deleteUser(user.id)}
                        />
                      </li>
                      <li>
                        <FontAwesomeIcon icon={faEdit} size="lg" color="gray" />
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="bg-blue-500 text-white px-4 py-1 rounded disabled:bg-gray-400"
            >
              Prev
            </button>
            <span className="self-center">Page {page}</span>
            <button
              disabled={!pagination.hasMore}
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-blue-500 text-white px-4 py-1 rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export default AdminPanel;
