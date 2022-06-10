import React, { useState, useContext } from "react"
import CircleIcon from '@mui/icons-material/Circle';

type FretProps = {
    pitch: string,
    dotted: boolean,
    dotColor?: string,
    fretColor?: string,
}


function Fret(props: FretProps) {

    return (
        <div style={{ flex: 1, backgroundColor: props.dotColor }}>
            {props.dotted ? <CircleIcon /> : <></>}
            {props.pitch}
        </div>
    );
}

export default Fret;
