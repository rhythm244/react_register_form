import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet /> //ถ้า role มีตรงกับ route ที่ส่งมาก็ return outlet คือ child ของ Route ได้เลย
            : auth?.user
            //แต่ถ้ามันมี user แสดงว่า user คนนั้นไม่มีสิทธิ์เข้าถึง route นี้ก็ show unauthorized
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                //แต่ถ้าไม่มี user แสดงว่ายังไม่ได้ login
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;