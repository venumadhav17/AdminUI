import React, { useState, useEffect } from "react";
import axios from "axios";

// Importing react components
import Table from "../Table/Table";
import Pagination from "../Pagination/Pagination";
import SearchBar from "../SearchBar/SearchBar";
import DeleteButton from "../DeleteButton/DeleteButton";
import UsersNotFound from "../UsersNotFound/UsersNotFound";
import LoadingPage from "../LoadingPage/LoadingPage";

// Importing styles
import "./AdminPage.css";

const API_URL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const AdminPage = () => {
  // Declaring states
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [usersToBeDeleted, setUserToBeDeleted] = useState([]);
  const [query, setQuery] = useState("");
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setAllUsers(response.data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Pagination
  useEffect(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const userSlice = users.slice(indexOfFirstUser, indexOfLastUser);
    if (userSlice.length === 0) {
      setCurrentPage(1);
    }
    setCurrentUsers(userSlice);
  }, [users, currentPage]);

  // Search for users
  useEffect(() => {
    const searchedUsers = allUsers.filter((user) => {
      if (user.name.toLowerCase().includes(query.toLowerCase())) {
        return user;
      } else if (user.email.toLowerCase().includes(query.toLowerCase())) {
        return user;
      } else if (user.role.toLowerCase().includes(query.toLowerCase())) {
        return user;
      }
      return "";
    });
    setUsers(searchedUsers);
  }, [query, allUsers]);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Prev Page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next Page
  const nextPage = (maxPageLength) => {
    if (currentPage < maxPageLength) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Delete User
  const deleteUser = (userId) => {
    let usersLeft = [...users];
    usersLeft = usersLeft.filter((user) => user.id !== userId);
    setUsers(usersLeft);
    setAllUsers(usersLeft);
  };

  // Search Users

  const handleSearchUser = (event) => {
    event.preventDefault();

    setQuery(event.target.value);
  };

  // Delete Selected Users
  const handleDeleteUsers = (event) => {
    event.preventDefault();
    let usersLeft = [...users];
    let deletingUsers = [...usersToBeDeleted];

    usersLeft = usersLeft.filter((user) => !deletingUsers.includes(user.id));
    setUsers([...usersLeft]);
    setAllUsers([...usersLeft]);
  };

  return (
    <div>
      {loading ? (
        <LoadingPage message={"Loading Users..."} />
      ) : (
        <div className="adminPage">
          <SearchBar
            handleSearchUser={handleSearchUser}
            placeholderText={"Search by name, email or role"}
            query={query}
          />
          {users.length !== 0 ? (
            <div className="container">
              <Table
                totalUsers={users}
                users={currentUsers}
                setUsers={setUsers}
                deleteUser={deleteUser}
                setUserToBeDeleted={setUserToBeDeleted}
              />
              <div className="footer">
                <DeleteButton
                  handleDeleteUsers={handleDeleteUsers}
                  deleteText="Delete Selected"
                />

                <Pagination
                  usersPerPage={usersPerPage}
                  totalUsers={users.length}
                  paginate={paginate}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  selectedPage={currentPage}
                />
              </div>
            </div>
          ) : (
            <UsersNotFound />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;