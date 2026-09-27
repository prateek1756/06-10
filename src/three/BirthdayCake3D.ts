import * as THREE from 'three';

export class BirthdayCake3D {
  public group: THREE.Group;
  public flameLight: THREE.PointLight;
  public flameMesh: THREE.Mesh;
  public smokeParticles: THREE.Points;
  public isExtinguished: boolean = false;

  private smokeGeom: THREE.BufferGeometry;
  private smokePositions: Float32Array;
  private smokeVelocities: Float32Array;
  private smokeOpacities: Float32Array;
  private smokeCount = 80;
  private time = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Ceramic / Brass Cake Stand
    const standGeom = new THREE.CylinderGeometry(2.3, 1.4, 0.4, 48);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x222226,
      roughness: 0.35,
      metalness: 0.85,
    });
    const stand = new THREE.Mesh(standGeom, standMat);
    stand.position.y = -0.2;
    this.group.add(stand);

    const plateGeom = new THREE.CylinderGeometry(2.4, 2.4, 0.08, 48);
    const plate = new THREE.Mesh(plateGeom, standMat);
    plate.position.y = 0.04;
    this.group.add(plate);

    // 2. Bottom Cake Tier (Velvety dark chocolate/cream)
    const tier1Geom = new THREE.CylinderGeometry(1.8, 1.8, 1.0, 48);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: 0x2c2627, // Warm rich truffle
      roughness: 0.65,
      metalness: 0.1,
    });
    const tier1 = new THREE.Mesh(tier1Geom, tier1Mat);
    tier1.position.y = 0.58;
    this.group.add(tier1);

    // Frosting Drip / Pearl rim
    const pearlCount = 28;
    const pearlGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const frostingMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9, // Rich vanilla cream
      roughness: 0.4,
      metalness: 0.05,
    });
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeom, frostingMat);
      pearl.position.set(Math.cos(angle) * 1.82, 1.08, Math.sin(angle) * 1.82);
      this.group.add(pearl);
    }

    // 3. Top Cake Tier
    const tier2Geom = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 48);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0x3d3536,
      roughness: 0.55,
      metalness: 0.1,
    });
    const tier2 = new THREE.Mesh(tier2Geom, tier2Mat);
    tier2.position.y = 1.48;
    this.group.add(tier2);

    // Top Frosting pearls
    const topPearlCount = 20;
    for (let i = 0; i < topPearlCount; i++) {
      const angle = (i / topPearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeom, frostingMat);
      pearl.position.set(Math.cos(angle) * 1.22, 1.88, Math.sin(angle) * 1.22);
      this.group.add(pearl);
    }

    // 4. Elegant Candle
    const candleGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 24);
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xefd8a1, // Champagne gold wax
      roughness: 0.3,
      metalness: 0.4,
    });
    const candle = new THREE.Mesh(candleGeom, candleMat);
    candle.position.y = 2.33;
    this.group.add(candle);

    // Candle Wick
    const wickGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 12);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const wick = new THREE.Mesh(wickGeom, wickMat);
    wick.position.y = 2.82;
    this.group.add(wick);

    // 5. Candle Flame (Teardrop shape)
    const flameGeom = new THREE.ConeGeometry(0.08, 0.32, 16);
    flameGeom.translate(0, 0.16, 0);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      transparent: true,
      opacity: 0.95,
    });
    this.flameMesh = new THREE.Mesh(flameGeom, flameMat);
    this.flameMesh.position.y = 2.85;
    this.group.add(this.flameMesh);

    // Inner Flame core (Hot white-gold)
    const flameCoreGeom = new THREE.ConeGeometry(0.04, 0.2, 16);
    flameCoreGeom.translate(0, 0.1, 0);
    const flameCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfffae6,
      transparent: true,
      opacity: 0.98,
    });
    const flameCore = new THREE.Mesh(flameCoreGeom, flameCoreMat);
    this.flameMesh.add(flameCore);

    // 6. Candle Point Light (Dynamic warmth)
    this.flameLight = new THREE.PointLight(0xffa733, 2.5, 9, 1.8);
    this.flameLight.position.set(0, 3.0, 0);
    this.group.add(this.flameLight);

    // 7. Smoke Particle System (when extinguished)
    this.smokeGeom = new THREE.BufferGeometry();
    this.smokePositions = new Float32Array(this.smokeCount * 3);
    this.smokeVelocities = new Float32Array(this.smokeCount * 3);
    this.smokeOpacities = new Float32Array(this.smokeCount);

    for (let i = 0; i < this.smokeCount; i++) {
      this.resetSmokeParticle(i, false);
    }

    this.smokeGeom.setAttribute('position', new THREE.BufferAttribute(this.smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 0.18,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.smokeParticles = new THREE.Points(this.smokeGeom, smokeMat);
    this.group.add(this.smokeParticles);
  }

  private resetSmokeParticle(i: number, active = true) {
    const idx = i * 3;
    this.smokePositions[idx] = (Math.random() - 0.5) * 0.05;
    this.smokePositions[idx + 1] = 2.88;
    this.smokePositions[idx + 2] = (Math.random() - 0.5) * 0.05;

    this.smokeVelocities[idx] = (Math.random() - 0.5) * 0.015;
    this.smokeVelocities[idx + 1] = 0.02 + Math.random() * 0.03;
    this.smokeVelocities[idx + 2] = (Math.random() - 0.5) * 0.015;

    this.smokeOpacities[i] = active ? 0.7 : 0;
  }

  public extinguish() {
    this.isExtinguished = true;
    this.flameMesh.visible = false;
    this.flameLight.intensity = 0;
    
    // Activate smoke
    (this.smokeParticles.material as THREE.PointsMaterial).opacity = 0.6;
    for (let i = 0; i < this.smokeCount; i++) {
      this.resetSmokeParticle(i, true);
    }
  }

  public relight() {
    this.isExtinguished = false;
    this.flameMesh.visible = true;
    this.flameLight.intensity = 2.5;
    (this.smokeParticles.material as THREE.PointsMaterial).opacity = 0;
  }

  public update(delta: number) {
    this.time += delta;

    if (!this.isExtinguished) {
      // Natural flame flicker
      const flicker = Math.sin(this.time * 18) * 0.05 + Math.cos(this.time * 29) * 0.03;
      const scaleY = 1 + Math.sin(this.time * 14) * 0.12;
      this.flameMesh.scale.set(1 + flicker, scaleY, 1 + flicker);
      this.flameMesh.rotation.z = Math.sin(this.time * 8) * 0.08;
      this.flameLight.intensity = 2.4 + Math.sin(this.time * 22) * 0.4 + Math.random() * 0.15;
    } else {
      // Smoke curls upward
      const pos = this.smokePositions;
      const vel = this.smokeVelocities;
      for (let i = 0; i < this.smokeCount; i++) {
        const idx = i * 3;
        pos[idx] += vel[idx] + Math.sin(this.time * 4 + i) * 0.003;
        pos[idx + 1] += vel[idx + 1];
        pos[idx + 2] += vel[idx + 2] + Math.cos(this.time * 4 + i) * 0.003;

        // Reset if drifted too high
        if (pos[idx + 1] > 4.5) {
          this.resetSmokeParticle(i, true);
        }
      }
      this.smokeGeom.attributes.position.needsUpdate = true;
    }

    // Slow atmospheric gentle idle rotation
    this.group.rotation.y += delta * 0.15;
  }
}
