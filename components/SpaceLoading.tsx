"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SpaceLoadingProps {
    progressd: number;
  }

export const SpaceLoading = ({ progressd }: SpaceLoadingProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(progressd);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '0';
    canvasContainer.style.left = '0';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100%';
    mountRef.current.appendChild(canvasContainer);
    canvasContainer.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 30;

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create a planet
    // const planetGeometry = new THREE.SphereGeometry(5, 32, 32);
    // const planetMaterial = new THREE.MeshPhongMaterial({
    //   color: 0x4169e1,
    //   shininess: 10,
    // });
    // const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    // scene.add(planet);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
    //   planet.rotation.y += 0.005;
      stars.rotation.y -= 0.0005;
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Loading simulation
    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        // Random increment to make it look more natural
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // Cleanup
    return () => {
      clearInterval(loadingInterval);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(canvasContainer);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
        {/* This div will contain the Three.js canvas */}
      </div>
      <div style={{
        width: '80%',
        maxWidth: '500px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 0 20px rgba(65, 105, 225, 0.5)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          color: '#fff',
          fontSize: '1.5rem',
          marginBottom: '15px',
          textAlign: 'center',
          fontFamily: 'monospace',
          letterSpacing: '2px',
        }}>
          LOADING... {Math.round(progress)}%
        </div>
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(65, 105, 225, 0.5)',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #4169e1, #87cefa)',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px rgba(65, 105, 225, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {progress >= 20 && `${Math.round(progress)}%`}
          </div>
        </div>
        <div style={{
          marginTop: '20px',
          color: '#aaa',
          fontSize: '0.8rem',
          textAlign: 'center',
          fontFamily: 'monospace',
        }}>
          Initializing systems... {progress < 50 ? 'Starting up' : progress < 80 ? 'Loading assets' : 'Finalizing'}
        </div>
      </div>
    </div>
  );
};

export default SpaceLoading;
