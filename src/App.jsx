import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getProjects, getComplaints ,loginApi} from './api';

// Role Definitions
export const ROLES = {
  TALUK_OFFICER: 'TALUK_OFFICER',
  PANCHAYAT_OFFICER: 'PANCHAYAT_OFFICER',
  CITIZEN: 'CITIZEN',
};

// Registered Government Official Database for Verification
const OFFICIAL_USERS = [
  { identifier: 'TLK101', password: 'admin123', role: ROLES.TALUK_OFFICER, name: 'Taluk Executive Officer' },
  { identifier: 'TLK102', password: 'admin123', role: ROLES.TALUK_OFFICER, name: 'Sub-Collector / Taluk Head' },
  { identifier: 'PNC201', password: 'panchayat123', role: ROLES.PANCHAYAT_OFFICER, name: 'Sivakasi Panchayat Officer' },
  { identifier: 'PNC202', password: 'panchayat123', role: ROLES.PANCHAYAT_OFFICER, name: 'Sattur Panchayat Officer' },
  { identifier: 'citizen@gmail.com', password: 'citizen123', role: ROLES.CITIZEN, name: 'Registered Citizen' },
];

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Authentic Vector Component of Tamil Nadu Government Seal

const OfficialTamilNaduEmblem = ({ size = 60 }) => (
  <div style={{
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="94"
        fill="white" stroke="#08752D" strokeWidth="5" />
      <circle cx="100" cy="100" r="85"
        fill="white" stroke="#164C80" strokeWidth="3" />

      {/* Sun */}
      <g stroke="#F5A900" strokeWidth="5" strokeLinecap="round">
        <line x1="100" y1="25" x2="100" y2="43" />
        <line x1="72" y1="38" x2="80" y2="50" />
        <line x1="128" y1="38" x2="120" y2="50" />
        <line x1="55" y1="57" x2="70" y2="65" />
        <line x1="145" y1="57" x2="130" y2="65" />
      </g>
      <circle cx="100" cy="77" r="25" fill="#FFB400" />

      {/* Tree */}
      <rect x="43" y="104" width="9" height="42" fill="#145D32" />
      <g fill="#168A3C">
        <circle cx="42" cy="86" r="16" />
        <circle cx="55" cy="78" r="15" />
        <circle cx="65" cy="91" r="14" />
        <circle cx="35" cy="101" r="13" />
        <circle cx="54" cy="98" r="16" />
      </g>

      {/* Water Tank */}
      <rect x="151" y="91" width="23" height="35" rx="2" fill="#075A9D" />
      <path d="M147 91 L178 91 L172 84 L153 84 Z" fill="#075A9D" />
      <path d="M155 126 L153 159 M170 126 L174 159"
        stroke="#075A9D" strokeWidth="4" />
      <path d="M147 159 L180 159"
        stroke="#075A9D" strokeWidth="3" />

      {/* Main House */}
      <path d="M68 130 L100 101 L132 130 V160 H68 Z"
        fill="#FFFFFF" stroke="#075A9D" strokeWidth="5" />
      <path d="M61 130 L100 96 L139 130"
        fill="none" stroke="#075A9D" strokeWidth="7" />

      {/* Small House */}
      <path d="M112 137 L139 115 L163 137 V158 H112 Z"
        fill="white" stroke="#075A9D" strokeWidth="4" />
      <path d="M106 137 L139 110 L168 137"
        fill="none" stroke="#075A9D" strokeWidth="5" />

      {/* Windows and Doors */}
      <rect x="90" y="132" width="13" height="17" fill="#075A9D" />
      <rect x="117" y="139" width="9" height="10" fill="#075A9D" />
      <rect x="139" y="139" width="9" height="10" fill="#075A9D" />

      {/* Green Fields */}
      <path d="M16 148 Q55 130 85 151 Q110 135 145 151 Q175 137 186 150 L186 176 Q100 197 16 176 Z"
        fill="#16863B" />
      <path d="M17 157 Q57 145 88 160 Q115 143 148 160"
        fill="none" stroke="white" strokeWidth="3" />
      <path d="M37 179 Q65 151 95 153 Q75 166 62 183"
        fill="white" />
      <path d="M102 180 Q115 155 145 151 Q129 170 117 184"
        fill="white" />

      {/* Green Border */}
      <circle cx="100" cy="100" r="94"
        fill="none" stroke="#08752D" strokeWidth="3" />
    </svg>
  </div>
);


export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_village_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'High Mast Solar Street Lights Installation',
      village: 'Sivakasi',
      budget: '₹5,50,000',
      progress: 80,
      status: 'Approved',
      photo: 'https://5.imimg.com/data5/SELLER/Default/2021/12/OI/AJ/EN/28486715/solar-street-light-and-high-mast-light-system-1000x1000.jpg',
      lastUpdated: '2026-08-10',
    },
    {
      id: 2,
      name: 'Government Higher Secondary School Drinking Water Tank',
      village: 'Thiruthangal',
      budget: '₹3,20,000',
      progress: 35,
      status: 'Pending Approval',
      photo: 'https://5.imimg.com/data5/SELLER/Default/2025/8/537813157/DY/RT/VN/199048479/zincalume-drinking-water-storage-tank-1000x1000.jpg',
      lastUpdated: '2026-08-18',
    },
    {
      id: 3,
      name: 'Road Upgradation / Strengthening – Sattur Block',
      village: 'Sattur',
      budget: '₹11,40,000',
      progress: 100,
      status: 'Approved',
      photo: 'https://pbs.twimg.com/media/HCUPNd3akAAimGv.jpg',
      lastUpdated: '2026-08-22',
    },
    {
      id: 4,
      name: 'Road & Bridge construction',
      village: 'Sattur',
      budget: '₹25,70,000',
      progress: 20,
      status: 'Pending Approval',
      photo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
      lastUpdated: '2026-08-22',
    },
  ]);

  const [complaints, setComplaints] = useState([
    {
      id: 101,
      citizenEmail: 'priya.citizen@tn.gov.in',
      village: 'Sivakasi',
      category: 'Drinking Water',
      issue: 'Water pipeline leak near Bus Stand East Road',
      status: 'In Progress',
      officerRemarks: 'Panchayat maintenance worker assigned.',
      date: '2026-08-20',
    },
    {
      id: 102,
      citizenEmail: 'karthik.c@tn.gov.in',
      village: 'Thiruthangal',
      category: 'Street Light',
      issue: 'Lamps not functioning near temple entrance road',
      status: 'Pending Review',
      officerRemarks: 'Awaiting local electrical technician visit.',
      date: '2026-08-23',
    },
  ]);

  const [feedbacks, setFeedbacks] = useState([
    { id: 1, village: 'Sattur', rating: 5, comment: 'Drainage reconstruction was completed quickly without traffic delays.', author: 'Resident Murugan' },
  ]);

  // LIVE BACKEND DATA FETCH (Populates MySQL data on page load)
  useEffect(() => {
    // 1. Fetch live projects from MySQL
    getProjects()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          // Normalize backend column names to your UI names if needed
          const liveProjects = res.data.map((p) => ({
            id: p.project_id || p.id,
            name: p.project_title || p.title || p.name,
            village: p.village_name || 'Sivakasi',
            budget: p.estimated_budget ? `₹${p.estimated_budget}` : p.budget,
            progress: p.progress_percentage ?? p.progress ?? 0,
            status: p.status || 'Pending Approval',
            photo: p.photo_url || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60',
            lastUpdated: p.updated_at ? p.updated_at.split('T')[0] : '2026-08-22',
          }));
          setProjects(liveProjects);
        }
      })
      .catch((err) => console.log('Using local fallback projects:', err.message));

    // 2. Fetch live complaints from MySQL
    getComplaints()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const liveComplaints = res.data.map((c) => ({
            id: c.complaint_id || c.id,
            citizenEmail: c.citizen_email || 'citizen@tn.gov.in',
            village: c.village_name || 'Sivakasi',
            category: c.category || 'General',
            issue: c.title ? `${c.title} - ${c.description || ''}` : c.issue,
            status: c.status || 'Pending Review',
            officerRemarks: c.resolution_notes || 'Assigned to Panchayat officer.',
            date: c.created_at ? c.created_at.split('T')[0] : '2026-08-20',
          }));
          setComplaints(liveComplaints);
        }
      })
      .catch((err) => console.log('Using local fallback complaints:', err.message));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('smart_village_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_village_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, projects, setProjects, complaints, setComplaints, feedbacks, setFeedbacks }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <GovernmentHeader />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/citizen/home" element={<CitizenHome />} />
          <Route path="/taluk/home" element={<TalukOfficerHome />} />
          <Route path="/panchayat/home" element={<PanchayatOfficerHome />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

// Government Header with Moving Marquee
function GovernmentHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header style={{ backgroundColor: '#0B3C5D', color: '#FFFFFF', borderBottom: '3px solid #D9B310', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0.85rem 1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer' }} onClick={() => user && navigate(getRedirectPath(user.role))}>
            <OfficialTamilNaduEmblem size={60} />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '800', letterSpacing: '0.8px' }}>
                SMART VILLAGE DEVELOPMENT PORTAL
              </h1>
              <div style={{ fontSize: '0.82rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D9B310', fontWeight: '700', marginTop: '2px' }}>
                RURAL DEVELOPMENT & PANCHAYAT RAJ DEPARTMENT
              </div>
            </div>
          </div>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600' }}>{user.identifier}</div>
                <span style={{ display: 'inline-block', backgroundColor: '#1D2731', color: '#D9B310', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '10px', marginTop: '3px', fontWeight: 'bold' }}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{ backgroundColor: '#C62828', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ backgroundColor: '#1D2731', color: '#D9B310', padding: '0.4rem 0', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1.5px', borderBottom: '2px solid #D9B310' }}>
        <marquee behavior="scroll" direction="left" scrollamount="6">
          ★ GOVERNMENT OF TAMIL NADU ★ RURAL DEVELOPMENT & PANCHAYAT RAJ ★ SIVAKASI • THIRUTHANGAL • SATTUR JURISDICTION ★
        </marquee>
      </div>
    </>
  );
}

const getRedirectPath = (role) => {
  if (role === ROLES.TALUK_OFFICER) return '/taluk/home';
  if (role === ROLES.PANCHAYAT_OFFICER) return '/panchayat/home';
  return '/citizen/home';
};

// Login Page with 3 Distinct Role Selection Buttons & Error Validation
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = useState(ROLES.TALUK_OFFICER);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isOfficer = selectedRole === ROLES.TALUK_OFFICER || selectedRole === ROLES.PANCHAYAT_OFFICER;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedId = identifier.trim();
    const trimmedPass = password.trim();

    // Check credentials against registered database
    const matchedOfficer = OFFICIAL_USERS.find(
      (u) => u.identifier.toUpperCase() === trimmedId.toUpperCase() && u.role === selectedRole
    );

    if (isOfficer) {
      if (!matchedOfficer) {
        setErrorMessage(`Invalid Employee ID: "${trimmedId}" is not registered for ${selectedRole.replace('_', ' ')}.`);
        return;
      }
      if (matchedOfficer.password !== trimmedPass) {
        setErrorMessage('Wrong Password! Please enter the correct password.');
        return;
      }
    } else {
      // Citizen Authentication
      if (matchedOfficer && matchedOfficer.password !== trimmedPass) {
        setErrorMessage('Wrong Password! Please check your credentials.');
        return;
      }
    }

    // Success Authentication
    login({
      identifier: trimmedId,
      role: selectedRole,
      name: matchedOfficer ? matchedOfficer.name : 'Citizen User',
    });
    navigate(getRedirectPath(selectedRole));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '2rem 1.5rem' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', borderTop: '6px solid #0B3C5D', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: '100%', maxWidth: '530px', padding: '2.5rem 2.2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
            <OfficialTamilNaduEmblem size={75} />
          </div>
          <h2 style={{ color: '#0B3C5D', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>
            Village Development Monitoring Portal
          </h2>
          <div style={{ color: '#0B3C5D', fontWeight: '800', fontSize: '0.82rem', letterSpacing: '1.5px', marginTop: '5px', textTransform: 'uppercase' }}>
            GOVERNMENT OF TAMIL NADU
          </div>
        </div>

        {/* 3 Role Selection Buttons */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ ...formLabel, textAlign: 'center', marginBottom: '0.6rem' }}>Select User Portal</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleRoleChange(ROLES.TALUK_OFFICER)}
              style={{
                ...roleSelectBtn,
                backgroundColor: selectedRole === ROLES.TALUK_OFFICER ? '#0B3C5D' : '#F1F5F9',
                color: selectedRole === ROLES.TALUK_OFFICER ? '#FFFFFF' : '#0B3C5D',
                border: selectedRole === ROLES.TALUK_OFFICER ? '2px solid #0B3C5D' : '1px solid #CBD5E1',
              }}
            >
              Taluk Officer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange(ROLES.PANCHAYAT_OFFICER)}
              style={{
                ...roleSelectBtn,
                backgroundColor: selectedRole === ROLES.PANCHAYAT_OFFICER ? '#0B3C5D' : '#F1F5F9',
                color: selectedRole === ROLES.PANCHAYAT_OFFICER ? '#FFFFFF' : '#0B3C5D',
                border: selectedRole === ROLES.PANCHAYAT_OFFICER ? '2px solid #0B3C5D' : '1px solid #CBD5E1',
              }}
            >
              Panchayat Officer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange(ROLES.CITIZEN)}
              style={{
                ...roleSelectBtn,
                backgroundColor: selectedRole === ROLES.CITIZEN ? '#0B3C5D' : '#F1F5F9',
                color: selectedRole === ROLES.CITIZEN ? '#FFFFFF' : '#0B3C5D',
                border: selectedRole === ROLES.CITIZEN ? '2px solid #0B3C5D' : '1px solid #CBD5E1',
              }}
            >
              Citizen
            </button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div style={{ backgroundColor: '#FFEBEE', color: '#C62828', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.2rem', border: '1px solid #EF9A9A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={formLabel}>
              {isOfficer ? 'Employee ID (Emp ID)' : 'Email Address'}
            </label>
            <input
              type={isOfficer ? 'text' : 'email'}
              required
              placeholder={
                selectedRole === ROLES.TALUK_OFFICER
                  ? 'Enter Taluk Emp ID (e.g., TLK101)'
                  : selectedRole === ROLES.PANCHAYAT_OFFICER
                  ? 'Enter Panchayat Emp ID (e.g., PNC201)'
                  : 'Enter your email (e.g., citizen@gmail.com)'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={formInput}
            />
          </div>

          <div>
            <label style={formLabel}>Password</label>
            <input
              type="password"
              required
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={formInput}
            />
          </div>

          <button
            type="submit"
            style={{ padding: '0.85rem', backgroundColor: '#0B3C5D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.3rem' }}
          >
            Authenticate & Proceed as {selectedRole.replace('_', ' ')}
          </button>
        </form>

        {/* Helpful Credential Note for Presentation / Viva */}
        <div style={{ marginTop: '1.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#64748B', border: '1px dashed #CBD5E1' }}>
          <b>Demo Official Access:</b>
          <br />• Taluk Officer: <code>TLK101</code> / <code>admin123</code>
          <br />• Panchayat Officer: <code>PNC201</code> / <code>panchayat123</code>
          <br />• Citizen: <code>citizen@gmail.com</code> / <code>citizen123</code>
        </div>
      </div>
    </div>
  );
}

// 1. Citizen Home Page
function CitizenHome() {
  const { user, projects, complaints, setComplaints, feedbacks, setFeedbacks } = useAuth();
  const [tab, setTab] = useState('projects');
  const [villageFilter, setVillageFilter] = useState('All');

  const [newComplaint, setNewComplaint] = useState({ village: 'Sivakasi', category: 'Road Damage', issue: '' });
  const [newFeedback, setNewFeedback] = useState({ village: 'Sivakasi', rating: 5, comment: '' });

  const handleComplaint = (e) => {
    e.preventDefault();
    if (!newComplaint.issue.trim()) return;
    const report = {
      id: Date.now(),
      citizenEmail: user.identifier,
      village: newComplaint.village,
      category: newComplaint.category,
      issue: newComplaint.issue,
      status: 'Pending Review',
      officerRemarks: 'Submitted to Panchayat cell.',
      date: new Date().toISOString().split('T')[0],
    };
    setComplaints([report, ...complaints]);
    setNewComplaint({ village: 'Sivakasi', category: 'Road Damage', issue: '' });
    alert('Your grievance has been submitted successfully.');
    setTab('complaints');
  };

  const handleFeedback = (e) => {
    e.preventDefault();
    if (!newFeedback.comment.trim()) return;
    setFeedbacks([{ id: Date.now(), ...newFeedback, author: user.identifier }, ...feedbacks]);
    setNewFeedback({ village: 'Sivakasi', rating: 5, comment: '' });
    alert('Thank you for your feedback on village works.');
  };

  const filtered = villageFilter === 'All' ? projects : projects.filter(p => p.village === villageFilter);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#0B3C5D', margin: 0 }}>Citizen Development Portal</h2>
          <p style={{ color: '#555', margin: '3px 0 0 0', fontSize: '0.9rem' }}>Review village infrastructure progress, share community feedback, and lodge grievances</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setTab('projects')} style={{ ...tabBtn, background: tab === 'projects' ? '#0B3C5D' : '#E0E7ED', color: tab === 'projects' ? '#fff' : '#0B3C5D' }}>Active Projects</button>
          <button onClick={() => setTab('report')} style={{ ...tabBtn, background: tab === 'report' ? '#0B3C5D' : '#E0E7ED', color: tab === 'report' ? '#fff' : '#0B3C5D' }}>+ Report Grievance</button>
          <button onClick={() => setTab('complaints')} style={{ ...tabBtn, background: tab === 'complaints' ? '#0B3C5D' : '#E0E7ED', color: tab === 'complaints' ? '#fff' : '#0B3C5D' }}>Track Complaints</button>
          <button onClick={() => setTab('feedback')} style={{ ...tabBtn, background: tab === 'feedback' ? '#0B3C5D' : '#E0E7ED', color: tab === 'feedback' ? '#fff' : '#0B3C5D' }}>Village Feedback</button>
        </div>
      </div>

      {tab === 'projects' && (
        <>
          <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Filter Village:</span>
            <select value={villageFilter} onChange={(e) => setVillageFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
              <option value="All">All Villages</option>
              <option value="Sivakasi">Sivakasi</option>
              <option value="Thiruthangal">Thiruthangal</option>
              <option value="Sattur">Sattur</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(p => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #d1dbe5', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <img src={p.photo} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <span style={{ backgroundColor: '#E3F2FD', color: '#0B3C5D', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{p.village}</span>
                    <span style={{ fontWeight: 'bold', color: p.status === 'Approved' ? '#2E7D32' : '#E65100' }}>{p.status}</span>
                  </div>
                  <h4 style={{ margin: '0 0 0.6rem 0', color: '#1D2731', fontSize: '1.05rem' }}>{p.name}</h4>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span>Completion</span>
                      <span style={{ fontWeight: 'bold' }}>{p.progress}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: p.progress === 100 ? '#2E7D32' : '#0B3C5D' }}></div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#555' }}>Sanctioned Budget: <b>{p.budget}</b></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'report' && (
        <div style={{ maxWidth: '580px', margin: '0 auto', background: '#fff', padding: '2.2rem', borderRadius: '8px', border: '1px solid #d1dbe5', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', color: '#0B3C5D' }}>Lodge a Village Grievance</h3>
          <form onSubmit={handleComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={formLabel}>Select Village</label>
              <select value={newComplaint.village} onChange={(e) => setNewComplaint({ ...newComplaint, village: e.target.value })} style={formInput}>
                <option value="Sivakasi">Sivakasi</option>
                <option value="Thiruthangal">Thiruthangal</option>
                <option value="Sattur">Sattur</option>
              </select>
            </div>
            <div>
              <label style={formLabel}>Grievance Category</label>
              <select value={newComplaint.category} onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })} style={formInput}>
                <option value="Road Damage">Roads & Transportation</option>
                <option value="Drinking Water">Drinking Water Supply & Pipe Leaks</option>
                <option value="Street Light">Street Lights & Electricity Faults</option>
                <option value="Sanitation">Drainage, Garbage & Sanitation</option>
              </select>
            </div>
            <div>
              <label style={formLabel}>Grievance Details</label>
              <textarea
                rows="4"
                required
                placeholder="Provide specific location, street name, and issue details..."
                value={newComplaint.issue}
                onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                style={{ ...formInput, resize: 'vertical' }}
              />
            </div>
            <button type="submit" style={{ padding: '0.85rem', background: '#0B3C5D', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Submit Grievance
            </button>
          </form>
        </div>
      )}

      {tab === 'complaints' && (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #d1dbe5', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0B3C5D' }}>Grievance Tracking Log</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E0E7ED', fontSize: '0.85rem', color: '#555' }}>
                <th style={{ padding: '0.75rem' }}>Complaint ID</th>
                <th style={{ padding: '0.75rem' }}>Village</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Description</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Officer Remarks</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: '0.85rem' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>#{c.id}</td>
                  <td style={{ padding: '0.75rem' }}>{c.village}</td>
                  <td style={{ padding: '0.75rem' }}>{c.category}</td>
                  <td style={{ padding: '0.75rem' }}>{c.issue}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.75rem', backgroundColor: c.status === 'Resolved' ? '#E8F5E9' : '#FFF3E0', color: c.status === 'Resolved' ? '#2E7D32' : '#E65100' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#666' }}>{c.officerRemarks || 'In review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'feedback' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.8rem', borderRadius: '8px', border: '1px solid #d1dbe5' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0B3C5D' }}>Submit Village Feedback</h3>
            <form onSubmit={handleFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={formLabel}>Village</label>
                <select value={newFeedback.village} onChange={(e) => setNewFeedback({ ...newFeedback, village: e.target.value })} style={formInput}>
                  <option value="Sivakasi">Sivakasi</option>
                  <option value="Thiruthangal">Thiruthangal</option>
                  <option value="Sattur">Sattur</option>
                </select>
              </div>
              <div>
                <label style={formLabel}>Satisfaction Rating (1 to 5 Stars)</label>
                <select value={newFeedback.rating} onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })} style={formInput}>
                  <option value={5}>★★★★★ (5/5) Excellent</option>
                  <option value={4}>★★★★☆ (4/5) Good</option>
                  <option value={3}>★★★☆☆ (3/5) Average</option>
                  <option value={2}>★★☆☆☆ (2/5) Needs Improvement</option>
                  <option value={1}>★☆☆☆☆ (1/5) Poor</option>
                </select>
              </div>
              <div>
                <label style={formLabel}>Your Comments / Suggestions</label>
                <textarea rows="3" required placeholder="Write your remarks on development works..." value={newFeedback.comment} onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })} style={{ ...formInput, resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ padding: '0.75rem', background: '#0B3C5D', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Feedback</button>
            </form>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '1.8rem', borderRadius: '8px', border: '1px solid #d1dbe5' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0B3C5D' }}>Recent Citizen Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {feedbacks.map(f => (
                <div key={f.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#0B3C5D' }}>{f.village}</span>
                    <span style={{ color: '#D9B310' }}>{'★'.repeat(f.rating)}</span>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#333' }}>"{f.comment}"</p>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>By: {f.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Taluk Officer Home Page
function TalukOfficerHome() {
  const { projects, setProjects, complaints } = useAuth();

  const [activeSection, setActiveSection] = useState(null);

  const setStatus = (id, newStatus) => {
    setProjects(
      projects.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <div style={containerStyle}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0B3C5D', margin: 0 }}>
          Taluk Officer Command Dashboard
        </h2>

        <p
          style={{
            color: '#555',
            margin: '3px 0 0 0',
            fontSize: '0.9rem'
          }}
        >
          Project approvals, sanctions, and development oversight for Sivakasi,
          Thiruthangal & Sattur
        </p>
      </div>

      {/* Three Monitoring Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}
      >
        <button
          onClick={() => setActiveSection(null)}
          style={{
            ...smallBtn,
            backgroundColor: '#0B3C5D',
            padding: '0.7rem 1.2rem'
          }}
        >
          Project Monitoring
        </button>

        <button
          onClick={() => setActiveSection('budget')}
          style={{
            ...smallBtn,
            backgroundColor: '#2E7D32',
            padding: '0.7rem 1.2rem'
          }}
        >
          Budget Monitoring
        </button>

        <button
          onClick={() => setActiveSection('grievance')}
          style={{
            ...smallBtn,
            backgroundColor: '#C62828',
            padding: '0.7rem 1.2rem'
          }}
        >
          Grievance Monitoring
        </button>
      </div>

      {/* Budget Monitoring */}
      {activeSection === 'budget' && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #d1dbe5',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <h3
            style={{
              color: '#2E7D32',
              marginTop: 0
            }}
          >
            Budget Monitoring
          </h3>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #E0E7ED',
                  fontSize: '0.85rem',
                  color: '#555'
                }}
              >
                <th style={{ padding: '0.75rem' }}>
                  Project Name
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Village
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Budget
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Progress
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map(p => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '0.85rem'
                  }}
                >
                  <td
                    style={{
                      padding: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {p.name}
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    {p.village}
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    {p.budget}
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    {p.progress}%
                  </td>

                  <td style={{ padding: '0.75rem' }}>
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grievance Monitoring */}
      {activeSection === 'grievance' && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #d1dbe5',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <h3
            style={{
              color: '#C62828',
              marginTop: 0
            }}
          >
            Grievance Monitoring
          </h3>

          {/* Grievance Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={metricCard}>
              <span style={metricLabel}>
                Total Grievances
              </span>

              <h3 style={metricVal}>
                {complaints.length}
              </h3>
            </div>

            <div style={metricCard}>
              <span style={metricLabel}>
                Unresolved
              </span>

              <h3
                style={{
                  ...metricVal,
                  color: '#C62828'
                }}
              >
                {
                  complaints.filter(
                    c => c.status !== 'Resolved'
                  ).length
                }
              </h3>
            </div>

            <div style={metricCard}>
              <span style={metricLabel}>
                Resolved
              </span>

              <h3
                style={{
                  ...metricVal,
                  color: '#2E7D32'
                }}
              >
                {
                  complaints.filter(
                    c => c.status === 'Resolved'
                  ).length
                }
              </h3>
            </div>
          </div>

          {/* Citizen Complaints */}
          <h4
            style={{
              color: '#0B3C5D',
              marginBottom: '1rem'
            }}
          >
            Citizen Complaints
          </h4>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #E0E7ED',
                  fontSize: '0.85rem',
                  color: '#555'
                }}
              >
                <th style={{ padding: '0.75rem' }}>
                  Complaint ID
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Citizen
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Village
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Category
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Complaint
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Status
                </th>

                <th style={{ padding: '0.75rem' }}>
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {complaints.length > 0 ? (
                complaints.map(c => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '0.85rem'
                    }}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      {c.id}
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      {c.citizenEmail}
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      {c.village}
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      {c.category}
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      {c.issue}
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          backgroundColor:
                            c.status === 'Resolved'
                              ? '#E8F5E9'
                              : '#FFEBEE',
                          color:
                            c.status === 'Resolved'
                              ? '#2E7D32'
                              : '#C62828'
                        }}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      {c.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: '1.5rem',
                      textAlign: 'center',
                      color: '#777'
                    }}
                  >
                    No citizen complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Proposals & Approvals */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #d1dbe5',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            color: '#0B3C5D'
          }}
        >
          Project Proposals & Approvals (Taluk Level)
        </h3>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '2px solid #E0E7ED',
                fontSize: '0.85rem',
                color: '#555'
              }}
            >
              <th style={{ padding: '0.75rem' }}>
                Project Name
              </th>

              <th style={{ padding: '0.75rem' }}>
                Village
              </th>

              <th style={{ padding: '0.75rem' }}>
                Sanction Estimate
              </th>

              <th style={{ padding: '0.75rem' }}>
                Current Milestone
              </th>

              <th style={{ padding: '0.75rem' }}>
                Status
              </th>

              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right'
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map(p => (
              <tr
                key={p.id}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '0.85rem'
                }}
              >
                <td
                  style={{
                    padding: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {p.name}
                </td>

                <td style={{ padding: '0.75rem' }}>
                  {p.village}
                </td>

                <td style={{ padding: '0.75rem' }}>
                  {p.budget}
                </td>

                <td style={{ padding: '0.75rem' }}>
                  {p.progress}%
                </td>

                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      backgroundColor:
                        p.status === 'Approved'
                          ? '#E8F5E9'
                          : p.status === 'Rejected'
                          ? '#FFEBEE'
                          : '#FFF3E0',
                      color:
                        p.status === 'Approved'
                          ? '#2E7D32'
                          : p.status === 'Rejected'
                          ? '#C62828'
                          : '#E65100'
                    }}
                  >
                    {p.status}
                  </span>
                </td>

                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right'
                  }}
                >
                  {p.status === 'Pending Approval' ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '0.4rem'
                      }}
                    >
                      <button
                        onClick={() =>
                          setStatus(p.id, 'Approved')
                        }
                        style={{
                          ...smallBtn,
                          backgroundColor: '#2E7D32'
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          setStatus(p.id, 'Rejected')
                        }
                        style={{
                          ...smallBtn,
                          backgroundColor: '#C62828'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      style={{
                        color: '#888',
                        fontSize: '0.8rem'
                      }}
                    >
                      Decision Recorded
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Four Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={metricCard}>
          <span style={metricLabel}>
            Jurisdiction Villages
          </span>

          <h3 style={metricVal}>
            3 Units
          </h3>
        </div>

        <div style={metricCard}>
          <span style={metricLabel}>
            Pending Project Proposals
          </span>

          <h3
            style={{
              ...metricVal,
              color: '#E65100'
            }}
          >
            {
              projects.filter(
                p => p.status === 'Pending Approval'
              ).length
            }
          </h3>
        </div>

        <div style={metricCard}>
          <span style={metricLabel}>
            Active Infrastructure Works
          </span>

          <h3
            style={{
              ...metricVal,
              color: '#2E7D32'
            }}
          >
            {
              projects.filter(
                p => p.status === 'Approved'
              ).length
            }
          </h3>
        </div>

        <div style={metricCard}>
          <span style={metricLabel}>
            Unresolved Grievances
          </span>

          <h3
            style={{
              ...metricVal,
              color: '#C62828'
            }}
          >
            {
              complaints.filter(
                c => c.status !== 'Resolved'
              ).length
            }
          </h3>
        </div>
      </div>

    </div>
  );
}

// 3. Panchayat Officer Home Page
function PanchayatOfficerHome() {
  const { projects, setProjects, complaints, setComplaints } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 1);
  const [progressVal, setProgressVal] = useState(50);
  const [photoUrl, setPhotoUrl] = useState('');

  const updateProjectProgress = (e) => {
    e.preventDefault();
    setProjects(projects.map(p => {
      if (p.id === Number(selectedProjectId)) {
        return {
          ...p,
          progress: Number(progressVal),
          photo: photoUrl.trim() || p.photo,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
    alert('Project progress and site photo updated on the public portal.');
  };

  const resolveComplaint = (id, remarks) => {
    const promptRemarks = prompt('Enter officer resolution remarks:', remarks || 'Inspected and repaired.');
    if (promptRemarks === null) return;

    setComplaints(complaints.map(c => {
      if (c.id === id) {
        return { ...c, status: 'Resolved', officerRemarks: promptRemarks };
      }
      return c;
    }));
  };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0B3C5D', margin: 0 }}>Panchayat Officer Work Console</h2>
        <p style={{ color: '#555', margin: '3px 0 0 0', fontSize: '0.9rem' }}>Review citizen grievances and update live progress milestones for Sivakasi, Thiruthangal & Sattur</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Complaints Inbox */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #d1dbe5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0B3C5D' }}>1. Citizen Complaints Inbox</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map(c => (
              <div key={c.id} style={{ border: '1px solid #E0E7ED', borderRadius: '6px', padding: '0.9rem', backgroundColor: c.status === 'Resolved' ? '#F9FBF9' : '#FFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#0B3C5D' }}>#{c.id} - {c.village} ({c.category})</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: c.status === 'Resolved' ? '#2E7D32' : '#E65100' }}>{c.status}</span>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#333' }}><b>Issue:</b> {c.issue}</p>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  Reported by: <i>{c.citizenEmail}</i> on {c.date}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#444' }}><b>Remarks:</b> {c.officerRemarks}</span>
                  {c.status !== 'Resolved' && (
                    <button onClick={() => resolveComplaint(c.id, c.officerRemarks)} style={{ ...smallBtn, backgroundColor: '#0B3C5D' }}>
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>npm 
        </div>

        {/* Update Projects */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #d1dbe5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0B3C5D' }}>2. Update Project Progress & Photos</h3>
          <form onSubmit={updateProjectProgress} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={formLabel}>Select Development Project</label>
              <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} style={formInput}>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.village} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={formLabel}>Current Milestone Progress ({progressVal}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={formLabel}>Site Progress Photo URL</label>
              <input
                type="url"
                placeholder="https://example.com/site-photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                style={formInput}
              />
            </div>

            <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Publish Progress Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Styling Constants
const containerStyle = {
  maxWidth: '1240px',
  margin: '1.8rem auto',
  padding: '0 1.8rem',
};

const formLabel = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#1D2731',
  marginBottom: '0.35rem',
};

const formInput = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '4px',
  border: '1px solid #CBD5E1',
  boxSizing: 'border-box',
  fontSize: '0.9rem',
  backgroundColor: '#FFFFFF',
};

const roleSelectBtn = {
  padding: '0.65rem 0.4rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '700',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s ease',
};

const tabBtn = {
  border: 'none',
  padding: '0.55rem 1.1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85rem',
};


const metricCard = {
  backgroundColor: '#FFFFFF',
  padding: '1.1rem',
  borderRadius: '8px',
  border: '1px solid #D1DBE5',
  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
};

const metricLabel = {
  fontSize: '0.8rem',
  color: '#64748B',
  fontWeight: '600',
};

const metricVal = {
  margin: '0.35rem 0 0 0',
  fontSize: '1.35rem',
  color: '#0B3C5D',
};

const smallBtn = {
  color: '#fff',
  border: 'none',
  padding: '0.38rem 0.8rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '600',
  cursor: 'pointer',
};



const handleLogin = async (e) => {
  e.preventDefault();

  // Basic validation check
  if (!emailOrEmployeeId || !password) {
    alert('Please enter both identifier and password');
    return;
  }

  try {
    // 1. Call Node.js backend
    const result = await loginApi(emailOrEmployeeId, password);

    if (result && (result.success || result.token)) {
      // 2. Extract user data and token from backend response
      const authenticatedUser = {
        name: result.user?.full_name || result.user?.name || emailOrEmployeeId,
        email: result.user?.email || emailOrEmployeeId,
        role: result.user?.role || ROLES.TALUK_OFFICER,
        token: result.token,
      };

      // 3. Save auth token and user state
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      login(authenticatedUser);

      alert('Login successful!');

      // 4. Redirect based on role or to home/dashboard
      if (authenticatedUser.role === ROLES.TALUK_OFFICER) {
        navigate('/taluk');
      } else if (authenticatedUser.role === ROLES.PANCHAYAT_OFFICER) {
        navigate('/panchayat');
      } else {
        navigate('/citizen');
      }
    } else {
      alert(result.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Server connection error: ' + error.message);
  }
};

