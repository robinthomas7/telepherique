// SnowStormParticles.jsx
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function SnowStormParticles({
  count = 2000,
  area = [20, 12, 20],
  speed = [0.5, 1.5],
  wind = [-0.3, 0.3],
  size = 0.05,
  color = '#ffffff',
}) {
  const points = useRef()
  const velY = useRef()
  const velX = useRef()

  const { positions } = useMemo(() => {
    const [W, H, D] = area
    const pos = new Float32Array(count * 3)
    const vy = new Float32Array(count)
    const vx = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 0] = (Math.random() - 0.5) * W
      pos[i3 + 1] = (Math.random() - 0.5) * H
      pos[i3 + 2] = (Math.random() - 0.5) * D
      vy[i] = speed[0] + Math.random() * (speed[1] - speed[0])
      vx[i] = wind[0] + Math.random() * (wind[1] - wind[0])
    }

    velY.current = vy
    velX.current = vx
    return { positions: pos }
  }, [count, area, speed, wind])

  useFrame((_, delta) => {
    const p = points.current
    if (!p) return

    const dt = Math.min(delta, 1 / 30)

    const attr = p.geometry.attributes.position
    const arr = attr.array
    const vy = velY.current
    const vx = velX.current
    const [W, H, D] = area

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      arr[i3 + 1] -= vy[i] * dt
      arr[i3 + 0] += vx[i] * dt

      if (arr[i3 + 1] < -H * 0.5) {
        arr[i3 + 1] = H * 0.5
        arr[i3 + 0] = (Math.random() - 0.5) * W
        arr[i3 + 2] = (Math.random() - 0.5) * D
        vy[i] = speed[0] + Math.random() * (speed[1] - speed[0])
        vx[i] = wind[0] + Math.random() * (wind[1] - wind[0])
      }

      if (arr[i3 + 0] < -W * 0.5) arr[i3 + 0] += W
      else if (arr[i3 + 0] > W * 0.5) arr[i3 + 0] -= W
    }

    attr.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.9}
      />
    </points>
  )
}
