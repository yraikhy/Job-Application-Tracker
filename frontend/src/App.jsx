import React, { useEffect, useState } from "react";
import axios from "axios";
import { Application } from "./Application";
import "./App.css"; // Import your CSS file

const App = () => {
  const [applications, setApplications] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("id");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    axios
      .get("http://127.0.0.1:5000/api/applications")
      .then((response) => {
        const applicationsWithIndex = response.data.applications.map(
          (app, index) => ({
            ...app,
            originalIndex: index + 1,
          })
        );
        setApplications(applicationsWithIndex);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the job applications!",
          error
        );
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/api/del_application/${id}`)
      .then((response) => {
        fetchApplications();
      })
      .catch((error) => {
        console.error(
          "There was an error deleting the job application!",
          error
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/add_application", {
        company_name: companyName,
        date,
        status,
      })
      .then((response) => {
        fetchApplications();
        setCompanyName("");
        setDate("");
        setStatus("");
      })
      .catch((error) => {
        console.error(
          "There was an error creating the job application!",
          error
        );
      });
  };

  const handleUpdate = (id, updatedStatus) => {
    axios
      .post(`http://127.0.0.1:5000/api/update_status/`, {
        id: id,
        status: updatedStatus,
      })
      .then((response) => {
        fetchApplications();
      })
      .catch((error) => {
        console.error(
          "There was an error updating the job application status!",
          error
        );
      });
  };

  const toggleSortOrder = (column) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };

  return (
    <div className="container">
      <h1>Job Applications</h1>
      <table>
        <thead>
          <tr>
            <th>
              #
              <button
                className="sort-button"
                onClick={() => toggleSortOrder("id")}
              >
                {sortOrder === "asc" && sortColumn === "id" ? "▲" : "▼"}
              </button>
            </th>
            <th>
              Company Name
              <button
                className="sort-button"
                onClick={() => toggleSortOrder("company_name")}
              >
                {sortOrder === "asc" && sortColumn === "company_name"
                  ? "▲"
                  : "▼"}
              </button>
            </th>
            <th>
              Applied on
              <button
                className="sort-button"
                onClick={() => toggleSortOrder("date")}
              >
                {sortOrder === "asc" && sortColumn === "date" ? "▲" : "▼"}
              </button>
            </th>
            <th>
              Status
              <button
                className="sort-button"
                onClick={() => toggleSortOrder("status")}
              >
                {sortOrder === "asc" && sortColumn === "status" ? "▲" : "▼"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications
            .sort((a, b) => {
              let comparison = 0;
              if (a[sortColumn] > b[sortColumn]) {
                comparison = 1;
              } else if (a[sortColumn] < b[sortColumn]) {
                comparison = -1;
              }
              return sortOrder === "asc" ? comparison : -comparison;
            })
            .map((app) => (
              <Application
                key={app.id}
                index={app.originalIndex}
                id={app.id}
                company_name={app.company_name}
                date={app.date}
                status={app.status}
                handleDelete={handleDelete}
                updateStatus={handleUpdate}
              />
            ))}
        </tbody>
      </table>
      {!isAdding && (
        <div className="button-container">
          <button onClick={() => setIsAdding(true)}>Add Job Application</button>
        </div>
      )}
      {isAdding && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default App;
