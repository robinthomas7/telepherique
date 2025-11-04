import { useTexture } from "@react-three/drei"

export default function Background() {
    const map = useTexture('./test2.jpg')
    

    return(
        <mesh>
            <planeGeometry args={[20,10]} />
            <meshStandardMaterial map={map} />
        </mesh>
    )
}