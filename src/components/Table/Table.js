import React, { useState, useEffect } from "react";
import ReadRow from "../ReadRow/ReadRow";
import EditableRow from "../EditableRow/EditableRow";

// Importing styles
import "./Table.css";

const Table = ({
  users,
  setUsers,
  deleteUser,
  totalUsers,
  setUserToBeDeleted,
}) => {
  // Declaring states
  //
  const [editRowId, setEditRowId] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Select users to be deleted
  //
  useEffect(() => {
    setUserToBeDeleted([...selectedRowIds]);
  }, [selectedRowIds, setUserToBeDeleted]);

  // To reset states when the page changes
  //
  useEffect(() => {
    setSelectedRowIds([]);
    setSelectAll(false);
  }, [users]);

  // Select all users of current page
  //
  useEffect(() => {
    const userIDs = users.map((user) => user.id);
    if (selectAll) {
      setSelectedRowIds(userIDs);
    } else {
      setSelectedRowIds([]);
    }
  }, [selectAll, users]);

  // When edit button is clicked
  //
  const clickEditUser = (user) => {
    setEditRowId(user.id);
    setEditUserData({ name: user.name, email: user.email, role: user.role });
  };

  // When the cancel edit button is clicked
  //
  const closeEditUser = () => {
    setEditRowId(null);
  };

  // When the user checkbox is selected
  //
  const selectUser = (user) => {
    let selectedIndices = [...selectedRowIds];
    const index = selectedIndices.findIndex((id) => id === user.id);

    if (index === -1) {
      setSelectedRowIds([...selectedIndices, user.id]);
    } else {
      selectedIndices.splice(index, 1);
      setSelectedRowIds(selectedIndices);
    }
  };

  // When all users are selected
  //
  const handleSelectAll = () => {
    setSelectAll((selectAll) => !selectAll);
  };

  // When user fields are getting edited
  //
  const handleEditUserChange = (event) => {
    event.preventDefault();

    setEditUserData({
      ...editUserData,
      [event.target.name]: event.target.value,
    });
  };

  // When the user submits the editted fields
  //
  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedUser = {
      id: editRowId,
      name: editUserData.name,
      email: editUserData.email,
      role: editUserData.role,
    };

    const newUsers = totalUsers.map((user) => {
      if (user.id === editRowId) {
        return { ...user, ...editedUser };
      }
      return user;
    });

    setUsers(newUsers);
    setEditRowId(null);
  };

  return (
    <table className="tableStyle">
      <thead>
        <tr>
          <th className="checkboxColumn">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className={
              selectedRowIds.includes(user.id) ? "selectedRow" : "unSelectedRow"
            }
          >
            {user.id === editRowId ? (
              <EditableRow
                key={user.id}
                user={user}
                editUserData={editUserData}
                handleEditUserChange={handleEditUserChange}
                handleEditFormSubmit={handleEditFormSubmit}
                closeEditUser={closeEditUser}
                selectedRowIds={selectedRowIds}
                selectUser={selectUser}
              />
            ) : (
              <ReadRow
                key={user.id}
                user={user}
                deleteUser={deleteUser}
                clickEditUser={clickEditUser}
                selectUser={selectUser}
                selectedRowIds={selectedRowIds}
              />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;