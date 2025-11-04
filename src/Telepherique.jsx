import { MeshTransmissionMaterial, useGLTF, useScroll, useTexture } from "@react-three/drei"
import { useKTX2 } from "./useKtx"
import * as THREE from 'three'
import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"


export default function Telepherique() {
    const scroll = useScroll()


    const { nodes } = useGLTF('/telepherique.glb')
    const modelRef = useRef()

    const aluMap = useKTX2('./alu-base.ktx2')
    const aluRoughness = useKTX2('./alu-roughness.ktx2')

    const aluMaterial = new THREE.MeshStandardMaterial({
        map: aluMap,
        roughnessMap: aluRoughness,
        metalness: 1
    })

    const redMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.2,
        metalness: 0.8,
        color: '#FF5E5E'
    })

    const blackMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 0.5,
        color: 'black'
    })


    const initialPos = useRef()
    useLayoutEffect(() => {
        initialPos.current = modelRef.current.position.clone()
    }, [])

    const meshRefs = useRef([])
    useFrame((_, delta) => {
        const scrollOffset = scroll.offset
        const targetX = initialPos.current.x + 1 * scrollOffset * 10
        const targetY = initialPos.current.y + 0.18 * scrollOffset * 10

        modelRef.current.position.x = THREE.MathUtils.lerp(
            modelRef.current.position.x,
            targetX,
            0.5 
        )

        modelRef.current.position.y = THREE.MathUtils.lerp(
            modelRef.current.position.y,
            targetY,
            0.5
        )
    })

    const baseRot = useRef([])
    const state = useRef([]) 
    const prevS = useRef(0)

    useLayoutEffect(() => {
        baseRot.current = meshRefs.current.map(m => m?.rotation.z ?? 0)
        state.current = meshRefs.current.map(() => ({ theta: 0, omega: 0 }))
    }, [])

    useFrame((_, dt) => {
        const s = scroll.offset
        const v = (s - prevS.current) / Math.max(dt, 1e-3) // vitesse de scroll
        prevS.current = s

        // paramètres physiques (ajuste juste ces 3 valeurs)
        const k = 100   // raideur
        const d = 1    // amortissement
        const torqueGain = 20// influence du scroll

        meshRefs.current.forEach((m, i) => {
            if (!m) return
            const st = state.current[i]
            const torque = -v * torqueGain
            const acc = -k * st.theta - d * st.omega + torque
            st.omega += acc * dt
            st.theta += st.omega * dt
            // option: limiter l'amplitude
            st.theta = THREE.MathUtils.clamp(st.theta, -0.5, 0.5)

            m.rotation.z = baseRot.current[i] + st.theta
        })
    })

    return (
        <group dispose={null} position={[-5, -1.9, 0]} ref={modelRef}>

            <mesh
                ref={el => meshRefs.current[0] = el}
                castShadow
                receiveShadow
                geometry={nodes.Cabine.geometry}
                // material={whiteMaterial}
                material={redMaterial}
                position={[-0.003, 3.131, 0.184]}

            />
            <mesh
                ref={el => meshRefs.current[1] = el}
                castShadow
                receiveShadow
                geometry={nodes.Armature.geometry}
                // material={aluMaterial}
                material={aluMaterial}
                position={[-0.003, 3.131, 0.184]}
            />
            <mesh
                ref={el => meshRefs.current[2] = el}
                castShadow
                receiveShadow
                geometry={nodes.mech.geometry}
                material={aluMaterial}
                position={[-0.003, 3.131, 0.184]}
            />
            <mesh
                ref={el => meshRefs.current[3] = el}
                castShadow
                receiveShadow
                geometry={nodes.rebord.geometry}
                material={aluMaterial}
                // material={whiteMaterial}
                position={[-0.003, 3.131, 0.184]}
            />
            <mesh
                ref={el => meshRefs.current[4] = el}
                castShadow
                receiveShadow
                geometry={nodes.windows.geometry}
                position={[-0.003, 3.131, 0.184]}
            >
                <MeshTransmissionMaterial
                    transmission={1}
                    roughness={0.3}
                    ior={0.8}
                    thickness={0.2}
                />
            </mesh>
            <mesh
                ref={el => meshRefs.current[5] = el}
                castShadow
                receiveShadow
                material={redMaterial}
                geometry={nodes.wood.geometry}
                position={[-0.003, 3.131, 0.184]}
            />

            <mesh
                ref={el => meshRefs.current[6] = el}
                castShadow
                receiveShadow
                geometry={nodes['sol-toit'].geometry}
                material={aluMaterial}
                position={[-0.003, 3.131, 0.184]}
            />


            <mesh
                castShadow
                receiveShadow
                geometry={nodes.roue.geometry}
                material={blackMaterial}
                position={[-0.003, 3.131, 0.184]}
                rotation={[0, 0, Math.PI / 0.485]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.tete.geometry}
                material={aluMaterial}
                position={[-0.014, 3.1, 0.121]}
                rotation={[0, 0, Math.PI / 0.485]}

            />

        </group>
    )
}

useGLTF.preload('/telepherique.glb')
