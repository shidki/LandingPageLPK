import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";

import * as THREE from "three";

export const Background = () => {

  const colorA = "#0923be";
  const colorB = "#ffad30";
  const start = 0.2;
  const end = -0.7;
  return (
    <>
    <Sphere scale={[500, 500, 500]} rotation-y={Math.PI / 2}>
        <LayerMaterial
          color={"#ffffff"}
          
          side={THREE.BackSide}
        >
          <Gradient
            colorA={colorA}
            colorB={colorB}
            axes="y"
            start={start}
            end={end}
          />
        </LayerMaterial>
      </Sphere>
      <Environment resolution={256}>
        <mesh>
            <sphereGeometry args={[1000, 60, 40]} />
            <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
        </mesh>
      <Sphere scale={[100, 100, 100]} 
        rotation-y={Math.PI / 2} 
        rotation-x={Math.PI}
      >
        <LayerMaterial
          color={"#ffffff"}
          
          side={THREE.BackSide}
        >
          <Gradient
            colorA={colorA}
            colorB={colorB}
            axes="y"
            start={start}
            end={end}
          />
        </LayerMaterial>
      </Sphere>        
    </Environment>
    </>
  );
};