import { AuthState, AuthStatus, User } from '@/types/auth.types'
import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'

interface AuthContextType {
    status: AuthStatus
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

interface TokenResponse {
    access_token: string
    token_type: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [auth, setAuth] = useState<AuthState>({
        status: 'checking',
        user: null
    })

    useEffect(() => {
      
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        
        if (!token) {
            setAuth({
                status: 'no-authenticated',
                user: null
            })
            return
        }

        try {
            const response = await fetch('http://localhost:8000/auth/users/me/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Invalid token')
            }

            const user = await response.json()
            setAuth({
                status: 'authenticated',
                user: {
                    name: user.nombre,
                    email: user.email,
                    role: user.rol
                }
            })
        } catch (error) {
            localStorage.removeItem('token')
            setAuth({
                status: 'no-authenticated',
                user: null
            })
        }
    }

    const login = async (email: string, password: string) => {
        try {
            // Create form data for token endpoint
            const formData = new FormData()
            formData.append('username', email)
            formData.append('password', password)

            // Get token
            const tokenResponse = await fetch('http://localhost:8000/auth/token', {
                method: 'POST',
                body: formData
            })

            if (!tokenResponse.ok) {
                throw new Error('Invalid credentials')
            }

            const { access_token }: TokenResponse = await tokenResponse.json()
            
            // Store token
            localStorage.setItem('token', access_token)

            // Get user data
            const userResponse = await fetch('http://localhost:8000/auth/users/me/', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if (!userResponse.ok) {
                throw new Error('Failed to get user data')
            }

            const userData = await userResponse.json()

            // Update auth state
            setAuth({
                status: 'authenticated',
                user: {
                    name: userData.nombre,
                    email: userData.email,
                    role: userData.rol
                }
            })
        } catch (error) {
            localStorage.removeItem('token')
            setAuth({
                status: 'no-authenticated',
                user: null
            })
            throw new Error('Authentication failed')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setAuth({
            status: 'no-authenticated',
            user: null
        })
    }

    return (
        <AuthContext.Provider value={{
            status: auth.status,
            user: auth.user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}