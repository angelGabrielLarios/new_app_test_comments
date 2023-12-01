import { deleteDoc, doc } from 'firebase/firestore'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { db, getCommentsByIdPost } from '../firebase'
import { setPostWithComments } from '../store/modalPostWithComments'


export const PostWithCommentsCard = ({ ModalPostWithCommentsRef }) => {
    const {
        currentUser,
        post,
        urlImagePost,
        datePosted,
        idPost,
        commentsFirestore
    } = useSelector(state => state.modalPostWithComments)


    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)

    const modalConfirmationRef = useRef()

    const [isLoadingDeleteComment, setIsLoadingDeleteComment] = useState(false)


    const [idCommentForDeleteComment, setIdCommentForDeleteComment] = useState(``)


    return (


        <>
            <dialog
                className="modal"
                ref={ModalPostWithCommentsRef}
            >
                <div className="modal-box space-y-3 bg-neutral ">

                    <section className="bg-neutral rounded-lg space-y-3">
                        <article className="flex items-center">
                            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5311f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            <div className="ml-3 ">
                                <span className="text-sm font-semibold antialiased block leading-tight">{`${currentUser?.name} ${currentUser?.lastName}`}</span>
                                <span className="text-base-content text-xs block">{datePosted}</span>
                            </div>
                        </article>
                        <p
                            className='text-xs'
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




                        <h2
                            className='border-b-2 border-b-primary text-white 2xl text-center py-2'
                        >
                            Comentarios
                        </h2>
                        <article
                            className='space-y-3'
                        >
                            {
                                commentsFirestore.map((comment) => {

                                    return (
                                        <article
                                            key={comment.idComment}
                                            className='flex items-center gap-1 '
                                        >
                                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5311f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>

                                            <section
                                                className='bg-base-100 grow text-xs p-3 rounded-md'
                                            >
                                                <h6
                                                    className='text-primary font-bold mb-2'
                                                >


                                                    <div className="">
                                                        {`${comment?.currentUser?.name} ${comment?.currentUser?.lastName}`} <span className='text-base-content ml-2'>{comment?.dateCommeted}</span>
                                                    </div>
                                                </h6>
                                                {comment?.comment}
                                            </section>

                                            {
                                                comment?.currentUser?.uid === user.uid
                                                    ? <button
                                                        className=''
                                                        type='button'
                                                        onClick={() => {
                                                            setIdCommentForDeleteComment(comment.idComment)
                                                            modalConfirmationRef.current?.showModal()
                                                        }}
                                                    >
                                                        <svg width="15px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#ff6b6b1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#ff6b6b"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#ff6b6b1487]"> </path> </g> </g> </g> </g></svg>
                                                    </button>
                                                    : null
                                            }
                                        </article>
                                    )
                                })
                            }
                        </article>
                    </section>

                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-error">✕</button>
                    </form>

                </div>

                <div className="modal-action mt-0">
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"

                        >✕</button>
                    </form>
                </div>
            </dialog >

            <dialog
                ref={modalConfirmationRef}
                className="modal"
            >
                <div className="modal-box">
                    <p className="py-4 text-error font-bold">¿Esta seguro de eliminar este comentario?</p>
                    <div className="modal-action">

                        <form action=""
                            onSubmit={async (event) => {
                                event.preventDefault()

                                setIsLoadingDeleteComment(true)

                                try {
                                    await deleteDoc(doc(db, "comments", `${idCommentForDeleteComment}`));
                                    const newComments = await getCommentsByIdPost({ idPost: idPost })
                                    dispatch(setPostWithComments({
                                        currentUser,
                                        post,
                                        urlImagePost,
                                        datePosted,
                                        idPost,
                                        commentsFirestore: newComments
                                    }))
                                } catch (error) {
                                    console.log(error)
                                }

                                finally {
                                    setIsLoadingDeleteComment(false)
                                    modalConfirmationRef.current?.close()
                                }
                            }
                            }
                        >
                            <button
                                disabled={isLoadingDeleteComment}
                                className='btn btn-sm btn-error text-xs flex items-center gap-2'

                            >
                                Eliminar
                                {
                                    isLoadingDeleteComment
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
            </dialog >
        </>
    )
}

PostWithCommentsCard.propTypes = {
    currentUser: PropTypes.any,
    post: PropTypes.any,
    urlImagePost: PropTypes.any,
    isFavoritePost: PropTypes.any,
    setIsFavoritePost: PropTypes.any,
    datePosted: PropTypes.any,
    commentsFirestore: PropTypes.any,
    ModalPostWithCommentsRef: PropTypes.any,
    setPostsFirestore: PropTypes.any,
    setIsLoadingAllPosts: PropTypes.any,
    idPost: PropTypes.any
}