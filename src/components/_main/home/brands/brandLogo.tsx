import { Avatar } from '@mui/material';
import React from 'react'

const brandLogo = ({ ...props }) => {
    const { cover, name } = props;
    return (
        <Avatar alt={name} src={cover ?? "/"} />
    )
}

export default brandLogo;