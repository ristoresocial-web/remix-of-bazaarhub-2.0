import { Navigate } from "react-router-dom";

// Legacy redirect — unified auth lives at /auth
const SellerLoginPage = () => <Navigate to="/auth" replace />;

export default SellerLoginPage;
