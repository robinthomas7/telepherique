import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

export default function BackgroundCover() {
  const tex = useTexture('/test2.jpg')
  const { viewport } = useThree()
  const meshRef = useRef()

  useEffect(() => {
    if (!tex?.image) return
    const A = viewport.width / viewport.height      // aspect écran
    const T = tex.image.width / tex.image.height    // aspect texture

    // cover: on crope le surplus sans distorsion
    if (T > A) {
      // texture plus large → on coupe à gauche/droite
      const sx = A / T
      tex.repeat.set(sx, 1)
      tex.offset.set((1 - sx) / 2, 0)
    } else {
      // texture plus haute → on coupe en haut/bas
      const sy = T / A
      tex.repeat.set(1, sy)
      tex.offset.set(0, (1 - sy) / 2)
    }
    tex.needsUpdate = true
  }, [tex, viewport.width, viewport.height])

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}
