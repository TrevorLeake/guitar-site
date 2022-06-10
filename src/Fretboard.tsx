import React from 'react';
import String from './String';

import { Interval, Note, Scale } from "@tonaljs/tonal";


import * as Chord from "tonal-chord";


type FretboardProps = {
  toDisplay: string[]
}

function Fretboard(props: FretboardProps) {
  let tuning: string = 'E2 A3 D3 G3 B4 E4'

  return (
    <div style={{ width: '100%', backgroundColor:'rgba(100,100,200,0.5)' }}>
      {
        tuning.split(' ').reverse().map((v, i) =>
          <String
            fundamental={v}
            fretRange={{ lowestVisible: 1, highestVisible: 12 }}
            toDisplay={props.toDisplay}
          />
        )
      }
    </div>
  );
}

export default Fretboard;
