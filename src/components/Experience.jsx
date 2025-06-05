// EXPERIENCE.JSX - FIXED VERSION

import { Float, Html, Line, OrbitControls, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { useMemo, useRef, useState, useEffect } from "react";
import { Cloud } from "./Cloud";
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber";
import { Torii_Gate } from "./Torii_Gate";
import { Pagoda } from "./Pagoda";
import { TextSection } from "./TextSection";
import { Sakura } from "./Sakura";

export const Experience = () => {
  const curvePoints = useMemo(() => [
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,-10),
      new THREE.Vector3(-2,0,-20),
      new THREE.Vector3(-3,0,-30),
      new THREE.Vector3(0,0,-40),
      new THREE.Vector3(5,0,-50),
      new THREE.Vector3(7,0,-60),
    ],[])

  const LINE_NB_POINTS = 12000

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints,false,"catmullrom",0.5)
  },[])

  const [isHovered, setIsHovered] = useState(false);
  const [isStartButtonHovered, setIsStartButtonHovered] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // REFS untuk text fade effect
  const textRef = useRef();
  const buttonRef = useRef();
  const buttonTextRef = useRef();
  
  // REFS untuk text fade effect yang baru
  const welcomeTextRef = useRef();
  const dreamTextRef = useRef();

  // Gradient Texture untuk button
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#1c70c9');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#fbbf24');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Gradient Texture untuk hover effect
  const gradientTextureHover = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(0.5, '#a855f7');
    gradient.addColorStop(1, '#fcd34d');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create rounded box geometry
  const createRoundedBoxGeometry = (width, height, depth, radius) => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const roundedButtonGeometry = useMemo(() => 
    createRoundedBoxGeometry(2.0, 0.4, 0.3, 0.08), []
  );

  const roundedMainButtonGeometry = useMemo(() => 
    createRoundedBoxGeometry(2.5, 0.6, 0.15, 0.1), []
  );

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.3, 1.4);
    shape.lineTo(-0.5, 1.4);   
    shape.lineTo(-0.5, -1.4);
    shape.lineTo(-0.3, -1.4);
    shape.lineTo(-0.3, 1.4);
    return shape;
  },[curve])

  const cameraGroup = useRef();
  const scroll = useScroll();
  const airplane = useRef();
  const cameraResponsive = useRef();

  // AUTO SCROLL logic
  const handleStartJourney = () => {
    console.log("handleStartJourney called!");
    setHasStarted(true);
    setIsAutoScrolling(true);
  };

  // Prevent scroll until button clicked
  useEffect(() => {
    if (!hasStarted && scroll.el) {
      const preventScrollChange = () => {
        if (!hasStarted) {
          scroll.el.scrollTop = 0;
        }
      };
      
      const interval = setInterval(preventScrollChange, 16);
      return () => clearInterval(interval);
    }
  }, [hasStarted, scroll.el]);

  // Function untuk menghitung opacity berdasarkan jarak
  const calculateOpacity = (cameraZ, textZ, fadeDist = 5.0, maxDist = 12.0) => {
    const dist = Math.abs(cameraZ - textZ);
    
    let opacity;
    if (dist <= fadeDist) {
      opacity = 1.0; 
    } else if (dist >= maxDist) {
      opacity = 0.0; 
    } else {
      opacity = 1.0 - ((dist - fadeDist) / (maxDist - fadeDist));
    }
    
    return opacity;
  };

  // FIXED useFrame
  useFrame((_state, delta) => {
    // FIXED: Better responsive handling for different screen sizes
    if (cameraResponsive.current) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isSmallScreen = window.innerWidth < 768; // Better breakpoint
      
      if (isLandscape && !isSmallScreen) {
        // DESKTOP LANDSCAPE
        cameraResponsive.current.fov = 30;
        cameraResponsive.current.position.z = 5;
      } else if (isLandscape && isSmallScreen) {
        // SMALL LANDSCAPE (phone horizontal)
        cameraResponsive.current.fov = 60;
        cameraResponsive.current.position.z = 3;
      } else {
        // PORTRAIT (phone vertical)
        cameraResponsive.current.fov = 80;
        cameraResponsive.current.position.z = 2;
      }
      cameraResponsive.current.updateProjectionMatrix();
    }

    // Force scroll to 0 if not started
    if (!hasStarted && scroll.el) {
      scroll.el.scrollTop = 0;
      return;
    }

    // Auto scroll logic
    if (isAutoScrolling && scroll.offset < 0.99) {
      const currentZ = cameraGroup.current.position.z;
      
      let scrollSpeed;
      if (currentZ > -5) {
        scrollSpeed = 1.0;
      } else {
        scrollSpeed = 2.5;
      }
      
      const newOffset = Math.min(scroll.offset + (delta * scrollSpeed), 1);
      
      if (scroll.el) {
        scroll.el.scrollTop = newOffset * (scroll.el.scrollHeight - scroll.el.clientHeight);
      }
      
      if (newOffset >= 0.99) {
        setIsAutoScrolling(false);
      }
    }

    const curPointIndex = Math.min(
        Math.round(scroll.offset * linePoints.length),
        linePoints.length - 1
      );
    const curPoint = linePoints[curPointIndex];
    const pointAhead =
        linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)];
    const xDisplacement = (pointAhead.x - curPoint.x) * 80;

    const angleRotation = (xDisplacement < 0 ? 1 : -1) * Math.min(Math.abs(xDisplacement), Math.PI / 3);

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angleRotation,
      )
    )
    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraGroup.current.rotation.x,
        angleRotation,
        cameraGroup.current.rotation.z
      )
    );

    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2)
    cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2);
    cameraGroup.current.position.lerp(curPoint, delta * 24)

    // Get current camera Z position
    const cameraZ = cameraGroup.current.position.z;

    // TEXT FADE EFFECT untuk text utama
    const textZ = centerPosition[2];
    const opacity = calculateOpacity(cameraZ, textZ);
    
    if (textRef.current) {
      textRef.current.fillOpacity = opacity;
    }
    if (buttonRef.current && buttonRef.current.material) {
      buttonRef.current.material.opacity = opacity * 0.9;
    }
    if (buttonTextRef.current) {
      buttonTextRef.current.fillOpacity = opacity;
    }

    // FADE EFFECT untuk welcome text
    const welcomeTextZ = -20;
    const welcomeOpacity = calculateOpacity(cameraZ, welcomeTextZ);
    
    if (welcomeTextRef.current) {
      welcomeTextRef.current.fillOpacity = welcomeOpacity;
    }

    // FADE EFFECT untuk dream text
    const dreamTextZ = -34;
    const dreamOpacity = calculateOpacity(cameraZ, dreamTextZ);
    
    if (dreamTextRef.current) {
      dreamTextRef.current.fillOpacity = dreamOpacity;
    }
  });

  const { camera, size } = useThree();
  const centerPosition = useMemo(() => {
    const forward = new THREE.Vector3(7.2, 0, -40);
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    forward.applyQuaternion(camera.quaternion);
    
    return [
      camera.position.x + forward.x,
      camera.position.y + forward.y + 1,
      -65
    ];
  }, [camera.position, camera.quaternion]); 

  return (
    <>
      {/* DEBUG INFO - Remove this after testing */}
      {!hasStarted && (
        <Html position={[0, 3, 0]} style={{ color: 'white', fontSize: '12px' }}>
          <div>
            Screen: {window.innerWidth}x{window.innerHeight}<br/>
            HasStarted: {hasStarted ? 'true' : 'false'}<br/>
            Button should be visible
          </div>
        </Html>
      )}
      
      <directionalLight position={[0,3,1]} intensity={0.1} />
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera ref={cameraResponsive} position={[0, 0, 5]} fov={30} makeDefault/>
        <group ref={airplane}>
          <Float floatIntensity={2} speed={2}>
            <Airplane 
              rotation-y={Math.PI / 2}
              scale={[0.2,0.2,0.2]}
              position-y={-0.1}
            />
          </Float>
        </group>
      </group>

      {/* START BUTTON - show until journey starts */}
      {!hasStarted && (
        <>
          {/* DEBUG: Small test cube - remove later */}
          <mesh position={[2, 2, 1]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="red" />
          </mesh>
          
          {/* MAIN BUTTON GROUP */}
          <group position={
            window.innerWidth < 644 ? [0, 0, 0.8] :  // Close for small screens
            window.innerWidth < 768 ? [0, 0, 0.7] :  
            window.innerWidth < 1024 ? [0, 0, .8] :  
            [0, 0, .8]  
          }>
            
            {/* Button Group */}
            <group position={[0, 0, 0]} scale={
              window.innerWidth < 480 ? [0.3, 0.5, 0.7] : 
              window.innerWidth < 644 ? [0.4, 0.5, 0.6] :  // Smaller width for phones (30px margins)
              window.innerWidth < 768 ? [0.55, 0.6, 0.5] :  // Medium width for large phones
              window.innerWidth < 900 ? [.7, .7, 0.8] : 
              window.innerWidth < 1100 ? [1, 1, 0.8] : 
              window.innerWidth < 1400 ? [1.2, 0.8, 0.8] : 
              [1.5, 1.2, 1]  // Full size for desktop
            }>
              
              {/* Mobile Button - With gradient like desktop */}
              {window.innerWidth < 768 ? (
                <mesh
                  onClick={(e) => {
                    console.log("Mobile button clicked!");
                    handleStartJourney();
                  }}
                  onPointerEnter={(e) => {
                    document.body.style.cursor = 'pointer';
                    setIsStartButtonHovered(true);
                  }}
                  onPointerLeave={() => {
                    document.body.style.cursor = 'default';
                    setIsStartButtonHovered(false);
                  }}
                  scale={isStartButtonHovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
                  geometry={roundedButtonGeometry}
                >
                  <meshStandardMaterial 
                    map={isStartButtonHovered ? gradientTextureHover : gradientTexture}
                    transparent
                    opacity={0.9}
                    emissive={isStartButtonHovered ? '#222' : '#111'}
                    emissiveIntensity={0.2}
                  />
                </mesh>
              ) : (
                /* Desktop Button */
                <mesh
                  onClick={(e) => {
                    console.log("Desktop button clicked!");
                    handleStartJourney();
                  }}
                  onPointerEnter={(e) => {
                    document.body.style.cursor = 'pointer';
                    setIsStartButtonHovered(true);
                  }}
                  onPointerLeave={() => {
                    document.body.style.cursor = 'default';
                    setIsStartButtonHovered(false);
                  }}
                  scale={isStartButtonHovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
                  geometry={roundedButtonGeometry}
                >
                  <meshStandardMaterial 
                    map={isStartButtonHovered ? gradientTextureHover : gradientTexture}
                    transparent
                    opacity={0.9}
                    emissive={isStartButtonHovered ? '#222' : '#111'}
                    emissiveIntensity={0.2}
                  />
                </mesh>
              )}
              
              {/* Button Text */}
              <Text
                position={[0, 0, 0.35]}
                font="./fonts/DMSerifDisplay-Regular.ttf"
                fontSize={
                  window.innerWidth < 480 ? 0.12 :  // Very small
                  window.innerWidth < 644 ? 0.13 :  // Small phones
                  window.innerWidth < 768 ? 0.14 :  // Large phones
                  window.innerWidth < 1024 ? 0.14 :  // Large phones
                  0.09  // Desktop
                }
                color="white"
                anchorX="center"
                anchorY="middle"
                renderOrder={999}
              >
                START JOURNEY
              </Text>
              
              {/* Instructions - positioned relative to button text */}
              {/* <Text 
                font="./fonts/DMSerifDisplay-Regular.ttf" 
                textAlign="center" 
                color="white" 
                anchorX="center"
                anchorY="middle" 
                fontSize={
                  window.innerWidth < 480 ? 0.06 :  // Very small
                  window.innerWidth < 644 ? 0.07 :  // Small phones  
                  window.innerWidth < 1024 ? 0.06 :  // Small phones  
                  0.06  // Default
                } 
                maxWidth={50}
                position={[0, -0.11, 0.35]}
                fillOpacity={0.8}
              >
                Klik Tombol!
              </Text> */}
            </group>
          </group>
        </>
      )}

      {/* TEXT dengan fade effect */}
      <group position={centerPosition}>
        <Text 
          ref={textRef}
          font="./fonts/DMSerifDisplay-Regular.ttf" 
          textAlign="center" 
          color="white" 
          anchorX="center"
          anchorY="middle" 
          fontSize={0.5} 
          maxWidth={10}
        >
          KubouGenius Website
        </Text>
        
        <group position={[0, -1.2, 0]}>
          <mesh
            ref={buttonRef}
            onClick={() => {
              window.location.href = 'https://kubougenius.com';
            }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            scale={isHovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
            geometry={roundedMainButtonGeometry}
          >
            <meshStandardMaterial 
              color={isHovered ? '#5a7bd4' : '#667eea'} 
              transparent
              opacity={0.9}
              emissive={isHovered ? '#333' : '#000'}
              emissiveIntensity={0.1}
            />
          </mesh>
          
          <Text
            ref={buttonTextRef}
            position={[0, 0, 0.5]}
            font="./fonts/DMSerifDisplay-Regular.ttf"
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            HALAMAN UTAMA
          </Text>
        </group>
      </group>

      {/* Welcome text */}
      <group position={[-4.7, -0.5, -20]}>
        <Text
          ref={welcomeTextRef}
          font="./fonts/DMSerifDisplay-Regular.ttf"
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Selamat datang di {"\n"}LPK Kubou Genius!!
        </Text>
      </group>

      {/* Dream text */}
      <group position={[.2, 0, -34]}>
        <Text
          ref={dreamTextRef}
          font="./fonts/DMSerifDisplay-Regular.ttf"
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Kejar Impian {"\n"}Kerja di Jepang!!
        </Text>
      </group>

      {/* LINE */}
      <group position-y={-3.8}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,{
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve
              }
            ]}
          />
          <meshStandardMaterial color={'white'} opacity={1} transparent />
        </mesh>
      </group>

      {/* Torii Gate */}
      <Torii_Gate scale={[15, 15, -1]} position={[0, 0, -5]} />
      <Torii_Gate scale={[15, 15, -1]} position={[5.8, 0, -53]} />
      <Pagoda scale={[0.10, 0.10, 0.1]} position={[-5, -3, -35]} />

      {/* CLOUDS */}
      <Cloud opacity={1} scale={[.6, .6, .6]} position={[-3, .5, -2]} />
      <Cloud opacity={1} scale={[0.4, 0.5, 0.6]} position={[1.5, -0.5, -2]} />
      <Cloud
        opacity={1}
        scale={[0.6, 0.6, 0.6]}
        rotation-y={Math.PI / 9}
        position={[1, -0.2, -20]}
      />
      <Cloud
        opacity={1}
        scale={[0.6, 0.6, 0.6]}
        rotation-y={Math.PI / 9}
        position={[-5, -0.2, -45]}
      />
      <Cloud opacity={1} scale={[0.7, 0.7, 0.7]} position={[-1, 1, -53]} />

      {/* SAKURA */}
      <Sakura scale={[0.03, 0.03, 0.02]} position={[0.4, -3.6, -45]}/>
      <Sakura scale={[0.03, 0.03, 0.04]} position={[-4.5, -3.6, -25]}/>
    </>
  );
};