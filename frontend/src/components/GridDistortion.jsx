import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './GridDistortion.css'

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}`

const GridDistortion = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = '',
}) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const planeRef = useRef(null)
  const animationIdRef = useRef(null)
  const resizeObserverRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000)
    camera.position.z = 2
    cameraRef.current = camera

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null },
      uDataTexture: { value: null },
    }

    const size = grid
    const data = new Float32Array(4 * size * size)
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125
      data[i * 4 + 1] = Math.random() * 255 - 125
    }
    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
    dataTexture.needsUpdate = true
    uniforms.uDataTexture.value = dataTexture

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1)
    const material = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms, vertexShader, fragmentShader, transparent: true })
    const plane = new THREE.Mesh(geometry, material)
    planeRef.current = plane
    scene.add(plane)

    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      if (width === 0 || height === 0) return
      const containerAspect = width / height
      renderer.setSize(width, height)
      plane.scale.set(containerAspect, 1, 1)
      const fw = containerAspect
      camera.left = -fw / 2; camera.right = fw / 2
      camera.top = 0.5; camera.bottom = -0.5
      camera.updateProjectionMatrix()
      uniforms.resolution.value.set(width, height, 1, 1)
    }

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageSrc, texture => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      uniforms.uTexture.value = texture
      handleResize()
    })

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(handleResize)
      ro.observe(container)
      resizeObserverRef.current = ro
    } else {
      window.addEventListener('resize', handleResize)
    }

    const mouse_ = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 }

    const onMouseMove = e => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1 - (e.clientY - rect.top) / rect.height
      mouse_.vX = x - mouse_.prevX
      mouse_.vY = y - mouse_.prevY
      Object.assign(mouse_, { x, y, prevX: x, prevY: y })
    }

    const onMouseLeave = () => {
      dataTexture.needsUpdate = true
      Object.assign(mouse_, { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 })
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      const d = dataTexture.image.data
      for (let i = 0; i < size * size; i++) {
        d[i * 4] *= relaxation
        d[i * 4 + 1] *= relaxation
      }
      const gx = size * mouse_.x
      const gy = size * mouse_.y
      const maxDist = size * mouse
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq = (gx - i) ** 2 + (gy - j) ** 2
          if (distSq < maxDist * maxDist) {
            const idx = 4 * (i + size * j)
            const power = Math.min(maxDist / Math.sqrt(distSq), 10)
            d[idx] += strength * 100 * mouse_.vX * power
            d[idx + 1] -= strength * 100 * mouse_.vY * power
          }
        }
      }
      dataTexture.needsUpdate = true
      renderer.render(scene, camera)
    }
    animate()
    handleResize()

    return () => {
      cancelAnimationFrame(animationIdRef.current)
      resizeObserverRef.current ? resizeObserverRef.current.disconnect() : window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      renderer.dispose()
      renderer.forceContextLoss()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      dataTexture.dispose()
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose()
    }
  }, [grid, mouse, strength, relaxation, imageSrc])

  return (
    <div ref={containerRef} className={`distortion-container ${className}`} style={{ width: '100%', height: '100%', minWidth: 0, minHeight: 0 }} />
  )
}

export default GridDistortion
