export type Role = 'Vicerrector' | 'Director de area' | 'Docente' 

export interface User {
    name: string
    email: string
    role: Role

}

export type AuthStatus = 'checking' | 'authenticated' | 'no-authenticated'

export interface AuthState {
    status: AuthStatus
    user: User | null
}