import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { PrivateRoutes } from "./PrivateRoute"
import { PublicRoutes } from "./PublicRoute"
import { RootLayout } from "./rootLayout"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"


type Status = "checking" | "authenticated" | "no-authenticated"

export const AppRouter = () => {
    const status: Status | undefined = useContext(AuthContext)?.status 



    const isAuthenticated = status === 'authenticated'

    return (
        

            <RootLayout>

                <BrowserRouter>
                    <Routes>
                        <Route element={<ProtectedRoute isAllowed={!isAuthenticated} redirectTo="/" />}>
                            <Route path="/login" element={<PublicRoutes />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login" />}>
                            <Route path="/*" element={<PrivateRoutes />} />
                        </Route>
                    </Routes>
                </BrowserRouter>


            </RootLayout>
      

    )
}