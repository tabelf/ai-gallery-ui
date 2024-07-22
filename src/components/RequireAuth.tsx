import {useSelector} from "react-redux";

function RequireAuth({allowedRoles, children}) {
    const userInfo = useSelector(state => state.user.userInfo);
    console.log("RequireAuth userInfo = ", userInfo);
    if (!allowedRoles.includes(userInfo.role)) {
        return <></>;
    }
    return children;
}

export default RequireAuth;
