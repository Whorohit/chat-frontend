import React from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({ title, subtitle }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='descrpition' content={subtitle} />
        </Helmet>
    )
}

export default Title