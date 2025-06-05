import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ScrollControls } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Overlay } from "./components/overlay";

function App() {
  return (
    <>
      <Canvas>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={5} damping={0.3}>
        <Experience />
        </ScrollControls>
        {/* <EffectComposer>
          <Noise opacity={0.2}/>
        </EffectComposer> */}

      </Canvas>
      {/* <Overlay/> */}
    </>
  );
}

export default App;
