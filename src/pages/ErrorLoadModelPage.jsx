import { Link } from "react-router-dom"


export const ErrorLoadModelPage = () => {
    return (
        <>
            <main
                className="min-h-screen flex flex-col justify-start lg:justify-center gap-5"
            >
                <h1
                    className="text-error font-bold text-4xl text-center mt-10 lg:mt0"
                >
                    Error al cargar la aplicación
                </h1>

                <Link
                    to={`/`}
                    className="font-bold text-base text-secondary hover:text-secondary-focus text-center"
                >
                    Intentar de nuevo
                </Link>
            </main>
        </>
    )
}
