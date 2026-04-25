import { useNavigate } from "react-router-dom";

export const useRoute = () => {
  const navigate = useNavigate();

  return (route) => navigate(route);
};