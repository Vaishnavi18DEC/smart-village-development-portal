import React, { useState, useEffect } from 'react';
import { getProjects, getComplaints } from '../api';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Load projects from MySQL
    getProjects()
      .then(res => setProjects(res.data || []))
      .catch(err => console.error('Projects fetch error:', err));

    // Load complaints from MySQL
    getComplaints()
      .then(res => setComplaints(res.data || []))
      .catch(err => console.error('Complaints fetch error:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Active Projects: {projects.length}</h3>
      <h3>Complaints Registered: {complaints.length}</h3>
    </div>
  );
}

export default Dashboard;