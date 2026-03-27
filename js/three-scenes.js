/**
 * HARMONY FLOW 2026 - 3D SCENES
 * SPINE ORB & BODY FLOW EXPLORER
 */

// ---------------------------------------------------------
// 1. SPINE ORB (HEADER)
// ---------------------------------------------------------
const initSpineOrb = () => {
    const container = document.getElementById('spine-orb-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(40, 40);
    container.appendChild(renderer.domElement);

    // Outer Sphere (Glass)
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x8B6347,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Inner "Spine" (Points)
    const spinePoints = [];
    for (let i = 0; i < 20; i++) {
        spinePoints.push(new THREE.Vector3(0, (i / 10) - 1, 0));
    }
    const spineGeometry = new THREE.BufferGeometry().setFromPoints(spinePoints);
    const spineMaterial = new THREE.LineBasicMaterial({ color: 0x8B6347 });
    const spineLine = new THREE.Line(spineGeometry, spineMaterial);
    orb.add(spineLine);

    const light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const animate = () => {
        requestAnimationFrame(animate);
        orb.rotation.y += 0.02;
        orb.rotation.x += 0.01;
        renderer.render(scene, camera);
    };
    animate();
};

// ---------------------------------------------------------
// 2. BODY FLOW EXPLORER (HERO)
// ---------------------------------------------------------
const initBodyExplorer = () => {
    const canvas = document.getElementById('body-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create a "Humanoid" Group
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Material for the body (Semi-transparent / Digital Glow)
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xA07050,
        transparent: true,
        opacity: 0.2,
        emissive: 0xA07050,
        emissiveIntensity: 0.15
    });

    // Body segments
    const parts = [
        { name: 'head', geo: new THREE.SphereGeometry(0.5, 32, 32), pos: [0, 2.8, 0], data: { t: 'Kopf & Kiefer', d: 'Zentrum für Stressregulation und Cranio-Sakral Flow.' } },
        { name: 'chest', geo: new THREE.CylinderGeometry(0.6, 0.5, 2, 32), pos: [0, 1.2, 0], data: { t: 'Thorax & Lunge', d: 'Atmung ist Leben. Wir befreien den Brustkorb für maximale Kapazität.' } },
        { name: 'abdomen', geo: new THREE.SphereGeometry(0.7, 32, 32), pos: [0, -0.2, 0], data: { t: 'Abdomen & Organe', d: 'Viszerale Osteopathie für ein stabiles Immunsystem.' } },
        { name: 'hips', geo: new THREE.CylinderGeometry(0.8, 0.7, 0.8, 32), pos: [0, -1, 0], data: { t: 'Becken & Hüfte', d: 'Das Fundament deiner Aufrichtung und Stabilität.' } }
    ];

    parts.forEach(p => {
        const mesh = new THREE.Mesh(p.geo, bodyMaterial);
        mesh.position.set(...p.pos);
        mesh.userData = p.data;
        bodyGroup.add(mesh);
        
        // Add a "Glow Point" (interactive node)
        const dotGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x6B4F3A });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(0, 0, 0.6);
        mesh.add(dot);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Raycaster for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const panel = document.getElementById('body-info-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelDesc = document.getElementById('panel-desc');

    const onPointerMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onPointerClick = () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(bodyGroup.children);
        if (intersects.length > 0) {
            const object = intersects[0].object;
            panelTitle.innerText = object.userData.t;
            panelDesc.innerText = object.userData.d;
            panel.classList.add('active');
            
            // Animation for the object
            gsap.to(object.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
        }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onPointerClick);

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const animate = () => {
        requestAnimationFrame(animate);
        bodyGroup.rotation.y += 0.005;
        
        // Gentle float animation
        bodyGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        
        renderer.render(scene, camera);
    };
    animate();
};

// ---------------------------------------------------------
// 3. UNITY SYSTEM VIZ (HOLISTIC SYSTEM)
// ---------------------------------------------------------
const initUnitySystem = () => {
    const canvas = document.getElementById('unity-system-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    const pointsCount = 100;
    const pointsGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const velocities = new Float32Array(pointsCount * 3);
    
    // Human coordinates (approximate silhouette)
    for (let i = 0; i < pointsCount; i++) {
        const isHuman = i < 40;
        if (isHuman) {
            // Head, Thorax, Pelvis, Arms, Legs nodes
            const head = i < 5;
            const thorax = i >= 5 && i < 15;
            const pelvis = i >= 15 && i < 25;
            if (head) { positions[i*3] = (Math.random()-0.5)*0.8; positions[i*3+1] = 3.5 + (Math.random()-0.5)*0.8; }
            else if (thorax) { positions[i*3] = (Math.random()-0.5)*1.2; positions[i*3+1] = 1.5 + (Math.random()-0.5)*1.5; }
            else if (pelvis) { positions[i*3] = (Math.random()-0.5)*1; positions[i*3+1] = -0.5 + (Math.random()-0.5)*1; }
            else { positions[i*3] = (Math.random()-0.5)*4; positions[i*3+1] = (Math.random()-0.5)*8; }
        } else {
            // Surrounding "field" nodes
            positions[i*3] = (Math.random() - 0.5) * 15;
            positions[i*3+1] = (Math.random() - 0.5) * 15;
        }
        positions[i*3+2] = (Math.random() - 0.5) * 3;
        velocities[i*3] = (Math.random() - 0.5) * 0.01;
        velocities[i*3+1] = (Math.random() - 0.5) * 0.01;
        velocities[i*3+2] = (Math.random() - 0.5) * 0.01;
    }

    pointsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({ size: 0.1, color: 0x6B4F3A, transparent: true, opacity: 0.8 });
    const pointsMesh = new THREE.Points(pointsGeom, pointsMat);
    scene.add(pointsMesh);

    // Line System for connections
    const segments = pointsCount * pointsCount;
    const linePositions = new Float32Array(segments * 6);
    const lineColors = new Float32Array(segments * 6);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.2 });
    const linesMesh = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(linesMesh);

    // Interaction mouse
    const mouse = new THREE.Vector2(-10, -10);
    const target = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        const posAttr = pointsGeom.attributes.position;
        const lineAttr = lineGeom.attributes.position;
        const colorAttr = lineGeom.attributes.color;
        let lineIndex = 0;

        raycaster.setFromCamera(mouse, camera);
        const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        raycaster.ray.intersectPlane(mousePlane, target);

        for (let i = 0; i < pointsCount; i++) {
            const ix = posAttr.getX(i);
            const iy = posAttr.getY(i);
            const iz = posAttr.getZ(i);

            // Brownian motion
            posAttr.setX(i, ix + velocities[i*3]);
            posAttr.setY(i, iy + velocities[i*3+1]);
            posAttr.setZ(i, iz + velocities[i*3+2]);

            // Interact with mouse
            const dx = ix - target.x;
            const dy = iy - target.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 4) {
                const force = (4 - dist) * 0.01;
                posAttr.setX(i, ix + (dx/dist) * force);
                posAttr.setY(i, iy + (dy/dist) * force);
            }

            // Draw connections
            for (let j = i + 1; j < pointsCount; j++) {
                const jx = posAttr.getX(j);
                const jy = posAttr.getY(j);
                const jz = posAttr.getZ(j);

                const dix = ix - jx;
                const diy = iy - jy;
                const d = Math.sqrt(dix*dix + diy*diy);

                if (d < 3.5) {
                    lineAttr.setXYZ(lineIndex, ix, iy, iz);
                    lineAttr.setXYZ(lineIndex + 1, jx, jy, jz);
                    
                    const alpha = 1.0 - (d / 3.5);
                    lineColors[lineIndex * 3] = lineColors[lineIndex * 3 + 1] = lineColors[lineIndex * 3 + 2] = alpha * 0.4;
                    lineColors[(lineIndex + 1) * 3] = lineColors[(lineIndex + 1) * 3 + 1] = lineColors[(lineIndex + 1) * 3 + 2] = alpha * 0.4;

                    lineIndex += 2;
                }
            }
        }
        
        posAttr.needsUpdate = true;
        lineAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
        lineGeom.setDrawRange(0, lineIndex);

        renderer.render(scene, camera);
    };

    const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    };
    resize();
    window.addEventListener('resize', resize);

    animate();
};

// Initialize everything
window.addEventListener('load', () => {
    initSpineOrb();
    initUnitySystem();
});
