import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import Fretboard from './Fretboard';
import './App.css';
import { Chord, Note, Key, NoteLiteral, Scale } from "@tonaljs/tonal";
import { unpackCanvasCtx } from './helpers'
import { forEach, flatten, countBy, intersectionBy } from "lodash";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { CameraState, useCamera, TileCoord, BoundingBox } from './useCamera'


interface KeyContextState {
    key: string[]
}

class TonalContext {
    key;

    constructor(key: string[]) {
        this.key = key
    }

    notesToDegrees(notes: string[]) {
        return notes.map((note, i) => this.key.indexOf(note) + 1)
    }

    degreesToNotes(degrees: number[]) {
        return degrees.map((degree, i) => this.key[degree-1])
    }
}



export const keyContext = React.createContext({} as TonalContext);


type RealTone = {
    n: number,
    freq: number,
    name: string,
}

function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialCameraState: CameraState = { x: 0, y: 0, width: 800, height: 500}

  const draw = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    tileCoords: TileCoord,
    boundingBox: BoundingBox
  ) => {
    // Unpack Refs
    const { ctx } = unpackCanvasCtx(canvasRef)
    const { i, j } = tileCoords
    const { x, y, height, width } = boundingBox

    /*
      TODO -- Create SVGs of...
      - Fret marker dots
      - Frets
      - Fretboard wood texture / PRS birds, etc
      - Symbols for fretspaces : [Root, Seventh, circles] (dynamic color?)

      TODO -- Dynamic arrow / trail
   */

   // TODO -- Where to put tiling logic?
   // TODO -- Audio Playback

    const circlePosition = { x: 200, y: 200 }
    ctx.fillStyle = `rgb(${(i*20)%80+160}, ${(j*20)%80+160}, ${(i*j*10)%80+160})`
    ctx.fillRect(x, y, width, height)
    ctx.beginPath();
//    ctx.arc(circlePosition.x - bounds.x, circlePosition.y - bounds.y, 50, 0, 2 * Math.PI);
    ctx.font = '30px serif';

    // Printing at x, y prints in the tile ABOVE yours, as text populates in canvas
    //   with the typographic baseline at y
    ctx.fillStyle = 'white'
    ctx.fillText(`(${i}, ${j})`, x+width/2, y+height/2);
    ctx.stroke();

  }

  useCamera(canvasRef, draw, initialCameraState)

  // TODO -- Create placeholder component based on audiofile status


  const dimensions = { width: 800, height: 500 }



  const [key, setKey] = useState('C');
  const [scaleName, setScaleName] = useState('major');

  const [chord, setChord] = React.useState('');
  const handleChange = (event: any) => setChord(event.target.value)

  const [noteList, setNoteList] = React.useState([]);
  const handleNotesChange = (event: any) => setNoteList(event.target.value)

  let chords = Key.majorKey(key).chords


  let harmonics = (note: NoteLiteral): RealTone[] => {
      let freqs: number[] = [];
      let fundamentalFreq = Note.freq(note);

      if (typeof fundamentalFreq != 'number')
          throw Error();

      for (let i = 1; i < 20; ++i) {
          freqs.push(i * fundamentalFreq);
      }

      return freqs.map((f, i) => {
          return {
              n: i,
              freq: f,
              name: Note.fromFreq(f)
          }
      })
  }


  let harmonicSets = noteList.map(n => harmonics(n))
  let noteCounts = countBy(flatten(harmonicSets), (rt: RealTone) => rt.name)

  let harmonicOverlap: RealTone[] = flatten(
      harmonicSets.map(
          hs => hs.filter(
              rt => noteCounts[rt.name] > 1
          )
      )
  )



  return (
    <div className="App">

      <canvas ref={canvasRef} {...dimensions} />

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Chord</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={chord}
                        label="Chord"
                        onChange={handleChange}
                    >
                        {
                            chords.map((c, i) => {
                                return <MenuItem value={c}>{c}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                {
                    noteList.map(note => note)
                }

                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={noteList}
                        onChange={handleNotesChange}
                        input={<OutlinedInput label="Name" />}
                    >
                        {['C3', 'D3', 'E3', 'F3', 'G3'].map((note) => (
                            <MenuItem
                                key={note}
                                value={note}
                            >
                                {note}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <keyContext.Provider value={new TonalContext([''])}>
                    <Fretboard toDisplay={Chord.get(chord).notes} />
                </keyContext.Provider>
    </div>
  );
}

export default App;
