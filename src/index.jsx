import './scss/index.scss'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { useFrame } from "@react-three/fiber";

import Experience from './Experience.jsx'
import { ScrollControls, useScroll } from '@react-three/drei';

function ScrollWatcher({ onChange }) {
    const scroll = useScroll()
    useFrame(() => {
        onChange.current = scroll.offset
    })
    return null
}

function App() {
    const container = useRef()
    const progress = useRef(0)   // pas de state
    const info = useRef(null)

    useEffect(() => {
        let id
        const loop = () => {
            if (info.current) {
                info.current.textContent = Math.round(progress.current * 100) + '%'
            }
            id = requestAnimationFrame(loop)
        }
        id = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(id)
    }, [])
    return (
        <>
            <div className="container" ref={container}>
                <Canvas
                    style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}
                    shadows
                    gl={{ powerPreference: 'high-performance', antialias: true }}
                    dpr={[1, 1]}

                >
                    <ScrollControls pages={2} damping={0.4}>
                        <ScrollWatcher onChange={progress} />
                        <Experience />
                    </ScrollControls>
                </Canvas>
            </div >
            <div className="info sansita">
                <p>Scroll Progress</p>
                <div className="karrik" ref={info}>0%</div>
            </div>
        </>
    )
}


const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(<App />)
