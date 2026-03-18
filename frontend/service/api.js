
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`

async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || `HTTP error ${response.status}`;
    throw new Error(errorMessage);
  }
  
  return data;
}

export const getProfile = async () => {
  const res = await fetch(`${API_BASE}/profile`);
  return handleResponse(res);
};

export const getSkills = async () => {
  const res = await fetch(`${API_BASE}/skills`);
  return handleResponse(res);
};

export const getProjects = async () => {
  const res = await fetch(`${API_BASE}/projects`);
  return handleResponse(res);
};

export const getBlogs = async () => {
  const res = await fetch(`${API_BASE}/blogs`);
  return handleResponse(res);
};

export const getTestimonials = async () => {
  const res = await fetch(`${API_BASE}/testimonials`);
  return handleResponse(res);
};
export const getSocialLinks = async () => {
  const res = await fetch(`${API_BASE}/social-links`);
  return handleResponse(res);
};
export const getExperiences = async () => {
  const res = await fetch(`${API_BASE}/experiences`);
  return handleResponse(res);
};

export const sendContactMessage = async (data) => {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return handleResponse(res);
};

export const trackEvent = async (event) => {
  const res = await fetch(`${API_BASE}/track-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(event)
  });

  return handleResponse(res);
};


export const getPortfolioData = async () => {

  const [
    profile,
    skills,
    projects,
    blogs,
    testimonials,
    SocialLinks,
    experiences,
  ] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getBlogs(),
    getTestimonials(),
    getSocialLinks(),
    getExperiences()
  ]);

  return {
    profile,
    skills,
    projects,
    blogs,
    testimonials,
    SocialLinks,
    experiences
  };

};