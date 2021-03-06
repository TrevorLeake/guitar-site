import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';

const useAnimationFrame = (drawCallback: Function, dependencies: any[] = []) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      drawCallback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if(requestRef.current === undefined) {
        throw new Error('Canvas requestRef undefined')
      }
      cancelAnimationFrame(requestRef.current);
    }
  }, dependencies);
}

export { useAnimationFrame }
