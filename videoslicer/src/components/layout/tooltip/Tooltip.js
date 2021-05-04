import React from 'react'

import classes from './Tooltip.module.css'

const Tooltip = (props) => {
    return (
        <div className={classes.container}>
            props.video.name
        </div>
    )
}

export default Tooltip
