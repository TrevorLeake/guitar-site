import React from 'react';
import Fret from './Fret';
import { transpose } from "tonal-distance"
import { Interval, Note, Scale } from "@tonaljs/tonal";
import { fromSemitones } from "tonal-interval"
import { includes } from "tonal-pcset"


type FretRange = {
    lowestVisible: number,
    highestVisible: number,
}

type StringProps = {
    fundamental: string
    fretRange?: FretRange,
    toDisplay: string[]
}

function isString(ret: string | ((interval: string) => string)): ret is string {
    return typeof ret === 'string'
}


const String = (props: StringProps) => {
    let initialFret = 0
    let fretCount = 12
    if (props.fretRange) {
        initialFret = props.fretRange.lowestVisible;
        fretCount = props.fretRange.highestVisible - props.fretRange.lowestVisible;
    }

    let frets = [];
    for (let i = initialFret; i < fretCount + initialFret; ++i) {
        let ret = transpose(props.fundamental, fromSemitones(i))
        if (!isString(ret)) {
            throw new Error('Fuck');
        }

        let pitch: string = Note.pitchClass(ret)

        frets.push(
            <Fret
                pitch={pitch}
                dotted={includes(props.toDisplay, pitch)}
                dotColor={`rgba(100, 200, 90, ${i * 1.0 / (fretCount + initialFret)}`}
            />
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '10px', backgroundColor: 'black', marginTop: '40px' }}>
            {props.fundamental}
            {
                frets
            }
        </div>
    );
}

export default String;
