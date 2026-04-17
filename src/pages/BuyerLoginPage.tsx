import { Navigate } from "react-router-dom";

// Legacy redirect — unified auth lives at /auth
const BuyerLoginPage = () => <Navigate to="/auth" replace />;

export default BuyerLoginPage;
