import { useEffect, useRef } from 'react'
import './ShaderBackground.css'

/**
 * Procedural recreation of the poster's green field — a soft organic
 * sage→green cloud rendered in a single fullscreen WebGL fragment shader.
 * Replaces the static gradient + blurred-grid PNGs. Fills the whole viewport
 * and drifts slowly (held static when prefers-reduced-motion is set).
 */

const FRAG = `
precision highp float;
uniform vec2  u_resolution;
uniform float u_time;

// 3D value noise (stand-in for Shader Park's noise())
float hash(vec3 p){
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

// Shader Park input() defaults
const float F   = 3.4; // noise frequency (higher = smaller, finer blobs)
const float AMP = 3.0; // sin amplitude
const float PZ  = 4.0; // density sharpness

float density(vec3 p){
  float nz = noise(F * p) * 2.0 - 1.0; // remap to ~[-1, 1]
  float n  = pow(abs(sin(AMP * (nz + 1.0) + 0.2 * u_time)), PZ);
  return n * 0.05 * smoothstep(0.9, 0.5, length(p));
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // orthographic march through the unit volume
  vec3 rayDir = vec3(0.0, 0.0, 1.0);
  vec3 rayPos = vec3(uv * 1.15, -0.9);

  float acc = 0.0;
  for (int i = 0; i < 30; i++) {
    acc += density(rayPos);
    rayPos += rayDir * 0.06;
  }

  // Shader Park renders color(1 - sqrt(acc)) as a white→dark grayscale.
  // Remap that lightness onto the poster's greens.
  float g = clamp(1.0 - sqrt(acc), 0.0, 1.0);

  vec3 cEdge = vec3(0.953, 0.965, 0.933); // #f3f6ee  near-white sage
  vec3 cMid  = vec3(0.804, 0.859, 0.761); // #cddbc2  pale sage-green
  vec3 cCore = vec3(0.580, 0.722, 0.529); // #94b887  light green

  vec3 col = mix(cCore, cMid, smoothstep(0.0, 0.6, g));
  col = mix(col, cEdge, smoothstep(0.55, 1.0, g));

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('shader compile error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    if (!gl) return // CSS fallback (see ShaderBackground.css) covers this

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // fullscreen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_resolution')
    const uTime = gl.getUniformLocation(prog, 'u_time')

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let raf = 0
    let start = 0
    const draw = (now: number) => {
      if (!start) start = now
      resize()
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(draw)
    }

    if (reduceMotion) {
      // single static frame at a pleasing seed
      gl.uniform1f(uTime, 8.0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      // NB: deliberately do NOT call WEBGL_lose_context here. Doing so
      // permanently kills the context for this canvas element, so React's
      // StrictMode remount (and HMR) would get back a dead context.
    }
  }, [])

  return <canvas ref={canvasRef} className="shader-bg" aria-hidden="true" />
}
