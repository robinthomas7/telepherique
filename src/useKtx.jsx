import * as THREE from 'three'
import { useLoader, useThree } from '@react-three/fiber'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

const TRANSCODER_PATH = '/basis/' 

const guessColorSpace = (url) => {
  const s = url.toLowerCase()
  return /base(color)?|albedo|diffuse/.test(s)
    ? THREE.SRGBColorSpace
    : THREE.NoColorSpace
}

const DEFAULT_WRAP = THREE.ClampToEdgeWrapping

export function useKTX2(
  url,
  { colorSpace, repeat, wrap = DEFAULT_WRAP, anisotropy } = {}
) {
  const { gl } = useThree()
  const tex = useLoader(KTX2Loader, url, (ldr) =>
    ldr.setTranscoderPath(TRANSCODER_PATH).detectSupport(gl)
  )

  tex.colorSpace = colorSpace ?? guessColorSpace(url)
  tex.flipY = false                      // important pour les maps type baseColor
  tex.wrapS = tex.wrapT = wrap

  // ⚠️ n'utilise Repeat que si l'image est POT (1024, 2048...)
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(...repeat)
  }

  if (anisotropy != null) tex.anisotropy = anisotropy
  return tex
}
