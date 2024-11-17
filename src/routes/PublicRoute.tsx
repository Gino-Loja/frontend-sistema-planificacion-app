import { LoginForm } from '@/components/login-form'
import { Navigate, Route, Routes } from 'react-router-dom'

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}