import { Navigate, Outlet } from "react-router-dom"

interface Props {
    isAllowed: boolean
    redirectTo?: string
    children?: React.ReactNode
}

export const ProtectedRoute = ({
    isAllowed,
    children,
    redirectTo = "/login",
}: Props) => {
    if (!isAllowed) {
        return <Navigate to={redirectTo} replace />
    }

    return children ? <>{children}</> : <Outlet />
}