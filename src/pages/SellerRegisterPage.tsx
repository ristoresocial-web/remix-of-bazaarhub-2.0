import { Navigate } from "react-router-dom";

// Legacy redirect — unified auth lives at /auth
const SellerRegisterPage = () => <Navigate to="/auth?tab=register&role=seller" replace />;

export default SellerRegisterPage;
