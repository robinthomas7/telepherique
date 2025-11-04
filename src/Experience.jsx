import { Environment, Html, OrbitControls, PerspectiveCamera, ScrollControls, useScroll } from "@react-three/drei";
import Telepherique from "./Telepherique";
import Background from "./Background";
import Cable from "./Cable";
import SnowStormParticles from "./Snow";


export default function Experience() {
    

    return <>
        
            <Telepherique />
            <Environment preset="sunset" />
            <Background />
            <Cable />
            {/* <OrbitControls makeDefault /> */}
            <PerspectiveCamera position={[0, 0, 10]} makeDefault />
            <fog attach="fog" args={['#ffffff', 2, 20]} />
            <SnowStormParticles />
        
    </>
}