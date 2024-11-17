import { Navigate } from 'react-router-dom'
import { Role } from '@/types/auth.types'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

interface Props {
    children: React.ReactNode
    roles: Role[]
}

export const RoleRoute = ({ children, roles }: Props) => {
    // In a real app, get the user's role from your auth context/state

    const userRole = useContext(AuthContext)?.user?.role;
    //console.log(userRole)

    if (!userRole || !roles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>
}