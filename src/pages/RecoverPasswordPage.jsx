import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { AlertErrorForm, ModalError, ModalInfo } from "../components"
import { Link } from "react-router-dom"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { messagesErrorFirebase } from "../helpers/messagesErrorFirebase"



export const RecoverPasswordPage = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [errorCredentials, setErrorCredentials] = useState('')

    const ModalErrorRef = useRef(null)

    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const ModalInfoRef = useRef(null)

    const onSubmitForm = async ({ email }) => {

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email)
            ModalInfoRef.current.showModal()

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === messagesErrorFirebase.errorCredentials) {
                setErrorCredentials('Tu correo electrónico o contraseña son incorrectas');
                ModalErrorRef.current.showModal();
            }

            console.error({
                errorCode,
                errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <main
                className="flex flex-col min-h-screen items-center justify-start lg:justify-center"
            >
                <header
                    className="text-center pb-6 pt-6 lg:pt-0"
                >
                    <h1
                        className="text-primary font-bold text-2xl lg:text-4xl mb-2 lg:mb-4"
                    >
                        Recuperar <span className="text-secondary">Contraseña</span>
                    </h1>

                </header>

                <form
                    className="w-full lg:w-6/12 py-12 px-6 border border-secondary rounded-xl shadow-lg shadow-secondary space-y-6"
                    onSubmit={handleSubmit(onSubmitForm)}

                >

                    <div className="">
                        <article className="flex items-center gap-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#570df8"></path> </g></svg>


                            <input
                                id="emal"
                                type="email"
                                {...register('email', {
                                    required: 'Este campo es obligatorio',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Este NO es un correo electrónico válido'
                                    }
                                })}
                                placeholder="Correo Electrónico"
                                className="input input-bordered input-primary block w-full placeholder:text-xs text-xs lg:text-sm lg:placeholder:text-sm"
                            />
                        </article>

                        {
                            errors?.email?.type === "required"
                                ? <AlertErrorForm>
                                    {errors.email.message}
                                </AlertErrorForm>
                                : null

                        }
                    </div>

                    <ModalError
                        ModalErrorRef={ModalErrorRef}
                        message={errorCredentials}
                    />


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-secondary flex items-center gap-2 w-full text-xs lg:text-sm">
                        Recuperar Contraseña
                        {
                            isLoading
                                ? <span className="loading loading-bars loading-md"></span>
                                : null
                        }
                    </button>


                    <p className="text-center text-sm lg:text-sm">¿Ya tienes una cuenta? <Link className="text-secondary font-bold" to={'/auth/login'}>Iniciar Sesión</Link></p>
                    <p className="text-center text-sm lg:text-sm">¿No tienes una cuenta? <Link className="text-secondary font-bold" to={'/auth/register'}>Create una cuenta</Link></p>

                </form>
            </main >
            <ModalInfo
                ModalInfoRef={ModalInfoRef}
                message={`Ya se envio un correo para la recuperación de contraseña`}
            />
        </>
    )
}

