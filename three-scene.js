import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');

if (canvas) {
  try {
    initHeroScene(canvas);
  } catch (err) {
    console.warn('Hero 3D scene disabled:', err);
  }
}

function initHeroScene(canvas) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getSize = () => {
    const rect = canvas.getBoundingClientRect();
    return { w: rect.width || 560, h: rect.height || 560 };
  };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  let { w, h } = getSize();
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 6;

  const group = new THREE.Group();
  scene.add(group);

  // Rings need radius * cos(tiltX) to stay clearly bigger than the photo's
  // apparent radius in scene units, or the tilted-in arc swings behind the
  // opaque profile photo (z-index above canvas) and vanishes. The photo
  // was shrunk (see .hero-image img max-width) to give more headroom for
  // a proper dynamic tilt instead of a near-flat, avatar-ring look.
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.3, 0.045, 16, 100),
    new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.9
    })
  );
  ring1.rotation.x = THREE.MathUtils.degToRad(38);
  group.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.25, 0.03, 16, 100),
    new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.75
    })
  );
  ring2.rotation.x = THREE.MathUtils.degToRad(-34);
  ring2.rotation.y = THREE.MathUtils.degToRad(15);
  group.add(ring2);

  const particleCount = 50;
  const particles = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.06, 0),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.95
    }),
    particleCount
  );
  group.add(particles);

  const dummy = new THREE.Object3D();
  // Evenly-spaced base angles (with small jitter) so particles are always
  // spread all the way around the photo, instead of clumping on one side
  // when fully randomized.
  const slice = (Math.PI * 2) / particleCount;
  const orbits = Array.from({ length: particleCount }, (_, i) => ({
    radius: 2.1 + Math.random() * 0.6,
    angle: i * slice + (Math.random() - 0.5) * slice * 0.8,
    tilt: (Math.random() - 0.5) * 0.7,
    speed: 0.12 + Math.random() * 0.18
  }));

  function layoutParticles(t) {
    orbits.forEach((p, i) => {
      const a = p.angle + t * p.speed;
      dummy.position.set(Math.cos(a) * p.radius, p.tilt, Math.sin(a) * p.radius);
      dummy.rotation.set(a, a, 0);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    });
    particles.instanceMatrix.needsUpdate = true;
  }

  layoutParticles(0);
  renderer.render(scene, camera);
  requestAnimationFrame(() => { canvas.style.opacity = '1'; });

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  let running = !prefersReducedMotion;
  let frame = 0;

  function animate() {
    if (!running) return;
    frame += 1;
    const t = frame * 0.008;
    group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.02;
    group.rotation.x += (mouseY * 0.08 - group.rotation.x) * 0.02;
    ring1.rotation.z = t * 0.3;
    ring2.rotation.z = -t * 0.2;
    layoutParticles(t);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  if (running) requestAnimationFrame(animate);

  const heroSection = document.getElementById('home');
  if (heroSection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wasRunning = running;
        running = entry.isIntersecting && !prefersReducedMotion && !document.hidden;
        if (running && !wasRunning) requestAnimationFrame(animate);
      });
    }, { threshold: 0.05 });
    io.observe(heroSection);
  }

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
