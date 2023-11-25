import { createBrowserRouter } from "react-router-dom";

import { VerifyEmailPage, HomePage, LoginPage, RegisterPage, EditProfilePage } from "../pages";
import { ProtectedRoute, PublicRoute } from "../components";




export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute
            toredirect={`/auth/login`}
        >
            <HomePage />
        </ProtectedRoute>
    },
    {
        path: '/edit-profile',
        element: <ProtectedRoute
            toredirect={`/auth/login`}
        >
            <EditProfilePage />
        </ProtectedRoute>
    },
    {
        path: '/auth/login',
        element: <PublicRoute
            toredirect={`/`}
        >
            <LoginPage />
        </PublicRoute>
    },

    {
        path: '/auth/*',
        element: <PublicRoute
            toredirect={`/`}
        >
            <LoginPage />
        </PublicRoute>
    },
    {
        path: '/auth/register',
        element: <PublicRoute
            toredirect={`/`}
        >
            <RegisterPage />
        </PublicRoute>
    },

    {
        path: '/auth/verify-email',
        element: <VerifyEmailPage />
    }
])