import * as THREE from 'three';

export class Renderer {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  players: Map<string, { group: THREE.Group, targetPos: THREE.Vector3, targetAngle: number }> = new Map();
  interactables: Map<string, THREE.Mesh> = new Map();
  particles: THREE.Points;
  particleGeometry: THREE.BufferGeometry;
  particlePositions: Float32Array;
  particleColors: Float32Array;
  particleData: any[] = [];
  
  lastCameraX: number = 0;
  lastCameraY: number = 0;
  cameraShake: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#87ceeb'); // Bright Sky Blue
    this.scene.fog = new THREE.Fog('#87ceeb', 500, 3000);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.position.set(0, 400, 300);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.setupLights();
    this.setupEnvironment();
    this.setupParticles();
  }

  onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(500, 1000, 500);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -2000;
    sun.shadow.camera.right = 2000;
    sun.shadow.camera.top = 2000;
    sun.shadow.camera.bottom = -2000;
    sun.shadow.camera.far = 3000;
    this.scene.add(sun);

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x4caf50, 0.4);
    this.scene.add(hemiLight);
  }

  private setupEnvironment() {
    // Main Ground (Sand/Dirt)
    const groundGeo = new THREE.PlaneGeometry(4000, 4000, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: '#f4a460', // Sandy Ground
      roughness: 0.9,
      metalness: 0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grass Patches
    for (let i = 0; i < 40; i++) {
      const size = 100 + Math.random() * 300;
      const grassGeo = new THREE.CircleGeometry(size, 8);
      const grassMat = new THREE.MeshStandardMaterial({ 
        color: '#4caf50', 
        roughness: 1.0
      });
      const patch = new THREE.Mesh(grassGeo, grassMat);
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(
        (Math.random() - 0.5) * 3000,
        0.05,
        (Math.random() - 0.5) * 3000
      );
      patch.receiveShadow = true;
      this.scene.add(patch);
    }

    // Stylized Rocks and Cliffs
    const rockMat = new THREE.MeshStandardMaterial({ 
      color: '#808080', 
      roughness: 0.8,
      flatShading: true 
    });

    // Boundary Cliffs
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const dist = 1800 + Math.random() * 200;
      const scale = 100 + Math.random() * 200;
      
      const cliffGeo = new THREE.DodecahedronGeometry(scale, 0);
      const cliff = new THREE.Mesh(cliffGeo, rockMat);
      
      cliff.position.set(
        Math.cos(angle) * dist,
        scale * 0.5,
        Math.sin(angle) * dist
      );
      cliff.rotation.set(Math.random(), Math.random(), Math.random());
      cliff.scale.set(1, 1.5 + Math.random(), 1);
      cliff.castShadow = true;
      cliff.receiveShadow = true;
      this.scene.add(cliff);
    }

    // Scattered Boulders
    for (let i = 0; i < 15; i++) {
      const scale = 20 + Math.random() * 40;
      const rockGeo = new THREE.DodecahedronGeometry(scale, 0);
      const rock = new THREE.Mesh(rockGeo, rockMat);
      
      const angle = Math.random() * Math.PI * 2;
      const dist = 400 + Math.random() * 1000;
      rock.position.set(
        Math.cos(angle) * dist,
        scale * 0.5,
        Math.sin(angle) * dist
      );
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.scene.add(rock);
    }

    // Low-poly Trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5d4037', flatShading: true });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#2e7d32', flatShading: true });

    for (let i = 0; i < 20; i++) {
      const treeGroup = new THREE.Group();
      
      const trunkGeo = new THREE.CylinderGeometry(5, 8, 40, 6);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 20;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      const leafGeo = new THREE.ConeGeometry(30, 60, 6);
      const leaves = new THREE.Mesh(leafGeo, leafMat);
      leaves.position.y = 60;
      leaves.castShadow = true;
      leaves.receiveShadow = true;
      treeGroup.add(leaves);

      const angle = Math.random() * Math.PI * 2;
      const dist = 600 + Math.random() * 1200;
      treeGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      treeGroup.scale.setScalar(0.8 + Math.random() * 0.5);
      this.scene.add(treeGroup);
    }

    // Distant Mountains
    const mountMat = new THREE.MeshStandardMaterial({ color: '#a9a9a9', flatShading: true });
    for (let i = 0; i < 8; i++) {
      const mountGeo = new THREE.ConeGeometry(500, 800, 4);
      const mount = new THREE.Mesh(mountGeo, mountMat);
      const angle = (i / 8) * Math.PI * 2 + Math.random();
      const dist = 3000;
      mount.position.set(Math.cos(angle) * dist, 300, Math.sin(angle) * dist);
      mount.rotation.y = Math.random();
      this.scene.add(mount);
    }
  }

  private setupParticles() {
    const count = 1000;
    this.particleGeometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(count * 3);
    this.particleColors = new Float32Array(count * 3);

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    const mat = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    this.particles = new THREE.Points(this.particleGeometry, mat);
    this.scene.add(this.particles);

    // Light Dust/Pollen particles instead of embers
    setInterval(() => {
      this.spawnParticles((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 3000, '#ffffff', 1);
    }, 200);
  }

  spawnParticles(x: number, z: number, colorStr: string, count: number) {
    const color = new THREE.Color(colorStr);
    for (let i = 0; i < count; i++) {
      if (this.particleData.length >= 1000) break;
      this.particleData.push({
        pos: new THREE.Vector3(x, 20, z),
        vel: new THREE.Vector3((Math.random() - 0.5) * 10, Math.random() * 10, (Math.random() - 0.5) * 10),
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        color: color.clone()
      });
    }
  }

  private updateParticles() {
    const posAttr = this.particleGeometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = this.particleGeometry.getAttribute('color') as THREE.BufferAttribute;

    for (let i = 0; i < 1000; i++) {
      const p = this.particleData[i];
      if (p) {
        p.pos.add(p.vel);
        p.vel.y -= 0.2; // gravity
        p.life -= p.decay;

        if (p.life <= 0 || p.pos.y < 0) {
          this.particleData.splice(i, 1);
          posAttr.setXYZ(i, 0, -1000, 0); // Hide
        } else {
          posAttr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
          colorAttr.setXYZ(i, p.color.r, p.color.g, p.color.b);
        }
      } else {
        posAttr.setXYZ(i, 0, -1000, 0); // Hide
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  }

  render(players: any, interactables: any[], myId: string | null, map: { width: number, height: number }) {
    const me = players[myId || ''];
    const now = Date.now();

    // Camera follow
    if (me) {
      // Snap camera on first frame
      if (this.lastCameraX === 0 && this.lastCameraY === 0) {
        this.lastCameraX = me.x;
        this.lastCameraY = me.y;
      }
      this.lastCameraX += (me.x - this.lastCameraX) * 0.1;
      this.lastCameraY += (me.y - this.lastCameraY) * 0.1;
    }

    const shakeX = (Math.random() - 0.5) * this.cameraShake;
    const shakeZ = (Math.random() - 0.5) * this.cameraShake;
    this.cameraShake *= 0.9;

    this.camera.position.set(this.lastCameraX + shakeX, 400, this.lastCameraY + 300 + shakeZ);
    this.camera.lookAt(this.lastCameraX, 0, this.lastCameraY);

    // Update Players
    const activeIds = new Set(Object.keys(players));
    this.players.forEach((data, id) => {
      const serverPlayer = players[id];
      if (!activeIds.has(id) || (serverPlayer && serverPlayer.health <= 0)) {
        this.scene.remove(data.group);
        this.players.delete(id);
      }
    });

    Object.entries(players).forEach(([id, data]: [string, any]) => {
      if (data.health <= 0) return;

      let playerEntry = this.players.get(id);
      const displayColor = data.team ? (data.team === 'red' ? '#ff0000' : '#0000ff') : data.color;
      
      if (!playerEntry) {
        const group = this.createStickmanGroup(displayColor);
        const startX = isNaN(data.x) ? 0 : data.x;
        const startY = isNaN(data.y) ? 0 : data.y;
        playerEntry = { 
          group, 
          targetPos: new THREE.Vector3(startX, 0, startY),
          targetAngle: data.angle ?? 0
        };
        this.players.set(id, playerEntry);
        this.scene.add(group);
      } else {
        // Update color if team changed
        const head = playerEntry.group.getObjectByName('head') as THREE.Mesh;
        if (head && (head.material as THREE.MeshStandardMaterial).color.getHex() !== new THREE.Color(displayColor).getHex()) {
          playerEntry.group.traverse(obj => {
            if (obj instanceof THREE.Mesh && obj.name !== 'visor' && obj.name !== 'weapon' && obj.name !== 'aura' && obj.name !== 'shield_buff') {
              (obj.material as THREE.MeshStandardMaterial).color.set(displayColor);
            }
          });
        }
        if (!isNaN(data.x) && !isNaN(data.y)) {
          playerEntry.targetPos.set(data.x, 0, data.y);
        }
        if (!isNaN(data.angle)) {
          playerEntry.targetAngle = data.angle;
        }
      }

      // Interpolation
      playerEntry.group.position.lerp(playerEntry.targetPos, 0.3);
      
      // Angle interpolation
      const targetAngle = data.angle ?? 0;
      let diff = targetAngle - playerEntry.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      if (!isNaN(diff)) {
        playerEntry.group.rotation.y += diff * 0.3;
      }

      this.updateStickman(playerEntry.group, data, now);
    });

    // Update Interactables
    const activeItems = new Set(interactables.map(i => i.id));
    this.interactables.forEach((mesh, id) => {
      if (!activeItems.has(id)) {
        this.scene.remove(mesh);
        this.interactables.delete(id);
      }
    });

    interactables.forEach(item => {
      if (!item.active) return;
      let mesh = this.interactables.get(item.id);
      if (!mesh) {
        mesh = this.createInteractableMesh(item.type);
        this.interactables.set(item.id, mesh);
        this.scene.add(mesh);
      }
      mesh.position.set(item.x, 15, item.y);
      mesh.rotation.y += 0.05;
    });

    this.updateParticles();
    this.renderer.render(this.scene, this.camera);
  }

  private createStickmanGroup(color: string) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), mat);
    head.position.y = 40;
    head.name = 'head';
    group.add(head);

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 25), mat);
    body.position.y = 22;
    body.name = 'body';
    group.add(body);

    // Visor (Among Us style)
    const visorGeo = new THREE.CapsuleGeometry(4, 6, 4, 8);
    const visorMat = new THREE.MeshStandardMaterial({ 
      color: '#88ccff',
      roughness: 0.1,
      metalness: 0.5
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.z = Math.PI / 2;
    visor.position.set(0, 42, 6);
    visor.name = 'visor';
    group.add(visor);

    // Arms & Legs placeholders
    const limbGeo = new THREE.CylinderGeometry(1.5, 1.5, 15);
    
    const lArm = new THREE.Mesh(limbGeo, mat);
    lArm.name = 'lArm';
    group.add(lArm);

    const rArm = new THREE.Group();
    rArm.name = 'rArmGroup';
    const rArmMesh = new THREE.Mesh(limbGeo, mat);
    rArmMesh.rotation.z = Math.PI / 2;
    rArmMesh.position.x = 7.5;
    rArm.add(rArmMesh);
    
    // Weapon
    const weapon = this.createWeaponMesh();
    weapon.name = 'weapon';
    weapon.position.x = 15;
    rArm.add(weapon);
    
    group.add(rArm);

    // Slash Arc (3D)
    const slashGeo = new THREE.TorusGeometry(60, 2, 8, 32, Math.PI * 1.5);
    const slashMat = new THREE.MeshBasicMaterial({ 
      color: '#fff', 
      transparent: true, 
      opacity: 0,
      side: THREE.DoubleSide
    });
    const slash = new THREE.Mesh(slashGeo, slashMat);
    slash.rotation.x = Math.PI / 2;
    slash.rotation.z = -Math.PI / 4;
    slash.position.y = 25;
    slash.name = 'slash';
    group.add(slash);

    const lLeg = new THREE.Mesh(limbGeo, mat);
    lLeg.name = 'lLeg';
    group.add(lLeg);

    const rLeg = new THREE.Mesh(limbGeo, mat);
    rLeg.name = 'rLeg';
    group.add(rLeg);

    // Aura (Rage/Buffs)
    const auraGeo = new THREE.CylinderGeometry(20, 20, 50, 16, 1, true);
    const auraMat = new THREE.MeshBasicMaterial({ 
      color: '#ff0000', 
      transparent: true, 
      opacity: 0, 
      side: THREE.DoubleSide 
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.name = 'aura';
    aura.position.y = 25;
    group.add(aura);

    // Shield Buff Visual
    const shieldBuffGeo = new THREE.SphereGeometry(35, 16, 16);
    const shieldBuffMat = new THREE.MeshBasicMaterial({ 
      color: '#00ffff', 
      transparent: true, 
      opacity: 0,
      wireframe: true
    });
    const shieldBuff = new THREE.Mesh(shieldBuffGeo, shieldBuffMat);
    shieldBuff.name = 'shield_buff';
    shieldBuff.position.y = 25;
    group.add(shieldBuff);

    group.traverse(obj => { if (obj instanceof THREE.Mesh) obj.castShadow = true; });
    return group;
  }

  private createWeaponMesh() {
    const group = new THREE.Group();
    
    // Blade
    const bladeGeo = new THREE.BoxGeometry(40, 6, 2);
    const bladeMat = new THREE.MeshStandardMaterial({ 
      color: '#aaa', 
      metalness: 0.9, 
      roughness: 0.1,
      emissive: '#333'
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.x = 20;
    group.add(blade);

    // Hilt
    const hiltGeo = new THREE.BoxGeometry(4, 20, 4);
    const hiltMat = new THREE.MeshStandardMaterial({ color: '#333' });
    const hilt = new THREE.Mesh(hiltGeo, hiltMat);
    group.add(hilt);

    return group;
  }

  private createInteractableMesh(type: string) {
    let geo;
    let color;
    let emissive;

    switch (type) {
      case 'health':
        geo = new THREE.BoxGeometry(20, 20, 20);
        color = '#ff4444';
        emissive = '#440000';
        break;
      case 'speed':
        geo = new THREE.OctahedronGeometry(15);
        color = '#44ffff';
        emissive = '#004444';
        break;
      case 'damage':
        geo = new THREE.TorusGeometry(12, 4, 8, 16);
        color = '#ffaa00';
        emissive = '#442200';
        break;
      case 'shield':
        geo = new THREE.SphereGeometry(15, 8, 8);
        color = '#4444ff';
        emissive = '#000044';
        break;
      default:
        geo = new THREE.BoxGeometry(10, 10, 10);
        color = '#ffffff';
        emissive = '#333333';
    }

    const mat = new THREE.MeshStandardMaterial({ color, emissive });
    return new THREE.Mesh(geo, mat);
  }

  private updateStickman(group: THREE.Group, data: any, now: number) {
    // group.position and rotation are handled by interpolation in render()
    
    const moving = data.moving;
    const walkSpeed = 0.015;
    const walkCycle = moving ? Math.sin(now * walkSpeed) : 0;
    const walkCycleCos = moving ? Math.cos(now * walkSpeed) : 0;
    
    const limbSwing = walkCycle * 0.6;
    const bounce = moving ? Math.abs(Math.sin(now * walkSpeed)) * 3 : 0;
    const bodyTilt = moving ? 0.15 : 0;
    const torsoTwist = moving ? walkCycle * 0.1 : 0;

    const head = group.getObjectByName('head')!;
    const body = group.getObjectByName('body')!;
    const visor = group.getObjectByName('visor')!;
    const lArm = group.getObjectByName('lArm')!;
    const rArmGroup = group.getObjectByName('rArmGroup')!;
    const lLeg = group.getObjectByName('lLeg')!;
    const rLeg = group.getObjectByName('rLeg')!;
    const slash = group.getObjectByName('slash')! as THREE.Mesh;
    const aura = group.getObjectByName('aura')! as THREE.Mesh;
    const shieldBuff = group.getObjectByName('shield_buff')! as THREE.Mesh;
    const weapon = group.getObjectByName('weapon')! as THREE.Group;

    // Buff Visuals
    const isRaging = data.buffs.rage > now;
    const isGuarding = data.buffs.guard > now;
    const hasShield = data.buffs.shield > now;
    const hasDamage = data.buffs.damage > now;
    const hasSpeed = data.buffs.speed > now;

    // Aura Logic
    if (isRaging) {
      (aura.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(now * 0.01) * 0.1;
      (aura.material as THREE.MeshBasicMaterial).color.set('#ff0000');
      aura.scale.setScalar(1 + Math.sin(now * 0.005) * 0.1);
      if (Math.random() > 0.8) this.spawnParticles(data.x, data.y, '#ff0000', 1);
    } else if (hasSpeed) {
      (aura.material as THREE.MeshBasicMaterial).opacity = 0.2;
      (aura.material as THREE.MeshBasicMaterial).color.set('#00ffff');
      if (Math.random() > 0.9) this.spawnParticles(data.x, data.y, '#00ffff', 1);
    } else {
      (aura.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    // Shield Logic
    if (hasShield || isGuarding) {
      (shieldBuff.material as THREE.MeshBasicMaterial).opacity = isGuarding ? 0.6 : 0.3;
      (shieldBuff.material as THREE.MeshBasicMaterial).color.set(isGuarding ? '#ffff00' : '#00ffff');
      shieldBuff.scale.setScalar(isGuarding ? 1.2 : 1.0);
    } else {
      (shieldBuff.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    // Weapon Glow
    const blade = weapon.children[0] as THREE.Mesh;
    if (hasDamage || isRaging) {
      (blade.material as THREE.MeshStandardMaterial).emissive.set(isRaging ? '#ff0000' : '#ffaa00');
      (blade.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
    } else {
      (blade.material as THREE.MeshStandardMaterial).emissive.set('#333');
      (blade.material as THREE.MeshStandardMaterial).emissiveIntensity = 1;
    }

    // Animation logic for attack
    const attackDuration = 1500;
    const timeSinceAttack = Math.max(0, now - (data.lastAttack || 0));
    const attackProgress = Math.min(1, timeSinceAttack / attackDuration);
    const isAttacking = attackProgress < 1;

    let attackAngle = 0;
    let attackScale = 1;
    let arcAlpha = 0;
    let attackBodyTwist = 0;
    let attackBodyLean = 0;

    if (isAttacking) {
      if (attackProgress < 0.25) {
        // Wind-up
        const p = attackProgress / 0.25;
        attackAngle = Math.PI / 2 - p * (Math.PI * 0.75);
        attackScale = 1 + p * 0.2;
        attackBodyTwist = -p * 0.4;
      } else if (attackProgress < 0.65) {
        // Strike
        const p = (attackProgress - 0.25) / 0.4;
        const ease = 1 - Math.pow(1 - p, 2);
        attackAngle = -Math.PI / 4 + ease * (Math.PI * 1.5);
        attackScale = 1.2 + Math.sin(p * Math.PI) * 0.4;
        attackBodyTwist = -0.4 + ease * 1.2;
        attackBodyLean = Math.sin(p * Math.PI) * 0.3;
        arcAlpha = 0.8;
        if (p > 0.4 && p < 0.6) {
          this.cameraShake = 10;
          if (Math.random() > 0.8) this.spawnParticles(data.x, data.y, '#fff', 5);
        }
      } else {
        // Recovery
        const p = (attackProgress - 0.65) / 0.35;
        const ease = Math.pow(p, 2);
        attackAngle = Math.PI * 1.25 - ease * (Math.PI);
        attackScale = 1.2 - ease * 0.2;
        attackBodyTwist = 0.8 * (1 - ease);
        arcAlpha = 0.8 * (1 - p);
      }
    }

    // Apply Body & Head positions
    const totalBounce = bounce + (isAttacking ? -Math.abs(attackBodyLean) * 5 : 0);
    head.position.y = 40 + totalBounce;
    head.rotation.y = torsoTwist + attackBodyTwist * 0.5;
    head.rotation.x = bodyTilt;

    body.position.y = 22 + totalBounce;
    body.rotation.x = bodyTilt + attackBodyLean;
    body.rotation.y = torsoTwist + attackBodyTwist;

    visor.position.y = 42 + totalBounce;
    visor.rotation.y = torsoTwist + attackBodyTwist * 0.5;
    visor.rotation.x = bodyTilt;

    // Update Slash
    (slash.material as THREE.MeshBasicMaterial).opacity = arcAlpha;
    slash.rotation.z = -Math.PI / 4; 
    if (isAttacking && attackProgress >= 0.25) {
      const p = (attackProgress - 0.25) / 0.4;
      const ease = 1 - Math.pow(1 - p, 2);
      slash.rotation.z = -Math.PI / 4 + ease * (Math.PI * 1.5) - (Math.PI * 0.75);
      slash.rotation.y = attackBodyTwist;
    }

    // Arms
    rArmGroup.position.set(0, 25 + totalBounce, 0);
    if (isAttacking) {
      rArmGroup.rotation.z = attackAngle;
      rArmGroup.rotation.y = attackBodyTwist;
      rArmGroup.scale.set(attackScale, attackScale, attackScale);
    } else {
      rArmGroup.rotation.z = -Math.PI / 4 + Math.sin(now * 0.002) * 0.1;
      rArmGroup.rotation.y = torsoTwist;
      rArmGroup.scale.set(1, 1, 1);
    }

    lArm.position.set(0, 25 + totalBounce, 0);
    lArm.rotation.z = Math.PI / 4 - (moving ? walkCycle * 0.4 : 0);
    lArm.rotation.y = torsoTwist + (isAttacking ? attackBodyTwist * 0.5 : 0);
    lArm.position.x = -8;

    // Legs
    lLeg.position.set(-5, 10 + totalBounce, 0);
    lLeg.rotation.x = limbSwing + bodyTilt;
    
    rLeg.position.set(5, 10 + totalBounce, 0);
    rLeg.rotation.x = -limbSwing + bodyTilt;

    // Hit flash
    const isHit = now - data.lastHit < 150;
    group.traverse(obj => {
      if (obj instanceof THREE.Mesh && (obj.material as any).emissive) {
        (obj.material as THREE.MeshStandardMaterial).emissive.set(isHit ? '#ff0000' : '#000000');
      }
    });
  }
}
