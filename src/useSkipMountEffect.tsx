import React, {useEffect, useRef} from 'react'

const useSkipMountEffect = (func: Function, deps: any[]) => {
  const didMount = useRef(false)

  useEffect(() => {
    if(didMount.current) {
      func()
    }
    else {
      didMount.current = true
    }
  }, deps)
}

export default useSkipMountEffect;
