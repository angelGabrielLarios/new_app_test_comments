import { createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, EditProfilePage, RecoverPasswordPage, ErrorLoadModelPage } from "../pages";
import { ProtectedRoute, PublicRoute } from "../components";


export const router = createBrowserRouter([
    {
        path: '/*',
        element: <ProtectedRoute
            toredirect={`/auth/login`}
        >
            <HomePage />
        </ProtectedRoute>
    },
    {
        path: '/error-load-model',
        element: <ProtectedRoute
            toredirect={`/auth/login`}
        >
            <ErrorLoadModelPage />
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
        path: '/auth/recover-password',
        element: <PublicRoute
            toredirect={`/`}
        >
            <RecoverPasswordPage />
        </PublicRoute>
    },

])
