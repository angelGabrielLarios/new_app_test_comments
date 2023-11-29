import PropTypes from 'prop-types'

export const ModalInfo = ({ ModalInfoRef, message }) => {
    return (
        <>
            <dialog
                ref={ModalInfoRef}
                id="error_modal" className="modal"
            >
                <div className="modal-box text-info">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 border-none outline-none text-info">✕</button>
                    </form>
                    <div className="flex justify-center items-center mb-2">
                        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#66c7ff"></path> </g></svg>
                    </div>
                    <h3 className="font-bold text-base text-center lg:text-lg">Info</h3>
                    <p className="py-4 text-center text-sm lg:text-base">{message}</p>
                </div>
            </dialog>
        </>
    )
}

ModalInfo.propTypes = {
    ModalInfoRef: PropTypes.any,
    message: PropTypes.string
}