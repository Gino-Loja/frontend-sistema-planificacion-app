import { Role } from '@/types/auth.types'

interface RouteConfig {
    path: string
    title: string
    roles: Role[]
}

export const ROUTE_PERMISSIONS: Record<string, RouteConfig> = {
    '/dashboard': {
        path: '/dashboard',
        title: 'Dashboard',
        roles: ['Vicerrector']
    },
    '/profesores': {
        path: '/profesores',
        title: 'Profesores',
        roles: ['Vicerrector']
    },
    '/profesores/nuevo': {
        path: '/profesores/nuevo',
        title: 'Nuevo Profesor',
        roles: ['Vicerrector']
    },
    '/asignaturas': {
        path: '/asignaturas',
        title: 'Asignaturas',
        roles: ['Vicerrector', 'Docente']
    },
    '/asignaturas/nuevo': {
        path: '/asignaturas/nuevo',
        title: 'Asignaturas',
        roles: ['Vicerrector']
    },
    '/periodo-lectivo': {
        path: '/periodo-lectivo',
        title: 'Periodo Lectivo',
        roles: ['Vicerrector']
    },
    '/periodo-lectivo/nuevo': {
        path: '/periodo-lectivo/nuevo',
        title: 'Periodo Lectivo',
        roles: ['Vicerrector']
    }
}

export const getAuthorizedRoutes = (userRole: Role): RouteConfig[] => {
    return Object.values(ROUTE_PERMISSIONS).filter(route => 
        route.roles.includes(userRole)
    )
}

export const isRouteAuthorized = (path: string, userRole: Role): boolean => {
    const route = ROUTE_PERMISSIONS[path]
    return route ? route.roles.includes(userRole) : false
}