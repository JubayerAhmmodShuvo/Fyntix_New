/**
 * Particle Field - Adapted from original Fyntix particles.ts
 * Three.js particle system with WebGL shaders
 */
import * as THREE from 'three';

const count = 20000;
const tau = Math.PI * 2;

// Profiles from original
const base = { count: 14000, point: .0002, scale: 1, offset: [0, 0, 0], rotation: [0, 0, 0], spin: [0, 0, 0], dispersion: 0, curlSpeed: .1, curlSize: .15, curlIntensity: .8, curlPlacement: true, fit: 'viewport', focus: 0, focal: 0, near: 0, duration: 1.75, solid: false };
const deep = { count: 12000, duration: .8, curlSpeed: .09, curlSize: .1, curlIntensity: .2, dispersion: .05, scale: 1.5, offset: [.7, 2, 0], rotation: [-.57, .15, .03] };
const accent = { curlPlacement: false, curlSpeed: .09, curlIntensity: .62, rotation: [.12, -.85, 0], dispersion: .02, spin: [0, .022, 0] };

const profiles = {
  'hero-deep': deep,
  'hero-deep-mobile': { ...deep, scale: 1.7, offset: [.7, 2.3, 0] },
  'hero-near': { ...deep, offset: [.2, 2, 4], rotation: [-.7, .15, .03], focus: 5, focal: .2, near: .3 },
  'hero-near-mobile': { ...deep, offset: [.2, 2, 2], focus: 7, focal: .1 },
  'accent-right-medium': { ...accent, scale: 1.2, offset: [5.8, -.35, -.35] },
  'accent-right-large': { ...accent, scale: 2.15, offset: [5.6, -.55, -.35] },
  'section-soft': { scale: 1.02, offset: [0, 2.4, 5], rotation: [.16, 0, 0], spin: [0, 0, .03] },
  'pillar-backdrop': { count: 9000, point: .00013, fit: 'height', scale: .9, offset: [0, 0, -3.4], dispersion: .25, spin: [0, .004, 0] },
  'footer-immersive': { duration: 1.2, fit: 'width', scale: .8, rotation: [0, Math.PI / 2, 0], curlSpeed: .035, curlSize: .12, curlIntensity: .55 },
};

const spark = '#f75d3b', white = '#ffffff', charcoal = '#141414', haze = '#e3ebeb';
const palettes = {
  sparkMono: [spark, spark, haze],
  sparkMonoOnLight: [spark, spark, '#f7f7f7'],
  brandOnWhite: [spark, spark, white],
  brandOnCharcoal: [white, white, charcoal],
  gradientBrandOnCharcoal: [spark, spark, charcoal],
  gradientSparkBloomOnLight: [spark, spark, '#f7f7f7'],
};

// Shape samplers from original
function sample(shape, index) {
  const angle = Math.random() * tau;
  const z = Math.random() * 2 - 1;
  const ring = Math.sqrt(1 - z * z);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const sphere = (radius) => [radius * ring * cos, radius * ring * sin, radius * z];
  
  switch (shape) {
    case 'mobius': {
      const edge = 1.2 * z;
      const radius = 4.5 + edge * Math.cos(angle / 2);
      return [radius * cos, edge * Math.sin(angle / 2), radius * sin];
    }
    case 'tunnel': {
      const radius = 3.5 + Math.random() * 1.5;
      return [radius * cos, radius * sin, z * 10];
    }
    case 'diffuseSphere':
      return sphere(Math.min(2.5, Math.max(.1, 1.75 + .55 * Math.sqrt(-2 * Math.log(Math.max(.000001, Math.random()))) * Math.cos(Math.random() * tau))));
    default:
      return sphere(3.3 + .55 * Math.random());
  }
}

