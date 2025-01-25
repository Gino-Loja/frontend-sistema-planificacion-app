import { Routes, Route } from 'react-router-dom';
import { LayoutPageRouter } from './Layout';
import { RoleRoute } from './RoleRoute';
import { ROUTES } from '@/config/routes.config';

export const PrivateRoutes = () => {
    return (
        <LayoutPageRouter>
            <Routes>
                {ROUTES.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <RoleRoute roles={route.roles}>
                                <route.component />
                            </RoleRoute>
                        }
                    />
                ))}
            </Routes>
        </LayoutPageRouter>
    );
};