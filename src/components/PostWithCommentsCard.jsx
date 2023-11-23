import PropTypes from 'prop-types'
import { useSelector } from "react-redux"

export const PostWithCommentsCard = ({ ModalPostWithCommentsRef }) => {
    const {
        currentUser,
        post,
        urlImagePost,
        datePosted,
        commentsFirestore
    } = useSelector(state => state.modalPostWithComments)

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
    ModalPostWithCommentsRef: PropTypes.any
}