// Shaders from original
const vertexShader = `
attribute vec3 startPoint;
attribute vec3 color;
uniform float clock, progress, scale, viewportScale, size, curlSpeed, curlSize, curlIntensity, dispersion, focus, focal, nearClip;
uniform bool curlPlacement;
uniform vec3 offset, lowColor, highColor;
uniform mat3 rotation, spin;
varying vec3 paint;
varying float blur, nearVisibility;

vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x / 289.0) * 289.0; }
vec4 permute(vec4 x) { return mod289((x * 34.0 + 1.0) * x); }
float simplex(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0., .5, 1., 2.);
  vec3 i = floor(v + dot(v, C.yyy)), a = v - i + dot(i, C.xxx);
  vec3 g = step(a.yzx, a.xyz), l = 1.0 - g;
  vec3 i1 = min(g, l.zxy), i2 = max(g, l.zxy);
  vec3 b = a - i1 + C.xxx, c = a - i2 + C.yyy, d = a - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0., i1.z, i2.z, 1.)) + i.y + vec4(0., i1.y, i2.y, 1.)) + i.x + vec4(0., i1.x, i2.x, 1.));
  vec3 ns = (1.0 / 7.0) * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z), y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy, y = y_ * ns.x + ns.yyyy, h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy), b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2. + 1., s1 = floor(b1) * 2. + 1., sh = -step(h, vec4(0.));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy, a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x), p1 = vec3(a0.zw,h.y), p2 = vec3(a1.xy,h.z), p3 = vec3(a1.zw,h.w);
  vec4 norm = 1.79284291400159 - .85373472095314 * vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));
  vec4 m = max(.6 - vec4(dot(a,a),dot(b,b),dot(c,c),dot(d,d)), 0.);
  m *= m;
  return 42. * dot(m * m, norm * vec4(dot(p0,a),dot(p1,b),dot(p2,c),dot(p3,d)));
}

void main() {
  vec3 p = spin * mix(startPoint, position, progress);
  float sizeFactor = 1.;
  p = rotation * (p * scale) + offset;
  if (dispersion > 0.) p += normalize(p) * dispersion * (simplex(p * 5. + clock * .1) * .5 + 1.) * 3.;
  float curl = simplex(p * curlSize + clock * curlSpeed);
  if (curlPlacement) p += curl * .2;
  sizeFactor += curl * curlIntensity;
  float depth = -(modelViewMatrix * vec4(p / max(viewportScale,.001),1.)).z;
  blur = abs(depth - focus) * focal;
  nearVisibility = nearClip > 0. ? smoothstep(nearClip, nearClip + max(nearClip*.2,.35),depth) : 1.;
  gl_PointSize = max(0.,size*sizeFactor*500./max(depth,.001))*(1.+blur*.35)*nearVisibility;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.);
  paint = mix(lowColor, highColor, clamp(p.y/max(abs(scale)*4.,.5)+.5,0.,1.)) * color;
}
`;

const fragmentShader = `
uniform bool solid;
varying vec3 paint;
varying float blur, nearVisibility;
void main() {
  float radius = distance(gl_PointCoord, vec2(.5));
  if (radius > .5 || nearVisibility < .001) discard;
  float edge = solid ? max(.2,.42-min(blur,1.5)*.15) : max(.05,.3-min(blur,1.5)*.18);
  float opacity = (1.-smoothstep(edge,.5,radius))*nearVisibility/(1.+blur*.85);
  vec2 pixel = floor(gl_FragCoord.xy);
  float threshold = fract(pixel.x*.5+pixel.y*pixel.y*.75);
  vec3 color = solid ? paint : floor(paint*6.+threshold)/6.;
  gl_FragColor = vec4(color, opacity * (solid ? 1. : .85));
}
`;

const rotation = (x, y, z) => new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-x, -y, -z)));

