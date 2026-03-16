// API service for admin panel
const API_BASE = process.env.NEXT_PUBLIC_API_URL

// Helper to handle API responses
async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle different error formats based on your response structure
    const errorMessage = data.message || data.error || `HTTP error ${response.status}`;
    throw new Error(errorMessage);
  }
  
  return data;
}

// Get auth token
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

// API request wrapper with authentication
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    return handleResponse(response);
  } catch (err) {
    console.error('API Request Error:', err);
    throw new Error(err.message || 'Network error occurred');
  }
}

/* =============================
   AUTH
============================= */

// Admin Login
export async function adminLogin(credentials) {
  return apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// Create Admin (optional - for setup)
export async function createAdmin(adminData) {
  return apiRequest('/admin/createAdmin', {
    method: 'POST',
    body: JSON.stringify(adminData),
  });
}

/* =============================
   PROFILE
============================= */

export async function getProfile() {
  return apiRequest('/admin/profile');
}

export async function updateProfile(profileData) {
  return apiRequest('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

/* =============================
   PROJECTS
============================= */

export async function getProjects() {
  return apiRequest('/admin/projects');
}

export async function addProject(project) {
  return apiRequest('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
}

export async function updateProject(id, project) {
  return apiRequest(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id) {
  return apiRequest(`/admin/projects/${id}`, {
    method: 'DELETE',
  });
}

/* =============================
   SKILLS
============================= */

export async function getSkills() {
  return apiRequest('/admin/skills');
}

export async function addSkill(skill) {
  return apiRequest('/admin/skills', {
    method: 'POST',
    body: JSON.stringify(skill),
  });
}

export async function updateSkill(id, skill) {
  return apiRequest(`/admin/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(skill),
  });
}

export async function deleteSkill(id) {
  return apiRequest(`/admin/skills/${id}`, {
    method: 'DELETE',
  });
}

/* =============================
   BLOGS
============================= */

export async function getBlogs() {
  return apiRequest('/admin/blogs');
}

export async function addBlog(blog) {
  return apiRequest('/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(blog),
  });
}

export async function updateBlog(id, blog) {
  return apiRequest(`/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(blog),
  });
}

export async function deleteBlog(id) {
  return apiRequest(`/admin/blogs/${id}`, {
    method: 'DELETE',
  });
}

/* =============================
   TESTIMONIALS
============================= */

export async function getTestimonials() {
  return apiRequest('/admin/testimonials');
}

export async function addTestimonial(testimonial) {
  return apiRequest('/admin/testimonials', {
    method: 'POST',
    body: JSON.stringify(testimonial),
  });
}

export async function deleteTestimonial(id) {
  return apiRequest(`/admin/testimonials/${id}`, {
    method: 'DELETE',
  });
}

/* =============================
   CONTACT MESSAGES
============================= */

export async function getMessages() {
  return apiRequest('/admin/messages');
}

export async function deleteMessage(id) {
  return apiRequest(`/admin/messages/${id}`, {
    method: 'DELETE',
  });
}


/* =============================
   SOCIAL LINKS
============================= */

export async function getSocialLinks() {
  return apiRequest('/admin/social-links');
}

export async function addSocialLink(link) {
  return apiRequest('/admin/social-links', {
    method: 'POST',
    body: JSON.stringify(link),
  });
}

export async function updateSocialLink(id, link) {
  return apiRequest(`/admin/social-links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(link),
  });
}

export async function deleteSocialLink(id) {
  return apiRequest(`/admin/social-links/${id}`, {
    method: 'DELETE',
  });
}

export const getExperiences = () =>
  fetch(`${API_BASE}/admin/experiences`).then(r => r.json());

export const addExperience = (data) =>
  fetch(`${API_BASE}/admin/experiences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const updateExperience = (id, data) =>
  fetch(`${API_BASE}/admin/experiences/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const deleteExperience = (id) =>
  fetch(`${API_BASE}/admin/experiences/${id}`, {
    method: "DELETE"
  }).then(r => r.json());