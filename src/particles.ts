import * as THREE from 'three';

export type Shape = 'mobius' | 'tunnel' | 'sphere0' | 'earth' | 'polyhedron2' | 'henneberg' | 'gyroid' | 'diffuseSphere' | 'crossClusters' | 'doubleRing' | 'Logo_&A' | 'fyntix' | 'fyntix-y' | 'wave' | '404';
export type Scene = { shape: Shape; profile: string; palette: string };
type Vec = [number, number, number];
type Profile = { count: number; point: number; scale: number; offset: Vec; rotation: Vec; spin: Vec; dispersion: number; curlSpeed: number; curlSize: number; curlIntensity: number; curlPlacement: boolean; fit: 'viewport' | 'width' | 'height'; focus: number; focal: number; near: number; duration: number; solid: boolean };
const base: Profile = { count: 14000, point: .0002, scale: 1, offset: [0, 0, 0], rotation: [0, 0, 0], spin: [0, 0, 0], dispersion: 0, curlSpeed: .1, curlSize: .15, curlIntensity: .8, curlPlacement: true, fit: 'viewport', focus: 0, focal: 0, near: 0, duration: 1.75, solid: false };
const deep: Partial<Profile> = { count: 12000, duration: .8, curlSpeed: .09, curlSize: .1, curlIntensity: .2, dispersion: .05, scale: 1.5, offset: [.7, 2, 0], rotation: [-.57, .15, .03] };
const accent: Partial<Profile> = { curlPlacement: false, curlSpeed: .09, curlIntensity: .62, rotation: [.12, -.85, 0], dispersion: .02, spin: [0, .022, 0] };
const profiles: Record<string, Partial<Profile>> = {
  'hero-deep': deep,
  'hero-deep-mobile': { ...deep, scale: 1.7, offset: [.7, 2.3, 0] },
  'hero-near': { ...deep, offset: [.2, 2, 4], rotation: [-.7, .15, .03], focus: 5, focal: .2, near: .3 },
  'hero-near-mobile': { ...deep, offset: [.2, 2, 2], focus: 7, focal: .1 },
  'accent-right-medium': { ...accent, scale: 1.2, offset: [5.8, -.35, -.35] },
  'accent-right-large': { ...accent, scale: 2.15, offset: [5.6, -.55, -.35] },
  'accent-right-dispersed': { scale: 1.2, offset: [3.3, -.6, .5], dispersion: .5 },
  'intro-offset-near': { count: 10000, duration: .8, curlSpeed: .04, curlSize: .18, curlIntensity: .4, scale: 3.44, offset: [4.4, -.2, 0], rotation: [.08, 2.2, 0] },
  'side-offset-far': { duration: .8, scale: 2.25, offset: [7, -1.7, -.5], rotation: [0, 2.2, 0] },
  'section-soft': { scale: 1.02, offset: [0, 2.4, 5], rotation: [.16, 0, 0], spin: [0, 0, .03] },
  'band-globe-rising': { count: 18000, point: .00011, scale: 1.9, rotation: [.1, 0, 0], curlSpeed: .035, curlSize: .12, curlIntensity: .55, spin: [0, .02, 0] },
  'card-interactive': { count: 900, point: .00013, fit: 'width', scale: .8, offset: [0, 0, -2.9], dispersion: .6, curlIntensity: .45 },
  'pillar-backdrop': { count: 9000, point: .00013, fit: 'height', scale: .9, offset: [0, 0, -3.4], dispersion: .25, spin: [0, .004, 0] },
  'results-tunnel-field': { count: 1800, point: .00024, scale: 1.8, offset: [0, -15, 0], curlPlacement: false, curlSpeed: .05, curlSize: .1, curlIntensity: .2, solid: true },
  'footer-immersive': { duration: 1.2, fit: 'width', scale: .8, rotation: [0, Math.PI / 2, 0], curlSpeed: .035, curlSize: .12, curlIntensity: .55 },
  'nav-mobile-accent': { ...accent, count: 9000, scale: 2, offset: [-5, -6, -.15], rotation: [.12, 0, 0], spin: [0, .018, 0] },
  'error-tilted-large': { scale: 2.25, offset: [0, .4, 0], rotation: [-.43, -.02, .33], dispersion: .2 },
};
const spark = '#f75d3b', white = '#ffffff', charcoal = '#141414', haze = '#e3ebeb';
const palettes: Record<string, [string, string, string]> = {
  sparkMono: [spark, spark, haze], sparkMonoOnLight: [spark, spark, '#f7f7f7'], brandOnWhite: [spark, spark, white],
  brandOnCharcoal: [white, white, charcoal], gradientBrandOnWhite: [spark, spark, white], gradientBrandOnHaze: [spark, spark, haze],
  gradientBrandOnLight: [spark, spark, '#f7f7f7'], gradientSparkBloomOnGrey: [spark, spark, '#f4f4f4'], gradientSparkBloomOnLight: [spark, spark, '#f7f7f7'],
  gradientBrandOnCharcoal: [spark, spark, charcoal], whiteOnWhite: [white, white, white], solidCharcoal: [charcoal, charcoal, charcoal],
};
export function sceneBackground(scene?: Scene) { return scene ? (palettes[scene.palette]?.[2] ?? white) : white; }