export function particleField(host, initial, options = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: options.preserveDrawingBuffer });
  } catch {
    return { set: () => {}, dispose: () => {} };
  }
  
  const canvas = renderer.domElement;
  canvas.className = 'replica-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  
  const camera = new THREE.PerspectiveCamera(60, 1, .1, 1000);
  camera.position.z = 10;
  
  const scene = new THREE.Scene();
  const geometry = new THREE.BufferGeometry();
  const from = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const to = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  
  geometry.setAttribute('startPoint', from);
  geometry.setAttribute('position', to);
  
  const uniforms = {
    clock: { value: 0 },
    progress: { value: 1 },
    scale: { value: 1 },
    viewportScale: { value: 1 },
    size: { value: .05 },
    offset: { value: new THREE.Vector3() },
    curlSpeed: { value: 0 },
    curlSize: { value: 0 },
    curlIntensity: { value: 0 },
    curlPlacement: { value: true },
    dispersion: { value: 0 },
    focus: { value: 0 },
    focal: { value: 0 },
    nearClip: { value: 0 },
    solid: { value: false },
    rotation: { value: new THREE.Matrix3() },
    spin: { value: new THREE.Matrix3() },
    lowColor: { value: new THREE.Color() },
    highColor: { value: new THREE.Color() },
  };
  
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false });
  const cloud = new THREE.Points(geometry, material);
  cloud.frustumCulled = false;
  scene.add(cloud);
  
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let profile = { ...base, ...profiles[initial.profile] };
  let frame = 0;
  let timestamp = 0;
  let width = 1;
  let height = 1;
  let fit = 1;
  let stopped = false;
  let visible = !options.embedded;
  const created = performance.now();
  
  const current = new THREE.Vector3();
  const position = new THREE.Vector3();
  const spin = new THREE.Vector3();
  const temp = new THREE.Vector3();
  let scale = 1;
  
  // Generate initial positions
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const pos = sample(initial.shape, i);
    positions[i * 3] = pos[0];
    positions[i * 3 + 1] = pos[1];
    positions[i * 3 + 2] = pos[2];
  }
  to.array.set(positions);
  from.array.set(positions);
  to.needsUpdate = true;
  from.needsUpdate = true;
  
  function resize() {
    const r = host.getBoundingClientRect();
    width = Math.max(r.width, 1);
    height = Math.max(r.height, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.max(1, Math.min(devicePixelRatio, 1.5)));
    renderer.setSize(width, height, false);
  }
  
  function set(next) {
    if (stopped) return;
    profile = { ...base, ...profiles[next.profile] };
    const [low, high, background] = palettes[next.palette] || palettes.sparkMonoOnLight;
    uniforms.lowColor.value.setStyle(low);
    uniforms.highColor.value.setStyle(high);
    renderer.setClearColor(background, options.background ? 1 : 0);
    if (options.background) host.style.backgroundColor = background;
  }
  
  function draw(now) {
    if (!visible || document.hidden || stopped) return;
    const dt = Math.min(.1, (now - (timestamp || now)) / 1000);
    timestamp = now;
    const instant = reduce.matches;
    
    uniforms.clock.value = instant ? 1 : (now - created) / 1000;
    scale += (profile.scale * fit - scale) * .06;
    position.lerp(temp.set(...profile.offset).multiplyScalar(fit), .06);
    current.lerp(temp.set(...profile.rotation), .06);
    if (!instant) spin.addScaledVector(temp.set(...profile.spin), dt);
    
    uniforms.offset.value.copy(position);
    uniforms.scale.value = scale;
    uniforms.viewportScale.value = fit;
    uniforms.rotation.value.copy(rotation(current.x, current.y, current.z));
    uniforms.spin.value.copy(rotation(spin.x, spin.y, spin.z));
    uniforms.size.value = profile.point * 250;
    uniforms.curlSpeed.value = profile.curlSpeed;
    uniforms.curlSize.value = profile.curlSize;
    uniforms.curlIntensity.value = profile.curlIntensity;
    uniforms.curlPlacement.value = profile.curlPlacement;
    uniforms.dispersion.value = profile.dispersion;
    uniforms.focus.value = profile.focus;
    uniforms.focal.value = profile.focal;
    uniforms.nearClip.value = profile.near;
    uniforms.solid.value = profile.solid;
    
    renderer.render(scene, camera);
  }
  
  function animate(now) {
    if (!visible || stopped) return;
    if (now - timestamp >= 12.5) draw(now);
    frame = requestAnimationFrame(animate);
  }
  
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(frame);
    if (visible) frame = requestAnimationFrame(animate);
  }, { rootMargin: options.embedded ? '220px' : '0px' });
  
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  io.observe(host);
  
  resize();
  set(initial);
  frame = requestAnimationFrame(animate);
  
  return {
    set,
    dispose() {
      stopped = true;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}
