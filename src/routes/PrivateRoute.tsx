import { Navigate, Route, Routes } from 'react-router-dom'

import { LayoutPageRouter } from './Layout'
import { RoleRoute } from './RoleRoute'
import Profesores from '@/app/pages/profesores/Profesores'
import { FormProfesor } from '@/app/pages/profesores/FormProfesor'
import Asignaturas from '@/app/pages/asignaturas/Asignaturas'
import { FormAsignatura } from '@/app/pages/asignaturas/FormAsignatura'
import Periodo from '@/app/pages/periodo/Periodo'
import { FormPeriodo } from '@/app/pages/periodo/FormPeriodo'

// Simulated user role - In a real app, this would come from your auth context/state
//const userRole: Role = 'admin'

export const PrivateRoutes = () => {
    return (
        <LayoutPageRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route
                    path="/dashboard"
                    element={
                        <RoleRoute roles={['Vicerrector', 'Director de area', 'Docente']}>
                            <div>Dashboard</div>
                        </RoleRoute>
                    }
                />

                <Route
                    path="/profesores"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <Profesores />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/profesores/nuevo"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <FormProfesor />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/profesores/editar"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <FormProfesor />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/asignaturas"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <Asignaturas />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/asignaturas/nuevo"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <FormAsignatura />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/periodo-lectivo"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <Periodo />
                        </RoleRoute>
                    }
                />
                <Route
                    path="/periodo-lectivo/nuevo"
                    element={
                        <RoleRoute roles={['Vicerrector']}>
                            <FormPeriodo />
                        </RoleRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </LayoutPageRouter>
    )
}