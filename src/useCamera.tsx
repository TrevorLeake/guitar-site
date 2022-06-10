import React, { useCallback, useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useAnimationFrame } from './useAnimationFrame'
import { unpackCanvasCtx } from './helpers'
import useSkipMountEffect from './useSkipMountEffect'
import useDimensions from './useDimensions'
import { isEqual } from 'lodash'


// TODO -- width is a bad name, refers to camera width after resolution
// TODO -- Function library for zooming?
// TODO -- Add momentum rigidbody state to camera
// TODO -- On resolution shift, transform camera coordinates to stay in place
// TODO -- Source/Dest pixel ratio. For monitoring allowable image resolutions
// TODO -- Render by shifting bitmap under camera, not painting
// TODO -- onResize event, should redraw differently.. new FFT required?

export type TileCoord = {
  i: number
  j: number
}

export type Tile = {
  boundingBox: BoundingBox
  coords: TileCoord
}

export type BoundingBox = {
  x: number
  y: number
  width: number
  height: number
}

export type Point = { x: number, y: number }

export type TileCoordRange = {
  left: number
  right: number
  top: number
  bottom: number
}

const tileCoordsInView = (boundingBox: BoundingBox, x: number, y: number, width: number, height: number): TileCoordRange => {
  // View bounds in tile coordinates
  return {
    left: Math.floor(x / boundingBox.width),
    right: Math.ceil((x+width) / boundingBox.width),
    top: Math.floor(y / boundingBox.height),
    bottom: Math.ceil((y+height) / boundingBox.height)
  }
}


const createTiles = (tilesInView: TileCoordRange, boundingBox: BoundingBox): Tile[] => {
  const tiles: Tile[] = []
  const {left, right, top, bottom} = tilesInView
  const { width, height } = boundingBox

  for(let i = left; i <= right; ++i) {
    for(let j = top; j <= bottom; ++j) {
      tiles.push({
        boundingBox: {
          x: (i * width) - boundingBox.x,
          y: (j * height) - boundingBox.y,
          width: width,
          height: height
        },
        coords: { i, j }
      })
    }
  }

  return tiles
}



export type CameraState = {
  x: number,
  y: number,
  width: number,
  height: number
}


const useCamera = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  draw: (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    tile: Tile
  ) => void,
  initialState: CameraState,
  minZoom: number = 0.1,
  maxZoom: number = 5,
  zoomSensitivity: number = 0.0005,
) => {

  const [drawTiles, setDrawTiles] = useState<Tile[]>([])
  const [cameraMoved, setCameraMoved] = useState<boolean>(true)
  const [tilesInView, setTilesInView] = useState<TileCoordRange>()
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 })
  const cameraStateRef = useRef<CameraState>({
    width: initialState.width,
    height: initialState.height,
    x: initialState.x,
    y: initialState.y
  })

  const canvasDimensions = useDimensions(canvasRef)

  // TILES
  const tileSide = 300
  const tileBoundingBox: BoundingBox = {
    x: cameraStateRef.current.x || 0,
    y: cameraStateRef.current.y || 0,
    width: tileSide,
    height: tileSide
  }

  // CREATE TILES IF DIRTY (camera moved)
  useEffect(() => {
    setCameraMoved(false)
    const { x, y, width, height } = cameraStateRef.current

    // TODO -- Detect dirty states on camera better, memoize, and shadow update? Method for updating when ref changes?
    //  createTilesIfDirty as Callback?
    // Tiles dirty? Naive solution
//    debugger
    const newTilesInView: TileCoordRange = tileCoordsInView(tileBoundingBox, x, y, width, height)
    console.log({ newTilesInView, tilesInView })
    if(isEqual(newTilesInView, tilesInView)) {
      return
    }

    const tiles: Tile[] = createTiles(newTilesInView, tileBoundingBox)

    // Check if updated
    let tilesMatch: boolean = false
    const coordsMatch = (tileA: Tile, tileB: Tile) => {
      return tileA.coords.i === tileB.coords.i && tileA.coords.j === tileB.coords.j
    }
    tiles.forEach(tile => {
      tilesMatch &&= drawTiles.some(drawTile => coordsMatch(drawTile, tile))
    })

    // If all matched, no update --> draw function doesn't need to redefine
    if(tilesMatch)
      return

    console.log('TILES', drawTiles.map(tile => tile.coords))
    setTilesInView(newTilesInView)
    setDrawTiles(tiles)
  }, [cameraMoved])


  // TODO -- Tiles must be coords + width + height, x,y offset is NOT stored in drawTiles
  //

  // Call
  const drawWrapper = async () => {
    const { ctx } = unpackCanvasCtx(canvasRef)

    drawTiles.forEach((tile) => {
      const bounds: BoundingBox = tile.boundingBox
      const { x, y, width, height } = bounds
      ctx.clearRect(x, y, width, height)
      draw(canvasRef, tile)
    })
  }
  useAnimationFrame(drawWrapper, [tilesInView])


  // CONTROLLER
  useEffect(() => {
    if(!canvasRef.current)
      return

    canvasRef.current.addEventListener('mousemove', onMouseMove)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('wheel', adjustViewResolution)
    canvasRef.current.addEventListener('wheel', preventDefault)

    return () => {
      canvasRef.current?.removeEventListener('mousemove', onMouseMove)
      canvasRef.current?.removeEventListener('mouseup', onMouseUp)
      canvasRef.current?.removeEventListener('mousedown', onMouseDown)
      canvasRef.current?.removeEventListener('wheel', adjustViewResolution)
      canvasRef.current?.removeEventListener('wheel', preventDefault)
    }
  }, [])

  const preventDefault = (e: Event) => e.preventDefault();

  function onMouseDown(e: MouseEvent) {
    const { clientX: mouseX, clientY: mouseY } = e
    const { x: cameraX, y: cameraY } = cameraStateRef.current

    isDraggingRef.current = true
    dragStartRef.current.x = mouseX + cameraX
    dragStartRef.current.y = mouseY + cameraY
  }

  function onMouseUp(e: MouseEvent) {
    isDraggingRef.current = false
  }

  function onMouseMove(e: MouseEvent) {
    // TODO -- Scale motion by (camera/resolution)? so y motion is sane
    if(isDraggingRef.current) {
      const { clientX: mouseX, clientY: mouseY } = e
      const { x: dragStartX, y: dragStartY } = dragStartRef.current

      cameraStateRef.current.x = dragStartX - mouseX
      cameraStateRef.current.y = dragStartY - mouseY
      setCameraMoved(true)
    }
  }

  // TODO -- Zoom at mouse position, not side of screen --> Correct for camera/mouse offset
  const adjustViewResolution = (e: WheelEvent) => {
    if(!canvasDimensions)
      return

    const { width, height } = cameraStateRef.current
    const zoomFunction = (x: number) => x * (1 + (e.deltaY*0.005))

    cameraStateRef.current.width = zoomFunction(width)
    cameraStateRef.current.height = zoomFunction(height)

    // BUG: Increasing resolution cuts image in half? & camera offset needs to update
    setCameraMoved(true)
  }


  return {
    cameraStateRef
  }
}

export { useCamera }
