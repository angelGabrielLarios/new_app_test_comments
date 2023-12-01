import PropTypes from 'prop-types'

import { Timestamp, arrayRemove, arrayUnion, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { db, getAllPosts, getCommentsByIdPost, getInfoUser, getPostById, } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { generateUniqueId } from '../helpers'

import { setMessage } from '../store/modalError/modalErrorSlice'
import { setPostWithComments } from '../store/modalPostWithComments'
import { messagesModel } from '../model'
import { isCommentOffensive } from '../chatgpt3'



export const PostCard = ({
    idPost,
    post,
    urlImagePost,
    datePosted,
    currentUser,
    ModalErrorRef,
    ModalPostWithCommentsRef,
    preprocessComment,
    predictComment,

    setPostsFirestore,

    setIsLoadingAllPosts
}) => {



    const [isFavoritePost, setIsFavoritePost] = useState(false)

    const { user } = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const [showToastCommentCreated, setShowToastCommentCreated] = useState(false)

    const [commentsFirestore, setCommentsFirestore] = useState([])

    const [isLoadingReaction, setIsLoadingReaction] = useState(false)

    const { handleSubmit, register, reset } = useForm({
        defaultValues: {
            comment: "",
        }
    })

    const [isLoadingDeletePost, setIsLoadingDeletePost] = useState(false)

    const [isLoadingAddComment, setIsLoadingAddComment] = useState(false)

    const [numberReactions, setNumberReactions] = useState(0)

    const showActionDelete = user.uid === currentUser?.uid
    useEffect(() => {
        getCommentsByIdPost({ idPost })
            .then(arrCommentsFirestore => setCommentsFirestore(arrCommentsFirestore))

    }, [idPost])

    const modalConfirmationRef = useRef()

    useEffect(() => {
        getPostById({ idPost })
            .then(data => {
                setIsFavoritePost(data.reactions.includes(user.uid))
            })
    }, [idPost, user.uid])

    useEffect(() => {
        getPostById({ idPost })
            .then(data => setNumberReactions(data.reactions.length))
    }, [isFavoritePost, idPost])


    const onSubmitAddComment = async (data) => {
        const { comment } = data
        setIsLoadingAddComment(true)
        const processedComment = preprocessComment(comment)
        const predictedLabel = await predictComment(processedComment)
        const responseCommentChatGPT = isCommentOffensive(comment)
        if ((predictedLabel === messagesModel.negative) && responseCommentChatGPT === 1) {
            setIsLoadingAddComment(false)
            dispatch(setMessage(`Este comentario no puede ser publicado por se ha dectado que es inapropiado`))
            ModalErrorRef.current.showModal()
            reset()
            return
        }

        try {
            const idComment = generateUniqueId()
            setIsLoadingAddComment(true)
            const currentUser = await getInfoUser({ uid: user.uid })
            await setDoc(doc(db, "comments", idComment), {
                idComment,
                idPost: idPost,
                currentUser,
                comment,
                dateCommeted: Timestamp.fromDate(new Date())
            })

            setShowToastCommentCreated(true)
            setIsLoadingAddComment(false)
            const newComments = await getCommentsByIdPost({ idPost })
            setCommentsFirestore(newComments)
            reset()
            setTimeout(() => {
                setShowToastCommentCreated(false)
            }, 3000)
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }


    }
    return (
        <>
            <section className="bg-neutral rounded-lg p-4 space-y-3">
                <article className="flex items-center">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5311f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>

                    <div className="ml-3">
                        <span className="text-sm font-semibold antialiased block leading-tight">{`${currentUser?.name} ${currentUser?.lastName}`}</span>

                        <span className="text-base-content text-xs block">{datePosted}</span>
                    </div>
                    {
                        showActionDelete
                            ?
                            <button
                                className='ml-auto'
                                type='button'
                                onClick={() => modalConfirmationRef.current?.showModal()}
                            >
                                <svg width="15px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#ff6b6b1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#ff6b6b"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#ff6b6b1487]"> </path> </g> </g> </g> </g></svg>
                            </button>

                            : null
                    }

                </article>

                <p
                    className='text-sm'
                >
                    {post}
                </p>
                {
                    urlImagePost
                        ? <img
                            src={urlImagePost}
                            className="w-full block object-cover" />

                        : null
                }

                <article className="flex items-center justify-between ">
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={async () => {

                                    const postsRef = doc(db, "posts", idPost);
                                    try {
                                        setIsLoadingReaction(true)
                                        const { reactions } = await getPostById({ idPost })
                                        if (!reactions.includes(user.uid)) {
                                            await updateDoc(postsRef, {
                                                reactions: arrayUnion(user.uid)
                                            })
                                            setIsFavoritePost(true)
                                        }

                                        else {
                                            await updateDoc(postsRef, {
                                                reactions: arrayRemove(user.uid)
                                            })
                                            setIsFavoritePost(false)
                                        }
                                    } catch (error) {
                                        console.error(error)
                                        throw new Error(error)
                                    }
                                    finally {
                                        setIsLoadingReaction(false)
                                    }
                                }}
                            >

                                {
                                    isFavoritePost
                                        ?
                                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#793ef9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#793ef9" className='transition duration-300 ease-in-out'></path> </g></svg>
                                        :
                                        <svg width="30px" height="30px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#793ef9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#2a2e37" className='transition duration-300 ease-in-out'></path> </g></svg>
                                }

                            </button>

                            {
                                isLoadingReaction ? <span className="loading loading-bars loading-xs"></span> : null
                            }

                            {
                                numberReactions > 0
                                    ? <span className='text-xs text-primary'>({numberReactions})</span>
                                    : null
                            }
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => {
                                    dispatch(setPostWithComments({
                                        currentUser: currentUser,
                                        post: post,
                                        idPost: idPost,
                                        urlImagePost: urlImagePost,
                                        datePosted: datePosted,
                                        commentsFirestore: commentsFirestore,
                                    }))

                                    ModalPostWithCommentsRef.current.showModal()

                                }}
                            >


                                <svg width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>comment-1</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" > <g id="Icon-Set" transform="translate(-100.000000, -255.000000)" fill="#793ef9"> <path d="M116,281 C114.832,281 113.704,280.864 112.62,280.633 L107.912,283.463 L107.975,278.824 C104.366,276.654 102,273.066 102,269 C102,262.373 108.268,257 116,257 C123.732,257 130,262.373 130,269 C130,275.628 123.732,281 116,281 L116,281 Z M116,255 C107.164,255 100,261.269 100,269 C100,273.419 102.345,277.354 106,279.919 L106,287 L113.009,282.747 C113.979,282.907 114.977,283 116,283 C124.836,283 132,276.732 132,269 C132,261.269 124.836,255 116,255 L116,255 Z" id="comment-1" > </path> </g> </g> </g></svg>
                            </button>
                            {
                                commentsFirestore.length > 0
                                    ? <span className='text-xs text-primary'>({commentsFirestore.length})</span>
                                    : null
                            }
                        </div>

                    </div>


                </article>



                <form
                    className='flex items-center gap-2 '
                    onSubmit={handleSubmit(onSubmitAddComment)}
                    autoComplete='off'
                >
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5311f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>

                    <input
                        disabled={isLoadingAddComment}
                        type="text"
                        placeholder="Escribe un comentario"
                        className="input input-bordered input-sm w-full block placeholder:text-xs"
                        {...register('comment', {
                            required: true
                        })}
                        maxLength={300}
                        minLength={2}
                    />

                    <button

                        type='submit'
                    >
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='stroke-primary hover:stroke-primary-focus '></path> </g></svg>
                    </button>

                    {
                        isLoadingAddComment
                            ? <span className="loading loading-bars loading-xs"></span>
                            : null
                    }
                </form>


            </section>

            {
                showToastCommentCreated
                    ? <div className="toast text-xs lg:text-sm">
                        <div className="alert alert-info py-2 px-4" >
                            <span>Comentario publicado.</span>
                        </div>
                    </div >
                    : null
            }

            <dialog
                ref={modalConfirmationRef}
                className="modal"
            >
                <div className="modal-box">
                    <p className="py-4 text-error font-bold">¿Esta seguro de eliminar este post?</p>
                    <div className="modal-action">

                        <form action=""
                            onSubmit={async (event) => {
                                event.preventDefault()
                                setIsLoadingDeletePost(true)
                                setIsLoadingAllPosts(true)
                                try {
                                    await deleteDoc(doc(db, "posts", `${idPost}`));
                                    const newPosts = await getAllPosts()
                                    setPostsFirestore(newPosts)
                                } catch (error) {
                                    console.log(error)
                                }

                                finally {
                                    setIsLoadingDeletePost(false)
                                    setIsLoadingAllPosts(false)
                                    modalConfirmationRef.current?.close()
                                }
                            }}
                        >
                            <button
                                disabled={isLoadingDeletePost}
                                className='btn btn-sm btn-error text-xs flex items-center gap-2'

                            >
                                Eliminar
                                {
                                    isLoadingDeletePost
                                        ? <span className="loading loading-bars loading-xs"></span>
                                        : null
                                }
                            </button>
                        </form>
                        <form method="dialog">

                            <button className="btn btn-sm text-xs">cancelar</button>
                        </form>
                    </div>
                </div>
            </dialog>


        </>
    )
}


PostCard.propTypes = {
    idPost: PropTypes.any,
    post: PropTypes.any,
    urlImagePost: PropTypes.any,
    datePosted: PropTypes.any,
    currentUser: PropTypes.object,
    ModalErrorRef: PropTypes.any,
    ModalPostWithCommentsRef: PropTypes.any,
    preprocessComment: PropTypes.func,
    predictComment: PropTypes.func,
    setPostsFirestore: PropTypes.any,
    setIsLoadingAllPosts: PropTypes.any
}