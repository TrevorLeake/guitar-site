import { useRef, useState, useLayoutEffect } from 'react'


const useDimensions = (ref: React.RefObject<HTMLElement>): DOMRect|undefined => {
  const [dimensions, setDimensions] = useState<DOMRect>()

  useLayoutEffect(() => {
    setDimensions(ref.current?.getBoundingClientRect().toJSON())
  }, [ref.current])

  return dimensions
}

export default useDimensions
