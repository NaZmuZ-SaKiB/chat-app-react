export const setCallStatus = (status: "idle" | "in-call") => {
  localStorage.setItem("call-status", status);
};

export const getCallStatus = () => {
  return localStorage.getItem("call-status") as "idle" | "in-call";
};
