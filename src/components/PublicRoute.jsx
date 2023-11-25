import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const PublicRoute = ({ children, toredirect }) => {
    const { user } = useSelector(state => state.auth)


    return (
        user ? <Navigate to={toredirect} /> : children
    )
}


PublicRoute.propTypes = {
    children: PropTypes.any,
    toredirect: PropTypes.any
}