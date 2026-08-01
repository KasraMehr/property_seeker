export const handleApiError = (error) => {
  if (!error.response) {
    return { type: "NETWORK", message: "connection failed" };
  }
  const { status, data } = error.response;
  if (status === 401) return { type: "AUTH", message: data?.message || "unauthorized" };
  if (status === 403) return { type: "PERMISSION", message: data?.message || "forbidden" };
  if (status === 404) return { type: "NOT_FOUND", message: data?.detail || "not found" };
  if (status === 400) return { type: "VALIDATION", message: data };
  return { type: "SERVER", message: data?.message || "server error" };
};