import React, { useEffect, useRef } from "react";
import "../../public/mainPage/style/style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { Sakura_tree } from "./3DComponent/Sakura_tree";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Mainpage(){
    const containerRef = useRef(null);
    const shibainu = useRef(null);
    const mixer = useRef(null);
    const renderer = useRef(null);
    const camera = useRef(null);
    const scene = useRef(null);
    const animationId = useRef(null);
    const followLight = useRef(null); // Ref untuk light yang mengikuti model
    const currentSection = useRef('banner'); // Track current section

    // Array posisi model untuk setiap section - NATURAL POSITIONING & ORIENTATION
    const arrPositionModel = [
        {
            id: 'banner',
            position: {x: -6, y: 1, z: 2}, // Samping kiri gunung 
            rotation: {x: 0, y: 1.5, z: 0} // Ngehadap ke kanan (ke gunung)
        },
        {
            id: "intro",
            position: { x: -8, y: 3, z: 5 }, // Di area sakura (posisi oke)
            rotation: { x: 0.1, y: 1.2, z: 0 }, // Ngehadap kanan
        },
        {
            id: "description", 
            position: { x: 7, y: 2, z: 5 }, // Area daun
            rotation: { x: 0, y: -4, z: 0 }, // Ngehadap kiri
        },
        {
            id: "contact",
            position: { x: -40, y: 1, z: 0 }, // JAUH ke kiri sampai ga keliatan (flying away effect)
            rotation: { x: 0.1, y: -1.5, z: 0 }, // Ngehadap kiri (arah terbang)
        },
    ];

    const modelMove = () => {
        if (!shibainu.current) return;
        
        const sections = document.querySelectorAll('.section');
        let detectedSection = 'banner'; // default
        
        // IMPROVED SECTION DETECTION
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionMiddle = rect.top + rect.height / 2;
            
            // Jika bagian tengah section berada di viewport
            if (sectionMiddle >= 0 && sectionMiddle <= window.innerHeight) {
                detectedSection = section.id;
            }
            
            // Atau jika section mengisi sebagian besar viewport
            if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3) {
                detectedSection = section.id;
            }
        });
        
        // Debug: log perubahan section (comment if not needed)
        if (currentSection.current !== detectedSection) {
            // console.log(`🔄 Section berubah dari "${currentSection.current}" ke "${detectedSection}"`);
            currentSection.current = detectedSection;
        }
        
        let position_active = arrPositionModel.findIndex(
            (val) => val.id === detectedSection
        );
        
        if (position_active >= 0) {
            let new_coordinates = arrPositionModel[position_active];
            
            // console.log(`🎯 Moving to ${detectedSection}:`, new_coordinates.position);
            
            // GSAP animation dengan follow light
            gsap.to(shibainu.current.position, {
                x: new_coordinates.position.x,
                y: new_coordinates.position.y,
                z: new_coordinates.position.z,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    // Update follow light position untuk highlight model
                    if (followLight.current) {
                        followLight.current.position.copy(shibainu.current.position);
                        followLight.current.position.y += 2; // Sedikit di atas model
                    }
                }
            });
            
            gsap.to(shibainu.current.rotation, {
                x: new_coordinates.rotation.x,
                y: new_coordinates.rotation.y,
                z: new_coordinates.rotation.z,
                duration: 2,
                ease: "power2.out"
            });
        }
    };

    const reRender3D = () => {
        if (renderer.current && scene.current && camera.current) {
            renderer.current.render(scene.current, camera.current);
            if (mixer.current) {
                mixer.current.update(0.02);
            }
            animationId.current = requestAnimationFrame(reRender3D);
        }
    };

    const handleScroll = () => {
        if (shibainu.current) {
            modelMove();
        }
    };

    const handleResize = () => {
        if (renderer.current && camera.current) {
            renderer.current.setSize(window.innerWidth, window.innerHeight);
            camera.current.aspect = window.innerWidth / window.innerHeight;
            camera.current.updateProjectionMatrix();
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Setup camera dengan FOV dan posisi untuk track movement yang lebih besar
        camera.current = new THREE.PerspectiveCamera(
            75, // FOV lebih lebar untuk area pandang lebih luas
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.current.position.set(0, 5, 15); // Mundur lebih jauh untuk lihat range movement yang lebih besar

        // Setup scene
        scene.current = new THREE.Scene();

        // Setup renderer
        renderer.current = new THREE.WebGLRenderer({alpha: true, antialias: true});
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        renderer.current.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.current.domElement);

        // Setup lighting yang lebih kuat untuk model kecil
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.current.add(ambientLight);

        const topLight = new THREE.DirectionalLight(0xffffff, 3); // Lebih terang
        topLight.position.set(5, 10, 5);
        scene.current.add(topLight);

        // Tambah side lighting yang kuat
        const sideLight = new THREE.DirectionalLight(0xffffff, 2);
        sideLight.position.set(-5, 5, 5);
        scene.current.add(sideLight);

        // Tambah point light yang akan mengikuti model untuk highlight
        followLight.current = new THREE.PointLight(0xffffff, 3, 100);
        scene.current.add(followLight.current);

        // DEBUGGING HELPERS (uncomment if needed for debugging):
        // const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        // gridHelper.position.y = -3;
        // scene.current.add(gridHelper);

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.current.add(axesHelper);

        // Target position markers (uncomment if needed for debugging):
        // const sphereGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        // arrPositionModel.forEach((pos, index) => {
        //     const marker = new THREE.Mesh(sphereGeometry, sphereMaterial);
        //     marker.position.set(pos.position.x, pos.position.y, pos.position.z);
        //     scene.current.add(marker);
        // });

        // Load GLTF model
        const loader = new GLTFLoader();
        loader.load(
            '/models/bee/phoenix_bird.glb',
            function (gltf) {
                shibainu.current = gltf.scene;
                
                // Debug ukuran model (comment if not needed)
                const box = new THREE.Box3().setFromObject(shibainu.current);
                const size = box.getSize(new THREE.Vector3());
                // console.log('🔍 Ukuran model asli:', size);
                
                // SCALE TETAP KECIL seperti yang diminta
                shibainu.current.scale.setScalar(0.01); // Tetap 1% seperti request
                
                // Set posisi awal dengan follow light
                shibainu.current.position.set(0, 0, 0);
                shibainu.current.rotation.set(0, 0, 0);
                
                // Set initial follow light position
                if (followLight.current) {
                    followLight.current.position.set(0, 2, 0);
                }
                
                // Debug ukuran setelah scale (comment if not needed)
                const boxAfter = new THREE.Box3().setFromObject(shibainu.current);
                const sizeAfter = boxAfter.getSize(new THREE.Vector3());
                // console.log('✅ Ukuran model setelah scale (tetap 1%):', sizeAfter);
                
                // Bounding box helper (uncomment if needed for debugging):
                // const helper = new THREE.BoxHelper(shibainu.current, 0xff0000);
                // helper.scale.setScalar(10);
                // scene.current.add(helper);
                
                scene.current.add(shibainu.current);

                // Setup animation mixer
                if (gltf.animations.length > 0) {
                    mixer.current = new THREE.AnimationMixer(shibainu.current);
                    const action = mixer.current.clipAction(gltf.animations[0]);
                    action.play();
                    // console.log('🎬 Animation started');
                }
                
                // Initial model movement
                modelMove();
                
                // console.log('🎉 Model loaded and ready for movement!');
                // console.log('📍 Initial position:', shibainu.current.position);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('❌ Error loading model:', error);
            }
        );

        // Start animation loop
        reRender3D();

        // Add event listeners dengan throttling untuk performance
        let scrollTimeout;
        const throttledScroll = () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 100); // Throttle scroll events
        };

        window.addEventListener('scroll', throttledScroll);
        window.addEventListener('resize', handleResize);

        // Initial call untuk set posisi awal
        setTimeout(() => {
            modelMove();
        }, 1000);

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('resize', handleResize);

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            if (animationId.current) {
                cancelAnimationFrame(animationId.current);
            }

            if (renderer.current) {
                if (containerRef.current && renderer.current.domElement) {
                    containerRef.current.removeChild(renderer.current.domElement);
                }
                renderer.current.dispose();
            }

            if (scene.current) {
                scene.current.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            if (mixer.current) {
                mixer.current.stopAllAction();
            }
        };
    }, []);

    return (
        <>
        <div className="section" id="banner">
            <div className="content-fit">
                <div className="title" data-before="LPK JEPANG">KUBOU GENIUS</div>
            </div>
            <img src="/images/fuji.png" className="decorate" alt="" style={{width: '100vw', bottom: 0, right: 0, height: '50vh'}} />
        </div>
        <div className="section" id="intro">
            <div className="content-fit">
                 <div className="number">
                    <div 
                        className="decorate" 
                        style={{
                            width: '30vw', 
                            height: '40vw',
                            bottom: "100px", 
                            left: '-300px',
                            position: 'absolute'
                        }}
                    >
                        <Canvas 
                            style={{ width: '200%', height: '250%' }}
                            camera={{ 
                                position: [0, 5, 400], 
                                fov: 75 
                            }}
                        >
                            <ambientLight intensity={0.4} />
                            <directionalLight position={[10, 10, 5]} intensity={0.8} />
                            <pointLight position={[-10, -10, -10]} intensity={0.3} />
                            
                            <group position={[0, -2, 0]} scale={[0.5, 0.5, 0.5]}>
                                <Sakura_tree />
                            </group>
                            <OrbitControls 
                                enableZoom={false}
                                enablePan={false}
                                enableRotate={true}
                            />
                        </Canvas>
                    </div>                      
                 </div>
                <div className="des" style={{ marginLeft: "200px" }}>
                    <div className="title">Tentang Kami</div>
                    <p>LPK Kubou Genius adalah lembaga pelatihan kerja terdepan yang berfokus mempersiapkan tenaga kerja Indonesia untuk berkarir di Jepang. 
                        Dengan pengalaman yang matang dan metode pembelajaran yang terbukti efektif, kami telah berhasil mengirimkan lulusan dari LPK kami untuk 
                        bekerja di berbagai sektor industri Jepang.Kami menyediakan pelatihan bahasa Jepang intensif, pemahaman budaya kerja Jepang, 
                        serta keterampilan teknis yang dibutuhkan industri. Tim pengajar berpengalaman dan fasilitas modern mendukung setiap peserta untuk 
                        mencapai impian karir internasional mereka.</p>
                </div>
            </div>
        </div>
        <div className="section" id="description">
            <div className="content-fit">
                <div className="des">
                    <div className="title">VISI MISI</div>
                    <div style={{ marginTop: "20px", width:"600px",textAlign:"justify" }}>
                        <h1>VISI</h1>
                        <p>
                            Menjadi lembaga pelatihan kerja terpercaya dan terdepan dalam mencetak tenaga kerja Indonesia yang kompeten, berkarakter, dan siap berkompetisi di pasar kerja Jepang.
                        </p>
                    </div>
                    <div style={{ marginTop: "20px", width:"600px",textAlign:"justify" }}>
                        <h1>MISI</h1>
                        <ul >
                            <li style={{ marginTop: "10px" }}>
                                - Menyelenggarakan program pelatihan bahasa Jepang yang berkualitas dan sesuai standar internasional (JLPT)
                            </li>
                            <li style={{ marginTop: "10px" }}>
                                - Mengembangkan kurikulum pembelajaran yang mengintegrasikan bahasa, budaya kerja, dan keterampilan teknis sesuai kebutuhan industri Jepang
                            </li>
                            <li style={{ marginTop: "10px" }}>
                                - Menyediakan fasilitas pembelajaran modern dan instruktur berpengalaman untuk mendukung proses pembelajaran yang efektif
                            </li>
                            <li style={{ marginTop: "10px" }}>
                                - Membangun kemitraan strategis dengan perusahaan-perusahaan Jepang untuk menjamin penempatan kerja lulusan
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <img src="/images/leaf1.png" className="decorate" alt="" style={{width: '50vw', bottom: "0", right: 0, zIndex: 101}} />
        </div>
        <div className="section" id="contact">
            <div className="content-fit">
                <div className="des">
                    <div className="title">KONTAK</div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Email</td>
                                <td>lpk.kubougenius@gmail.com</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>081325835578</td>
                            </tr>
                            <tr>
                                <td>Instagram</td>
                                <td>@ lpk . kubougenius</td>
                            </tr>
                            <tr>
                                <td>Website</td>
                                <td>www.Lpk.Kubougenius .com</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="sign">KUBOU GENIUS</div>
                </div>
            </div>
        </div>
        <footer style={{ textAlign:"center", padding: "20px 0px" }}>
            made by KubouGenius IT &copy; 2025
        </footer>

        {/* Container untuk Three.js scene */}
        <div ref={containerRef} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 999
        }}></div>
        </>
    )
}

export default Mainpage;