import PropTypes from 'prop-types'

export const ModalError = ({ ModalErrorRef, message }) => {
    return (
        <>
            <dialog
                ref={ModalErrorRef}
                id="error_modal" className="modal"
            >
                <div className="modal-box text-error">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 border-none outline-none text-error">✕</button>
                    </form>
                    <div className="flex justify-center items-center mb-2">
                        <svg height={64} width={64} fill="#ff6b6b" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#ff6b6b"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"></path></g></svg>
                    </div>
                    <h3 className="font-bold text-base text-center lg:text-lg">Error!</h3>
                    <p className="py-4 text-center text-sm lg:text-base">{message}</p>
                </div>
            </dialog>
        </>
    )
}

ModalError.propTypes = {
    ModalErrorRef: PropTypes.any,
    message: PropTypes.string
}