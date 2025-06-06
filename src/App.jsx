import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ScrollControls } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Overlay } from "./components/overlay";
import { Navigation } from "./components/Navigation";
import React from 'react';
import Mainpage from './components/Mainpage';

// Komponen untuk halaman 3D utama
function HomePage() {
  return (
    <Canvas>
      <color attach="background" args={["#ececec"]} />
      <ScrollControls pages={5} damping={0.3}>
        <Experience />
      </ScrollControls>
    </Canvas>
  );
}

// Komponen wrapper untuk conditional navigation
function AppContent() {
  const location = useLocation();
  const showNavigation = location.pathname !== '/';

  return (
    <>
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Mainpage  />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;