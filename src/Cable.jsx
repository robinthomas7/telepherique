export default function Cable() {
    return(
        <mesh rotation={[0, 0,Math.PI/1.8]} position={[0,2,0]}>
            <cylinderGeometry args={[0.02, 0.02, 20, 10 ]} />
            <meshStandardMaterial color={'black'} />
        </mesh>
    )
}