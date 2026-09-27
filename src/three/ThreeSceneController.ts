import * as THREE from 'three';
import { BirthdayCake3D } from './BirthdayCake3D';
import { SpatialMemories3D } from './SpatialMemories3D';

export type QualityProfile = 'HIGH' | 'MEDIUM' | 'LOW';

export class ThreeSceneController {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  // Objects
  public cake: BirthdayCake3D;
  public memories: SpatialMemories3D;
  private ambientParticles: THREE.Points;
  private particlePositions: Float32Array;
  private particleVelocities: Float32Array;
  private particleCount: number = 800;

  // Lighting
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private warmRimLight: THREE.PointLight;
  private portalLight: THREE.PointLight;

  // Portal mesh for Scene 04
  private portalGroup: THREE.Group;
  private portalRings: THREE.Mesh[] = [];

  // Camera targets
  private targetCamPos = new THREE.Vector3(0, 0, 7.0);
  private currentCamPos = new THREE.Vector3(0, 0, 7.0);
  private targetLookAt = new THREE.Vector3(0, 0, 0);
  private currentLookAt = new THREE.Vector3(0, 0, 0);

  // Parallax
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private quality: QualityProfile = 'HIGH';
  public currentSceneIndex: number = 0;
  private isDestroyed = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(container: HTMLElement, quality: QualityProfile = 'HIGH') {
    this.container = container;
    this.quality = quality;
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a090e, 0.045);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.copy(this.currentCamPos);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: quality !== 'LOW',
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'HIGH' ? 1.75 : 1.2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    // Initialize Lighting
    this.ambientLight = new THREE.AmbientLight(0x1a1922, 1.2);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xd9cbb3, 1.6);
    this.keyLight.position.set(4, 8, 5);
    this.scene.add(this.keyLight);

    this.warmRimLight = new THREE.PointLight(0xffa83b, 1.5, 15);
    this.warmRimLight.position.set(-3, 2, -2);
    this.scene.add(this.warmRimLight);

    this.portalLight = new THREE.PointLight(0xffdf80, 0, 20);
    this.portalLight.position.set(0, 0, 0);
    this.scene.add(this.portalLight);

    // Build Particles
    this.particleCount = quality === 'HIGH' ? 1000 : quality === 'MEDIUM' ? 500 : 220;
    const { points, pos, vel } = this.createParticleAtmosphere(this.particleCount);
    this.ambientParticles = points;
    this.particlePositions = pos;
    this.particleVelocities = vel;
    this.scene.add(this.ambientParticles);

    // Build Portal (for Scene 04 unlock)
    this.portalGroup = this.createPortalGeometry();
    this.portalGroup.visible = false;
    this.scene.add(this.portalGroup);

    // Build Cake
    this.cake = new BirthdayCake3D();
    this.cake.group.position.set(0, -0.6, 0);
    this.cake.group.visible = false;
    this.scene.add(this.cake.group);

    // Build Spatial Memories
    this.memories = new SpatialMemories3D();
    this.memories.group.position.set(0, 0, 0);
    this.memories.group.visible = false;
    this.scene.add(this.memories.group);

    // Bind event listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    // Use ResizeObserver for accurate container-based resizing (mobile, split-screen, orientation)
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
      this.resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', this.onWindowResize);
    }
    window.addEventListener('pointermove', this.onMouseMove);

    // Start render loop
    this.animate();
  }

  private createParticleAtmosphere(count: number) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 22;
      pos[idx + 1] = (Math.random() - 0.5) * 14;
      pos[idx + 2] = (Math.random() - 0.5) * 24;

      vel[idx] = (Math.random() - 0.5) * 0.005;
      vel[idx + 1] = 0.003 + Math.random() * 0.007;
      vel[idx + 2] = (Math.random() - 0.5) * 0.005;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xdfcbaf,
      size: this.quality === 'HIGH' ? 0.065 : 0.08,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geom, mat);
    return { points, pos, vel };
  }

  private createPortalGeometry(): THREE.Group {
    const group = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd97d,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    for (let i = 0; i < 4; i++) {
      const radius = 1.2 + i * 0.55;
      const ringGeom = new THREE.TorusGeometry(radius, 0.015, 12, 48);
      const ring = new THREE.Mesh(ringGeom, ringMat);
      group.add(ring);
      this.portalRings.push(ring);
    }
    return group;
  }

  public setQuality(quality: QualityProfile) {
    this.quality = quality;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'HIGH' ? 1.75 : 1.2));
  }

  private onWindowResize() {
    if (this.isDestroyed || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onMouseMove(e: MouseEvent) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.targetX = x * 0.35;
    this.mouse.targetY = y * 0.25;
  }

  public updateScene(sceneIndex: number, corridorScrollProgress = 0) {
    this.currentSceneIndex = sceneIndex;

    // Reset visibility defaults
    this.portalGroup.visible = false;
    this.cake.group.visible = false;
    this.memories.group.visible = false;

    // Camera and visibility orchestration per scene:
    switch (sceneIndex) {
      case 0: // Arrival
        this.targetCamPos.set(0, 0.1, 7.5);
        this.targetLookAt.set(0, 0, 0);
        this.ambientLight.intensity = 0.9;
        this.keyLight.intensity = 1.2;
        break;

      case 1: // Countdown
        this.targetCamPos.set(0, 0.4, 6.2);
        this.targetLookAt.set(0, 0.2, 0);
        this.ambientLight.intensity = 1.1;
        this.keyLight.intensity = 1.4;
        break;

      case 2: // Fun Zone
        this.targetCamPos.set(-1.2, 0.3, 5.8);
        this.targetLookAt.set(0, 0, 0);
        this.ambientLight.intensity = 1.3;
        break;

      case 3: // Secret Unlock
        this.portalGroup.visible = true;
        this.portalLight.intensity = 3.5;
        this.targetCamPos.set(0, 0, 4.0);
        this.targetLookAt.set(0, 0, 0);
        this.ambientLight.intensity = 2.0;
        break;

      case 4: // Birthday Celebration
        this.cake.group.visible = true;
        this.targetCamPos.set(0, 1.4, 5.0);
        this.targetLookAt.set(0, 1.1, 0);
        this.ambientLight.intensity = 1.6;
        this.keyLight.intensity = 2.2;
        break;

      case 5: // Cake Interaction (blow candle)
        this.cake.group.visible = true;
        this.targetCamPos.set(0, 2.3, 3.6);
        this.targetLookAt.set(0, 2.0, 0);
        this.ambientLight.intensity = this.cake.isExtinguished ? 1.1 : 1.8;
        break;

      case 6: // Memory Lane
        this.memories.group.visible = true;
        // Scroll travels down the corridor z: from -1.0 to -15.0
        const zPos = 1.0 - corridorScrollProgress * 15.0;
        this.targetCamPos.set(0, 0.2, zPos);
        this.targetLookAt.set(0, 0.2, zPos - 4.0);
        this.ambientLight.intensity = 1.4;
        break;

      case 7: // Final Message
        this.targetCamPos.set(0, 0.3, 5.5);
        this.targetLookAt.set(0, 0, 0);
        this.ambientLight.intensity = 1.1;
        break;
    }
  }

  private animate() {
    if (this.isDestroyed) return;
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Parallax damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth camera choreography (lerp)
    this.currentCamPos.lerp(this.targetCamPos, 0.045);
    this.currentLookAt.lerp(this.targetLookAt, 0.045);

    this.camera.position.x = this.currentCamPos.x + this.mouse.x;
    this.camera.position.y = this.currentCamPos.y + this.mouse.y;
    this.camera.position.z = this.currentCamPos.z;
    this.camera.lookAt(this.currentLookAt);

    // Update Particles
    const pos = this.particlePositions;
    const vel = this.particleVelocities;
    const pCount = this.particleCount;
    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      pos[idx + 1] += vel[idx + 1];
      pos[idx] += vel[idx];

      // Subtle mouse repulsion/drift
      pos[idx] += this.mouse.x * 0.005;

      if (pos[idx + 1] > 7) {
        pos[idx + 1] = -7;
      }
      if (pos[idx] > 11) pos[idx] = -11;
      if (pos[idx] < -11) pos[idx] = 11;
    }
    this.ambientParticles.geometry.attributes.position.needsUpdate = true;

    // Update Portal animation if active
    if (this.portalGroup.visible) {
      this.portalRings.forEach((ring, idx) => {
        ring.rotation.z += delta * (0.8 + idx * 0.4);
        ring.rotation.x += delta * 0.3;
      });
    }

    // Update Cake
    if (this.cake.group.visible) {
      this.cake.update(delta);
    }

    // Update Spatial Memories
    if (this.memories.group.visible) {
      this.memories.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.onWindowResize);
    }
    window.removeEventListener('pointermove', this.onMouseMove);

    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
