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

// Initialize everything
window.addEventListener('load', () => {
    initSpineOrb();
    initBodyExplorer();
});
