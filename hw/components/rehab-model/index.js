export class RehabModelComponent {
    constructor(parent) {
        this.parent = parent;
        this.animationId = null;
        this.resizeHandler = null;
        this.renderer = null;
    }

    getHTML() {
        return `
            <section class="rehab-model-block">
                <div class="rehab-model-viewer" id="rehab-model-viewer"></div>
            </section>
        `;
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.initModel();
    }

    async initModel() {
        const modelViewer = document.getElementById('rehab-model-viewer');
        if (!modelViewer) return;

        modelViewer.innerHTML = '<div class="model-loading"></div>';

        try {
            const THREE = await import('three');
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');

            modelViewer.innerHTML = '';

            const scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0xf7f2f2, 7, 16);

            const width = modelViewer.clientWidth || 600;
            const height = modelViewer.clientHeight || 420;

            const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
            camera.position.set(3.5, 2.2, 4.8);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio || 1);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            this.renderer = renderer;
            modelViewer.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enablePan = false;
            controls.minDistance = 3.2;
            controls.maxDistance = 8;
            controls.minPolarAngle = 0.7;
            controls.maxPolarAngle = 1.5;
            controls.target.set(0, 0.8, 0);

            const ambientLight = new THREE.HemisphereLight(0xffffff, 0xf4dada, 1.35);
            scene.add(ambientLight);

            const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
            keyLight.position.set(5, 8, 4);
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.set(1024, 1024);
            scene.add(keyLight);

            const fillLight = new THREE.PointLight(0xffd6d6, 1.2, 20);
            fillLight.position.set(-3, 2, 3);
            scene.add(fillLight);

            const rimLight = new THREE.PointLight(0xffffff, 0.8, 20);
            rimLight.position.set(2, 3, -4);
            scene.add(rimLight);

            const floor = new THREE.Mesh(
                new THREE.CircleGeometry(4.8, 64),
                new THREE.MeshStandardMaterial({ color: 0xf2ebeb, roughness: 0.9, metalness: 0.05 })
            );
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -0.72;
            floor.receiveShadow = true;
            scene.add(floor);

            const pedestal = new THREE.Mesh(
                new THREE.CylinderGeometry(1.45, 1.58, 0.26, 64),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.15 })
            );
            pedestal.position.y = -0.58;
            pedestal.castShadow = true;
            pedestal.receiveShadow = true;
            scene.add(pedestal);

            const accentRing = new THREE.Mesh(
                new THREE.TorusGeometry(1.7, 0.05, 18, 90),
                new THREE.MeshStandardMaterial({ color: 0xd32f2f, emissive: 0x5a0f0f, roughness: 0.25, metalness: 0.35 })
            );
            accentRing.rotation.x = Math.PI / 2;
            accentRing.position.y = -0.44;
            scene.add(accentRing);

            const modelGroup = new THREE.Group();
            scene.add(modelGroup);

            const loader = new GLTFLoader();
            const modelUrl = new URL('../../models/accessibility-wheelchair.glb', import.meta.url);

            loader.load(
                modelUrl.href,
                (gltf) => {
                    const model = gltf.scene;
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    const box = new THREE.Box3().setFromObject(model);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());
                    const maxSide = Math.max(size.x, size.y, size.z) || 1;
                    const scale = 2.0 / maxSide;

                    model.scale.setScalar(scale);
                    model.position.sub(center.multiplyScalar(scale));
                    model.position.y += 0.18;
                    model.rotation.y = -Math.PI / 6;
                    modelGroup.add(model);
                },
                undefined,
                () => {
                    const fallbackModel = this.createProceduralWheelchair(THREE);
                    modelGroup.add(fallbackModel);
                }
            );


            const clock = new THREE.Clock();
            const animate = () => {
                this.animationId = requestAnimationFrame(animate);
                const elapsed = clock.getElapsedTime();

                controls.update();
                modelGroup.rotation.y += 0.004;
                modelGroup.position.y = 0.05 + Math.sin(elapsed * 1.4) * 0.04;
                accentRing.rotation.z += 0.004;
                renderer.render(scene, camera);
            };
            animate();

            this.resizeHandler = () => {
                const nextWidth = modelViewer.clientWidth || 600;
                const nextHeight = modelViewer.clientHeight || 420;
                camera.aspect = nextWidth / nextHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(nextWidth, nextHeight);
            };
            window.addEventListener('resize', this.resizeHandler);
        } catch (error) {
            console.error('Не удалось подключить three.js:', error);
            modelViewer.innerHTML = '<div class="model-fallback-panel"></div>';
        }
    }


    createProceduralWheelchair(THREE) {
        const chairGroup = new THREE.Group();

        const metalMaterial = new THREE.MeshStandardMaterial({ color: 0xb5bcc7, roughness: 0.35, metalness: 0.85 });
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5, metalness: 0.2 });
        const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3136, roughness: 0.8, metalness: 0.25 });
        const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.95, metalness: 0.1 });

        const bigWheelGeometry = new THREE.TorusGeometry(0.68, 0.085, 22, 80);
        const smallWheelGeometry = new THREE.TorusGeometry(0.22, 0.05, 18, 50);

        const leftWheel = new THREE.Mesh(bigWheelGeometry, tireMaterial);
        leftWheel.position.set(-0.84, 0.62, 0);
        leftWheel.rotation.y = Math.PI / 2;
        chairGroup.add(leftWheel);

        const rightWheel = leftWheel.clone();
        rightWheel.position.x = 0.84;
        chairGroup.add(rightWheel);

        const frontLeftWheel = new THREE.Mesh(smallWheelGeometry, tireMaterial);
        frontLeftWheel.position.set(-0.5, 0.22, 0.76);
        frontLeftWheel.rotation.y = Math.PI / 2;
        chairGroup.add(frontLeftWheel);

        const frontRightWheel = frontLeftWheel.clone();
        frontRightWheel.position.x = 0.5;
        chairGroup.add(frontRightWheel);

        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.95), redMaterial);
        seat.position.set(0, 1.02, 0.1);
        chairGroup.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.05, 0.12), redMaterial);
        back.position.set(0, 1.55, -0.32);
        chairGroup.add(back);

        const leftArmrest = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.85), darkMaterial);
        leftArmrest.position.set(-0.6, 1.16, 0.07);
        chairGroup.add(leftArmrest);

        const rightArmrest = leftArmrest.clone();
        rightArmrest.position.x = 0.6;
        chairGroup.add(rightArmrest);

        const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 1.1), metalMaterial);
        frameBottom.position.set(0, 0.62, 0.16);
        chairGroup.add(frameBottom);

        const footrest = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.06, 0.28), metalMaterial);
        footrest.position.set(0, 0.42, 0.98);
        chairGroup.add(footrest);

        const pushHandleLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.78, 14), metalMaterial);
        pushHandleLeft.position.set(-0.45, 1.82, -0.32);
        pushHandleLeft.rotation.z = 0.08;
        chairGroup.add(pushHandleLeft);

        const pushHandleRight = pushHandleLeft.clone();
        pushHandleRight.position.x = 0.45;
        pushHandleRight.rotation.z = -0.08;
        chairGroup.add(pushHandleRight);

        const connectorPositions = [
            [-0.46, 0.8, -0.05, 0.0, 0.45],
            [0.46, 0.8, -0.05, 0.0, -0.45],
            [-0.32, 0.72, 0.52, 0.55, 0],
            [0.32, 0.72, 0.52, -0.55, 0]
        ];

        connectorPositions.forEach(([x, y, z, rz, rx]) => {
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.08, 14), metalMaterial);
            bar.position.set(x, y, z);
            bar.rotation.z = rz;
            bar.rotation.x = rx;
            chairGroup.add(bar);
        });

        const spokeMaterial = new THREE.MeshStandardMaterial({ color: 0xe4e8ef, roughness: 0.25, metalness: 0.9 });
        [-0.84, 0.84].forEach((x) => {
            for (let i = 0; i < 6; i += 1) {
                const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.12, 10), spokeMaterial);
                spoke.position.set(x, 0.62, 0);
                spoke.rotation.y = Math.PI / 2;
                spoke.rotation.z = (Math.PI / 6) * i;
                chairGroup.add(spoke);
            }
        });

        const cross = new THREE.Group();
        const crossBarA = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xd32f2f, emissiveIntensity: 0.35 }));
        const crossBarB = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xd32f2f, emissiveIntensity: 0.35 }));
        cross.add(crossBarA, crossBarB);
        cross.position.set(0, 2.2, -1.2);
        chairGroup.add(cross);

        chairGroup.scale.setScalar(0.74);
        chairGroup.position.y = -0.02;
        return chairGroup;
    }
}
