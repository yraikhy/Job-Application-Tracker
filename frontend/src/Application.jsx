import React, { useState } from "react";

export const Application = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(props.status);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    props.updateStatus(props.id, newStatus);
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "#d3d3d3"; // grey
      case "Interview":
        return "#f0e68c"; // yellow
      case "Offer":
        return "#90ee90"; // green
      case "Rejected":
        return "#ffcccb"; // red
      default:
        return "#ffffff"; // white (default)
    }
  };

  return (
    <tr>
      <td>{props.index}</td>
      <td>{props.company_name}</td>
      <td>{props.date}</td>
      <td style={{ backgroundColor: getStatusColor(props.status) }}>
        {isEditing ? (
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        ) : (
          props.status
        )}
      </td>
      <td>
        {isEditing ? (
          <button onClick={handleSaveClick}>Save</button>
        ) : (
          <button onClick={handleUpdateClick}>Update</button>
        )}
        <button onClick={() => props.handleDelete(props.id)}>Delete</button>
      </td>
    </tr>
  );
};
