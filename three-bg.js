import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');

if (canvas) {
  try {
    initBackgroundScene(canvas);
  } catch (err) {
    console.warn('Background 3D scene disabled:', err);
  }
}

function initBackgroundScene(canvas) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getSize = () => ({ w: window.innerWidth, h: window.innerHeight });

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  let { w, h } = getSize();
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.z = 12;

  const COUNT = 220;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const palette = [
    new THREE.Color(0x3b82f6),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0x06b6d4)
  ];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 46;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  renderer.render(scene, camera);
  requestAnimationFrame(() => { canvas.style.opacity = '1'; });

  let running = !prefersReducedMotion;
  let frame = 0;
  let targetScrollY = window.scrollY;
  let currentScrollY = targetScrollY;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  function animate() {
    if (!running) return;
    frame += 1;
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;

    currentScrollY += (targetScrollY - currentScrollY) * 0.05;
    points.position.y = currentScrollY * 0.004;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  if (running) requestAnimationFrame(animate);

  document.addEventListener('visibilitychange', () => {
    const wasRunning = running;
    running = !document.hidden && !prefersReducedMotion;
    if (running && !wasRunning) requestAnimationFrame(animate);
  });

  window.addEventListener('resize', () => {
    ({ w, h } = getSize());
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (prefersReducedMotion) renderer.render(scene, camera);
  });
}
