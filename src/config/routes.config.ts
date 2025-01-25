import { Role } from '@/types/auth.types';
import DashboardPrincipal from '@/app/pages/dashboard/DashboardPrincipal';
import Profesores from '@/app/pages/profesores/Profesores';
import Asignaturas from '@/app/pages/asignaturas/Asignaturas';
import Periodo from '@/app/pages/periodo/Periodo';
import AsignarPlanificacion from '@/app/pages/planificaciones/AsignarPlanificacion';
import PlanificacionesProfesores from '@/app/pages/planificaciones/Docentes/Planificaciones';
import PlanificacionesAsignadoProfesor from '@/app/pages/planificaciones/asignado/PlanificacionesProfesor';
import AsignarProfesorArea from '@/app/pages/areas/areas-profesor/AsignarProfesorArea';
import MisPlanificaciones from '@/app/pages/profesores-planificaciones/MisPlanificaciones';
import DashboardAdmin from '@/app/pages/dashboard/dasboardAdmin';
import { FormProfesor } from '@/app/pages/profesores/FormProfesor';
import { FormAsignatura } from '@/app/pages/asignaturas/FormAsignatura';
import { FormPeriodo } from '@/app/pages/periodo/FormPeriodo';

interface RouteConfig {
    path: string;
    title: string;
    roles: Role[];
    component: React.ComponentType;
}

export const ROUTES: RouteConfig[] = [
    {
        path: '/dashboard',
        title: 'Dashboard Principal',
        roles: ['Vicerrector', 'Director de area', 'Docente'],
        component: DashboardPrincipal,
    },
    {
        path: '/dashboard-admin',
        title: 'Dashboard Admin',
        roles: ['Vicerrector', 'Director de area'],
        component: DashboardAdmin,
    },
    {
        path: '/dashboard-admin/profesores',
        title: 'Profesores',
        roles: ['Vicerrector'],
        component: Profesores,
    },
    {
        path: '/dashboard-admin/profesores/nuevo',
        title: 'Nuevo Profesor',
        roles: ['Vicerrector'],
        component: FormProfesor,
    },
    {
        path: '/dashboard-admin/profesores/editar',
        title: 'Editar Profesor',
        roles: ['Vicerrector'],
        component: FormProfesor,
    },
    {
        path: '/dashboard-admin/asignaturas',
        title: 'Asignaturas',
        roles: ['Vicerrector'],
        component: Asignaturas,
    },
    {
        path: '/dashboard-admin/asignaturas/nuevo',
        title: 'Nueva Asignatura',
        roles: ['Vicerrector'],
        component: FormAsignatura,
    },
    {
        path: '/dashboard-admin/asignaturas/editar',
        title: 'Editar Asignatura',
        roles: ['Vicerrector'],
        component: FormAsignatura,
    },
    {
        path: '/dashboard-admin/periodo-lectivo',
        title: 'Periodo Lectivo',
        roles: ['Vicerrector'],
        component: Periodo,
    },
    {
        path: '/dashboard-admin/periodo-lectivo/nuevo',
        title: 'Nuevo Periodo Lectivo',
        roles: ['Vicerrector'],
        component: FormPeriodo,
    },
    {
        path: '/dashboard-admin/periodo-lectivo/editar',
        title: 'Editar Periodo Lectivo',
        roles: ['Vicerrector'],
        component: FormPeriodo,
    },
    {
        path: '/dashboard-admin/asignar-planificacion',
        title: 'Asignar Planificación',
        roles: ['Vicerrector',  'Director de area'],
        component: AsignarPlanificacion,
    },
    {
        path: '/dashboard-admin/planificaciones-profesores',
        title: 'Planificaciones Profesores',
        roles: ['Vicerrector', 'Director de area'],
        component: PlanificacionesProfesores,
    },
    {
        path: '/dashboard-admin/planificaciones-profesores/profesor',
        title: 'Planificaciones Profesor',
        roles: ['Vicerrector', 'Director de area', 'Docente'],
        component: PlanificacionesAsignadoProfesor,
    },
    {
        path: '/dashboard-admin/planificaciones-profesores/editar',
        title: 'Planificaciones Profesor',
        roles: ['Vicerrector',],
        component: AsignarPlanificacion,
    },
    {
        path: '/dashboard-admin/planificaciones-profesores/eliminar',
        title: 'Planificaciones Profesor',
        roles: ['Vicerrector',],
        component: AsignarPlanificacion,
    },
    
    {
        path: '/dashboard/mis-planificaciones',
        title: 'Mis Planificaciones',
        roles: ['Vicerrector', 'Director de area', 'Docente'],
        component: MisPlanificaciones,
    },
    {
        path: '/dashboard/mis-planificaciones/profesor',
        title: 'Planificaciones Profesor',
        roles: ['Vicerrector', 'Director de area', 'Docente'],
        component: PlanificacionesAsignadoProfesor,
    },
    {
        path: '/dashboard-admin/areas',
        title: 'Areas',
        roles: ['Vicerrector'],
        component: AsignarProfesorArea,
    },
    {
        path: '/dashboard-admin/areas/profesor/nuevo',
        title: 'Nuevo Profesor en Area',
        roles: ['Vicerrector'],
        component: AsignarProfesorArea,
    },
    {
        path: '/dashboard-admin/areas/profesor/editar',
        title: 'Editar Profesor en Area',
        roles: ['Vicerrector'],
        component: AsignarProfesorArea,
    },
];

export const getAuthorizedRoutes = (userRole: Role): RouteConfig[] => {
    return ROUTES.filter(route => route.roles.includes(userRole));
};

export const isRouteAuthorized = (path: string, userRole: Role): boolean => {
    const route = ROUTES.find(route => route.path === path);
    return route ? route.roles.includes(userRole) : false;
};