const count = 20000, tau = Math.PI * 2;
type ParticleData = { positions: Float32Array; colors?: Float32Array };
const baked: Partial<Record<Shape, { file: string; hasColors?: boolean }>> = {
  'Logo_&A': { file: 'mark' }, fyntix: { file: 'fyntix-footer', hasColors: true }, 'fyntix-y': { file: 'fyntix-y' }, earth: { file: 'earth' }, '404': { file: 'not-found' },
};
const cache = new Map<Shape, Promise<ParticleData>>();
const clusters: Vec[] = [[0, 0, 0], [0, 1.8, 0], [0, -1.8, 0], [1.8, 0, 0], [-1.8, 0, 0]];
function sample(shape: Shape, index: number): Vec {
  const angle = Math.random() * tau, z = Math.random() * 2 - 1;
  const ring = Math.sqrt(1 - z * z), cos = Math.cos(angle), sin = Math.sin(angle);
  const sphere = (radius: number): Vec => [radius * ring * cos, radius * ring * sin, radius * z];
  switch (shape) {
    case 'mobius': {
      const edge = 1.2 * z, radius = 4.5 + edge * Math.cos(angle / 2);
      return [radius * cos, edge * Math.sin(angle / 2), radius * sin];
    }
    case 'tunnel': { const radius = 3.5 + Math.random() * 1.5; return [radius * cos, radius * sin, z * 10]; }
    case 'henneberg': return [.8 * (2 * Math.sinh(z) * Math.cos(angle / 2) - 2 / 3 * Math.sinh(3 * z) * Math.cos(3 * angle / 2)), .8 * (2 * Math.sinh(z) * Math.sin(angle / 2) + 2 / 3 * Math.sinh(3 * z) * Math.sin(3 * angle / 2)), 1.6 * Math.cosh(2 * z) * cos];
    case 'gyroid': {
      for (let i = 0; i < 100; i++) {
        const [x, y, z] = Array.from({ length: 3 }, () => (Math.random() - .5) * tau * 2);
        if (Math.abs(Math.sin(x) * Math.cos(y) + Math.sin(y) * Math.cos(z) + Math.sin(z) * Math.cos(x)) < .15) return [.6 * x, .6 * y, .6 * z];
      }
      return sphere(3.5);
    }
    case 'diffuseSphere': return sphere(Math.min(2.5, Math.max(.1, 1.75 + .55 * Math.sqrt(-2 * Math.log(Math.max(.000001, Math.random()))) * Math.cos(Math.random() * tau))));
    case 'crossClusters': { const c = clusters[index % clusters.length]; const v = sphere(.75 * Math.cbrt(Math.random())); return [c[0] + v[0], c[1] + v[1], c[2] + v[2]]; }
    case 'doubleRing': { const t = Math.random() * tau, r = (index < 10000 ? 1.7 : 2.5) + .22 * Math.cos(t); return [r * cos, r * sin, .22 * Math.sin(t)]; }
    case 'polyhedron2': {
      const v = sphere(4.5 * (1 + .1 * Math.sin(angle * 10) * Math.cos(Math.acos(z) * 10)));
      return Math.hypot(v[0], v[1]) >= -.1778 * v[2] + 2.6 ? v : sample(shape, index);
    }
    case 'wave': return [(Math.random() - .5) * 35, z * 10, 999];
    default: return sphere(3.3 + .55 * Math.random());
  }
}
function geometryFor(shape: Shape) {
  if (!cache.has(shape)) cache.set(shape, (async () => {
    const positions = new Float32Array(count * 3), model = baked[shape];
    if (!model) {
      for (let i = 0; i < count; i++) positions.set(sample(shape, i), i * 3);
      return { positions };
    }
    const response = await fetch(`/particle-data/${model.file}.f32`);
    if (!response.ok) throw Error(`Missing particle model ${model.file}`);
    const data = new Float32Array(await response.arrayBuffer());
    // Colored models store a block of linear RGB values after the position data.
    const positionLength = model.hasColors ? data.length / 2 : data.length;
    const pointCount = positionLength / 3;
    if (!pointCount || !Number.isInteger(pointCount)) throw Error(`Invalid particle model ${model.file}`);
    const colors = model.hasColors ? new Float32Array(positions.length) : undefined;
    positions.set(data.subarray(0, Math.min(positionLength, positions.length)));
    colors?.set(data.subarray(positionLength, positionLength + positions.length));
    for (let i = pointCount; i < count; i++) {
      const offset = Math.floor(Math.random() * pointCount) * 3;
      positions.set(data.subarray(offset, offset + 3), i * 3);
      colors?.set(data.subarray(positionLength + offset, positionLength + offset + 3), i * 3);
    }
    return { positions, colors };
  })());
  return cache.get(shape)!;
}

