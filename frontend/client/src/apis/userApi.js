import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1"
});

// Get all users with auth header
export const fetchUsers = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token');
  return await API.get(`/user/users?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  return await API.delete(`/user/delete?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};