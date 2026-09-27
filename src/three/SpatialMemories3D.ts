import * as THREE from 'three';
import { MEMORIES_DATA, MemoryItem } from '../data/memories';

export class SpatialMemories3D {
  public group: THREE.Group;
  private frameMeshes: { mesh: THREE.Group; item: MemoryItem; initialY: number }[] = [];
  private time = 0;

  constructor() {
    this.group = new THREE.Group();
    this.createFrames();
  }

  private createCardTexture(item: MemoryItem): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d')!;

    // Vintage polaroid cream background
    ctx.fillStyle = '#17161c';
    ctx.fillRect(0, 0, 512, 680);

    // Inner photo area
    ctx.fillStyle = '#222129';
    ctx.fillRect(32, 32, 448, 448);

    // Subtle border inside photo area
    ctx.strokeStyle = '#383642';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 448, 448);

    // Minimalist placeholder art / graphic inside photo
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.beginPath();
    ctx.arc(256, 256, 90, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.font = '600 24px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.tag.toUpperCase(), 256, 250);

    ctx.fillStyle = 'rgba(240, 230, 210, 0.5)';
    ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Polaroid Memory', 256, 280);

    // Bottom polaroid caption area
    ctx.fillStyle = '#e8dec8';
    ctx.font = 'bold 26px "Cinzel", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.title, 40, 530);

    ctx.fillStyle = '#9e978b';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(item.date, 40, 565);

    ctx.fillStyle = '#cfc6b4';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    // Word wrap short description
    const words = item.description.split(' ');
    let line = '';
    let y = 605;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 430 && n > 0) {
        ctx.fillText(line, 40, y);
        line = words[n] + ' ';
        y += 24;
        if (y > 650) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 40, y);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  private createFrames() {
    MEMORIES_DATA.forEach((item) => {
      const frameGroup = new THREE.Group();
      frameGroup.position.set(item.x, item.y, item.z);
      frameGroup.rotation.y = item.rotationY;

      // Outer gold/slate rim
      const borderGeom = new THREE.BoxGeometry(2.2, 2.9, 0.08);
      const borderMat = new THREE.MeshStandardMaterial({
        color: 0x1f1e24,
        roughness: 0.3,
        metalness: 0.7,
      });
      const borderMesh = new THREE.Mesh(borderGeom, borderMat);
      frameGroup.add(borderMesh);

      // Card Face with canvas texture
      const cardGeom = new THREE.PlaneGeometry(2.0, 2.7);
      const cardTex = this.createCardTexture(item);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        side: THREE.FrontSide,
      });
      const cardMesh = new THREE.Mesh(cardGeom, cardMat);
      cardMesh.position.z = 0.045;
      frameGroup.add(cardMesh);

      this.group.add(frameGroup);
      this.frameMeshes.push({
        mesh: frameGroup,
        item,
        initialY: item.y,
      });
    });
  }

  public update(delta: number) {
    this.time += delta;
    this.frameMeshes.forEach((frame, idx) => {
      // Gentle floating harmonic movement
      frame.mesh.position.y = frame.initialY + Math.sin(this.time * 1.2 + idx * 1.5) * 0.08;
      frame.mesh.rotation.z = Math.sin(this.time * 0.8 + idx) * 0.015;
    });
  }
}