const vertexShader = /* glsl */ `
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
  if (position.z > 900.) { p.z = sin(p.x*.5 + clock*.35)*cos(p.y*.5 + clock*.2)*.5; sizeFactor += clamp(p.z + .5,0.,1.)*.3; }
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
const fragmentShader = /* glsl */ `
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

type Options = { embedded?: boolean; background?: boolean; parallax?: boolean; intro?: boolean; drag?: boolean; scrim?: boolean; preserveDrawingBuffer?: boolean };
export type Field = { set(scene: Scene): void; dispose(): void };
const rotation = (x: number, y: number, z: number) => new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-x, -y, -z)));

export function particleField(host: HTMLElement, initial: Scene, options: Options = {}): Field {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: options.preserveDrawingBuffer }); }
  catch { return { set: (scene) => { if (options.background) host.style.backgroundColor = sceneBackground(scene); }, dispose() {} }; }
  const canvas = renderer.domElement;
  canvas.className = 'replica-canvas'; canvas.setAttribute('aria-hidden', 'true'); host.append(canvas);
  if (options.scrim) host.classList.add('replica-particle-scrim');
  const camera = new THREE.PerspectiveCamera(60, 1, .1, 1000); camera.position.z = 10;
  const scene = new THREE.Scene(), geometry = new THREE.BufferGeometry();
  const from = new THREE.BufferAttribute(new Float32Array(count * 3), 3), to = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  geometry.setAttribute('startPoint', from); geometry.setAttribute('position', to);
  const uniforms = {
    clock: { value: 0 }, progress: { value: 1 }, scale: { value: 1 }, viewportScale: { value: 1 }, size: { value: .05 }, offset: { value: new THREE.Vector3() },
    curlSpeed: { value: 0 }, curlSize: { value: 0 }, curlIntensity: { value: 0 }, curlPlacement: { value: true }, dispersion: { value: 0 }, focus: { value: 0 }, focal: { value: 0 }, nearClip: { value: 0 }, solid: { value: false },
    rotation: { value: new THREE.Matrix3() }, spin: { value: new THREE.Matrix3() }, lowColor: { value: new THREE.Color() }, highColor: { value: new THREE.Color() },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false });
  const cloud = new THREE.Points(geometry, material); cloud.frustumCulled = false; scene.add(cloud);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let profile = { ...base, ...profiles[initial.profile] }, active: Scene | undefined, target: Float32Array | undefined;
  let frame = 0, timestamp = 0, request = 0, width = 1, height = 1, fit = 1, lift = 0, start = 0, stopped = false, visible = !options.embedded;
  const created = performance.now();
  let down = false, px = 0, py = 0, dragX = 0, dragY = 0, vx = 0, vy = 0;
  const current = new THREE.Vector3(), position = new THREE.Vector3(), spin = new THREE.Vector3(), temp = new THREE.Vector3();
  let scale = 1;

  function updateFit() {
    if (profile.fit === 'viewport') fit = options.embedded ? 1 : Math.max(.6, Math.min(1, width / height / 1.6, width / 1440));
    else if (target) {
      const bounds = new THREE.Box3().setFromBufferAttribute(to).applyMatrix4(new THREE.Matrix4().setFromMatrix3(rotation(...profile.rotation))).getSize(temp);
      const worldHeight = 2 * Math.tan(Math.PI / 6) * Math.abs(10 - profile.offset[2]);
      fit = profile.fit === 'width' ? worldHeight * width / height / Math.max(.001, bounds.x) : worldHeight / Math.max(.001, bounds.y);
    }
    geometry.setDrawRange(0, Math.min(count, Math.max(1, Math.round(profile.count * fit ** 2))));
  }
  function resize() {
    const r = host.getBoundingClientRect(); width = Math.max(r.width, 1); height = Math.max(r.height, 1);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.max(1, Math.min(devicePixelRatio, 1.5, Math.sqrt(1650000 / (innerWidth * innerHeight)))));
    renderer.setSize(width, height, false); updateFit();
  }
  function set(next: Scene) {
    if (stopped) return;
    const sameShape = next.shape === active?.shape;
    active = next; profile = { ...base, ...profiles[next.profile] };
    const [low, high, background] = palettes[next.palette] ?? palettes.gradientBrandOnWhite;
    uniforms.lowColor.value.setStyle(low); uniforms.highColor.value.setStyle(high);
    renderer.setClearColor(background, options.background ? 1 : 0);
    if (options.background) host.style.backgroundColor = background;
    if (sameShape && target) { updateFit(); return; }
    const n = ++request;
    void geometryFor(next.shape).then(({ positions, colors }) => {
      if (stopped || n !== request) return;
      const first = !target;
      if (first && options.intro && !reduce.matches) for (let i = 0; i < count; i++) from.setXYZ(i, (Math.random() - .5) * 18, (Math.random() - .5) * 11, (Math.random() - .5) * 10);
      else from.array.set(target ?? positions);
      to.array.set(positions); from.needsUpdate = true; to.needsUpdate = true; target = positions;
      if (colors) geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      else geometry.deleteAttribute('color');
      updateFit(); start = reduce.matches || (first && !options.intro) ? 0 : performance.now();
      if (first) { scale = profile.scale * fit; current.set(...profile.rotation); position.set(...profile.offset).multiplyScalar(fit); }
      if (visible) draw(performance.now());
    }).catch(() => { if (options.background) host.style.backgroundColor = background; });
  }
  function draw(now: number) {
    if (!target || document.hidden) return;
    const dt = Math.min(.1, (now - (timestamp || now)) / 1000); timestamp = now;
    const instant = reduce.matches, speed = instant ? 1 : .06;
    const step = start && !instant ? Math.min(1, (now - start) / (profile.duration * 1000)) : 1;
    uniforms.progress.value = step < .5 ? 4 * step ** 3 : 1 - (-2 * step + 2) ** 3 / 2;
    uniforms.clock.value = instant ? 1 : (now - created) / 1000;
    if (!down) { vx *= Math.exp(-5 * dt); vy *= Math.exp(-5 * dt); dragX += vx * dt; dragY += vy * dt; }
    scale += (profile.scale * fit - scale) * speed;
    position.lerp(temp.set(...profile.offset).multiplyScalar(fit), speed);
    current.lerp(temp.set(profile.rotation[0] + dragX, profile.rotation[1] + dragY, profile.rotation[2]), options.drag ? 1 : speed);
    if (!instant) spin.addScaledVector(temp.set(...profile.spin), dt);
    uniforms.offset.value.copy(position); uniforms.scale.value = scale; uniforms.viewportScale.value = fit;
    uniforms.rotation.value.copy(rotation(current.x, current.y, current.z)); uniforms.spin.value.copy(rotation(spin.x, spin.y, spin.z));
    uniforms.size.value = profile.point * 250; uniforms.curlSpeed.value = profile.curlSpeed; uniforms.curlSize.value = profile.curlSize;
    uniforms.curlIntensity.value = profile.curlIntensity; uniforms.curlPlacement.value = profile.curlPlacement; uniforms.dispersion.value = profile.dispersion;
    uniforms.focus.value = profile.focus; uniforms.focal.value = profile.focal; uniforms.nearClip.value = profile.near; uniforms.solid.value = profile.solid;
    const desired = options.parallax ? scrollY * .5 / height * 20 * Math.tan(Math.PI / 6) : 0;
    lift += (desired - lift) * (instant ? 1 : 1 - Math.exp(-4 * dt)); cloud.position.y = lift;
    renderer.render(scene, camera);
  }
  function animate(now: number) { if (!visible || stopped) return; if (now - timestamp >= 12.5) draw(now); frame = requestAnimationFrame(animate); }
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting; cancelAnimationFrame(frame);
    if (visible) frame = requestAnimationFrame(animate);
  }, { rootMargin: options.embedded ? '220px' : '0px' });
  const ro = new ResizeObserver(resize); ro.observe(host); io.observe(host);
  const press = (event: PointerEvent) => { down = true; px = event.clientX; py = event.clientY; host.setPointerCapture(event.pointerId); };
  const move = (event: PointerEvent) => { if (!down) return; vx = (event.clientY - py) * .11; vy = (event.clientX - px) * .11; dragX += vx * .055; dragY += vy * .055; px = event.clientX; py = event.clientY; };
  const release = () => { down = false; };
  if (options.drag) { host.addEventListener('pointerdown', press); host.addEventListener('pointermove', move); host.addEventListener('pointerup', release); host.addEventListener('pointercancel', release); }
  resize(); set(initial);
  return { set, dispose() {
    stopped = true; io.disconnect(); ro.disconnect(); cancelAnimationFrame(frame);
    host.removeEventListener('pointerdown', press); host.removeEventListener('pointermove', move); host.removeEventListener('pointerup', release); host.removeEventListener('pointercancel', release);
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
  } };
}
