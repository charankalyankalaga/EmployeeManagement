// src/api.js
const API_BASE = 'https://localhost:7092';

// REGISTER (AccountController -> POST api/account/register)
export async function registerUser(body) {
  const res = await fetch(`${API_BASE}/api/Account/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }

  return await res.text();
}

// LOGIN
export async function login(userName, password) {
  const res = await fetch(`${API_BASE}/api/Account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return await res.json();
}

// GET EMPLOYEES
export async function getEmployees(token) {
  const res = await fetch(`${API_BASE}/api/Account/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load employees");
  }

  return await res.json();
}

// GET ATTENDANCE
export async function getAttendanceByEmployee(id, token) {
  const res = await fetch(`${API_BASE}/api/Attendance/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load attendance");
  }

  return await res.json();
}

// MARK ATTENDANCE
export async function markAttendance(employeeId, date, status, token) {
  const res = await fetch(`${API_BASE}/api/Attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ employeeId, date, status }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to mark attendance");
  }

  return await res.text();
}
