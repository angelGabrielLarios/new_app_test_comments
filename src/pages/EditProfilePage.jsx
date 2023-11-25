import { useForm } from "react-hook-form"
import { AlertErrorForm } from "../components"
import { useDispatch, useSelector } from 'react-redux'
import { doc, updateDoc } from "firebase/firestore"
import { db, getInfoUser } from "../firebase"
import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../store/auth/authSlice"

export const EditProfilePage = () => {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            name: user?.name,
            lastName: user?.lastName,
            phone: user?.phone,
        }
    })

    const [showToastPostCreated, setShowToastPostCreated] = useState(false)

    const [isLoadingUpdateProfile, setisLoadingUpdateProfile] = useState(false)


    const onSubmitUpdateProfile = async ({ name, lastName, phone }) => {
        try {
            setisLoadingUpdateProfile(true)
            const washingtonRef = doc(db, "users", user.uid);
            await updateDoc(washingtonRef, {
                name: name,
                lastName: lastName,
                phone: phone
            })
            const updateUser = await getInfoUser({ uid: user.uid })
            dispatch(login({
                ...user,
                name: updateUser.name,
                lastName: updateUser.lastName,
                phone: updateUser.phone,

            }))
            setShowToastPostCreated(true)
            setTimeout(() => {
                setShowToastPostCreated(false)
            }, 3000)

        } catch (error) {
            console.error(error)
            throw new Error(error)
        } finally {
            setisLoadingUpdateProfile(false)
        }
    }
    return (
        <>
            <main
                className="flex flex-col min-h-screen justify-start items-center lg:justify-center"
            >

                <h1

                    className="text-primary font-bold text-2xl lg:text-4xl mb-2 lg:mb-4 "
                >
                    Actualizar <span className="text-secondary">Perfil</span>
                </h1>
                <Link
                    to={`/`}
                    className="py-2 text-center mb-2 text-secondary font-bold hover:text-secondary-focus"
                >
                    Regresar a la página principal
                </Link>

                <form
                    className="w-full lg:w-6/12 py-6 px-6 border border-secondary rounded-xl shadow-lg shadow-secondary space-y-6"
                    onSubmit={handleSubmit(onSubmitUpdateProfile)}

                >
                    <section
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4"
                    >



                        <div className="">
                            <label className="label">
                                <span className="label-text text-secondary">Nombre (s):</span>
                            </label>

                            <input
                                disabled={isLoadingUpdateProfile}
                                id="name"
                                type="text"

                                {...register('name', {
                                    required: 'Este campo es obligatorio',
                                })}
                                placeholder="Nombre(s)"
                                className="input input-bordered input-primary block w-full placeholder:text-xs text-xs lg:text-sm lg:placeholder:text-sm"
                                maxLength={50}
                            />

                            {/* mensaje error */}
                            {
                                errors?.name?.type === "required"
                                    ? <AlertErrorForm>
                                        {errors?.name?.message}
                                    </AlertErrorForm>
                                    : null

                            }
                        </div>

                        <div className="">

                            <label className="label">
                                <span className="label-text text-secondary">Apellido (s):</span>
                            </label>


                            <input
                                disabled={isLoadingUpdateProfile}
                                id="lastName"
                                type="text"
                                {...register('lastName', {
                                    required: 'Este campo es obligatorio',
                                })}
                                placeholder="Apellido(s)"
                                className="input input-bordered input-primary block w-full placeholder:text-xs text-xs lg:text-sm lg:placeholder:text-sm"
                                maxLength={50}
                            />

                            {/* mensaje error */}
                            {
                                errors?.lastName?.type === "required"
                                    ? <AlertErrorForm>
                                        {errors?.name?.message}
                                    </AlertErrorForm>
                                    : null

                            }
                        </div>
                    </section>


                    <div className="">

                        <label className="label">
                            <span className="label-text text-secondary">Teléfono:</span>
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            disabled={isLoadingUpdateProfile}
                            {...register('phone', {
                                required: 'Este campo es obligatorio',
                                minLength: {
                                    value: 10,
                                    message: 'El telefono debe contener solo 10 digitos'
                                },
                                maxLength: {
                                    value: 10,
                                    message: 'El telefono debe contener solo solo 10 digitos'
                                }
                            })}

                            minLength={10}
                            maxLength={10}
                            placeholder="Telefono"
                            className="input input-bordered input-primary block w-full placeholder:text-xs text-xs lg:text-sm lg:placeholder:text-sm"

                        />

                        {/* mensaje error */}
                        {
                            errors?.phone?.type === "required"
                                ? <AlertErrorForm>
                                    {errors?.phone?.message}
                                </AlertErrorForm>
                                : null

                        }
                    </div>

                    <button
                        type="submit"
                        disabled={isLoadingUpdateProfile}
                        className="btn btn-secondary flex items-center gap-3 w-full "
                    >
                        guardar cambios
                        {
                            isLoadingUpdateProfile
                                ? <span className="loading loading-bars loading-md"></span>
                                : null
                        }
                    </button>

                    {/* <p className="text-center text-sm lg:text-sm">¿Ya tienes una cuenta? <Link className="text-secondary font-bold" to={`/auth/login`}>Inicia Sesión</Link></p> */}
                </form>
            </main>

            {
                showToastPostCreated
                    ? <div className="toast text-xs lg:text-sm">
                        <div className="alert alert-info py-2 px-4" >
                            <span>Perfil actualizado Correctamente</span>
                        </div>
                    </div >
                    : null
            }
        </>
    )
}
