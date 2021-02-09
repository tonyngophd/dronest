import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
// import niceColors from 'nice-color-palettes'
import niceColors from 'nice-color-palettes'
import Effects from './Effects'
import './ThreeJS.css';

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const colors = new Array(1000).fill().map(() => niceColors[17][Math.floor(Math.random() * 5)])

function Boxes() {
  const [hovered, set] = useState()
  const colorArray = useMemo(() => Float32Array.from(new Array(1000).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])

  const ref = useRef()
  const previous = useRef()
  useEffect(() => void (previous.current = hovered), [hovered])

  useFrame(state => {
    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(time / 4)
    ref.current.rotation.y = Math.sin(time / 2)
    let i = 0
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++
          tempObject.position.set(5 - x, 5 - y, 5 - z)
          tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
          tempObject.rotation.z = tempObject.rotation.y * 2
          if (hovered !== previous.current) {
            tempColor.set(id === hovered ? 'white' : colors[id]).toArray(colorArray, id * 3)
            ref.current.geometry.attributes.color.needsUpdate = true
          }
          const scale = id === hovered ? 2 : 1
          tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          ref.current.setMatrixAt(id, tempObject.matrix)
        }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, 1000]} onPointerMove={e => set(e.instanceId)} onPointerOut={e => set(undefined)}>
      <boxBufferGeometry attach="geometry" args={[0.7, 0.7, 0.7]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

export function ThreeJSBanner() {

  return (
    <div className='banner-container'>
      <div className='previous-or-next-tab-button-dummy' />
      <div className='banner-img-container-threejs'>
        <Canvas
          gl={{ antialias: false, alpha: true }}
          camera={{ position: [0, 0, 15], near: 5, far: 20 }}
          onCreated={({ gl }) => {gl.setClearColor('lightblue');
            gl.clear(gl.COLOR_BUFFER_BIT);}}
          >
          <ambientLight />
          <pointLight position={[150, 150, 150]} intensity={0.55} />
          <Boxes />
          <Effects />
        </Canvas>
      </div>
      <div className='previous-or-next-tab-button-dummy' />
    </div>

  );
}