import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Cloud({opacity = 1, ...props}) {
  const { nodes, materials } = useGLTF('/models/cloud/model.glb')
  
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Node.geometry}>
        <meshStandardMaterial
          envMapIntensity={2}
          transparent
          opacity={opacity}
          onBeforeCompile={(shader) => {
            // Add varying untuk world position
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
               varying vec3 vWorldPosition;`
            );
            
            shader.vertexShader = shader.vertexShader.replace(
              '#include <worldpos_vertex>',
              `#include <worldpos_vertex>
               vWorldPosition = worldPosition.xyz;`
            );

            // Fragment shader
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
               varying vec3 vWorldPosition;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              'vec4 diffuseColor = vec4( diffuse, opacity );',
              `// Fade effect based on distance to camera
               float dist = distance(cameraPosition, vWorldPosition);
               float fadeDist = 8.0;   // Mulai fade
               float maxDist = 30.0;   // Hilang total
               
               float fadeOpacity = 1.0 - smoothstep(fadeDist, maxDist, dist);
               fadeOpacity = clamp(fadeOpacity, 0.0, 1.0);
               
               vec4 diffuseColor = vec4( diffuse, fadeOpacity * opacity );`
            );
          }}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/cloud/model.glb')