import {createBrowserRouter} from "react-router-dom";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import User from "@/pages/User";
import Login from "@/pages/Login";
import Setting from "@/pages/Setting";
import Task from "@/pages/Task";
import Analysis from "@/pages/Analysis";
import Detail from "@/pages/Detail";
import RequireAuth from "@/components/RequireAuth";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        children: [
            {
                index: true,
                element: <>
                    <RequireAuth allowedRoles={['ADMIN']}><Analysis/></RequireAuth>
                    <RequireAuth allowedRoles={['USER']}><Work/></RequireAuth>
                </>
            },
            {
                path: '/analyse',
                element: <RequireAuth allowedRoles={['ADMIN']}><Analysis/></RequireAuth>
            },
            {
                path: '/work',
                element: <Work/>
            },
            {
                path: '/user',
                element: <RequireAuth allowedRoles={['ADMIN']}><User/></RequireAuth>
            },
            {
                path: '/setting',
                element: <Setting/>
            },
            {
                path: '/task',
                element: <Task/>
            },
            {
                path: '/detail',
                element: <Detail/>
            }
        ]
    },
    {
        path: '/login',
        element: <Login/>
    }
]);

export default router;
