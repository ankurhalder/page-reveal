import { useEffect } from "react";
import * as THREE from "three";
import { TweenMax, Power1 } from "gsap";

import "./styles.scss";

const RevealEffect = () => {
  let renderer, scene, camera;
  let width, height, wWidth, wHeight;
  const conf = {
    objectWidth: 12,
    objectThickness: 3,
    ambientColor: 0x808080,
    perspective: 75,
    cameraZ: 75,
  };

  let objects = [];
  let geometry, material;
  let nx, ny;

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      conf.perspective,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = conf.cameraZ;

    scene = new THREE.Scene();
    geometry = new THREE.BoxGeometry(
      conf.objectWidth,
      conf.objectWidth,
      conf.objectThickness
    );

    window.addEventListener("load", initScene);
    window.addEventListener("resize", onResize);
    animate();
  };

  const initScene = () => {
    onResize();
    scene = new THREE.Scene();
    initLights();
    initObjects();
  };

  const initLights = () => {
    scene.add(new THREE.AmbientLight(conf.ambientColor));
    let light = new THREE.PointLight(0xffffff);
    light.position.z = 100;
    scene.add(light);
  };

  const initObjects = () => {
    objects = [];
    nx = Math.round(wWidth / conf.objectWidth) + 1;
    ny = Math.round(wHeight / conf.objectWidth) + 1;
    let mesh, x, y;
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 1,
        });
        mesh = new THREE.Mesh(geometry, material);
        x = -wWidth / 2 + i * conf.objectWidth;
        y = -wHeight / 2 + j * conf.objectWidth;
        mesh.position.set(x, y, 0);
        objects.push(mesh);
        scene.add(mesh);
      }
    }
    document.body.classList.add("loaded");
    startAnim();
  };

  const startAnim = () => {
    document.body.classList.remove("revealed");
    objects.forEach((mesh) => {
      mesh.rotation.set(0, 0, 0);
      mesh.material.opacity = 1;
      mesh.position.z = 0;
      let delay = Math.random() * (2 - 1) + 1;
      let rx = Math.random() * Math.PI * 2;
      let ry = Math.random() * Math.PI * 2;
      let rz = Math.random() * Math.PI * 2;
      TweenMax.to(mesh.rotation, 2, { x: rx, y: ry, z: rz, delay: delay });
      TweenMax.to(mesh.position, 2, {
        z: 80,
        delay: delay + 0.5,
        ease: Power1.easeOut,
      });
      TweenMax.to(mesh.material, 2, { opacity: 0, delay: delay + 0.5 });
    });
    setTimeout(() => {
      document.body.classList.add("revealed");
    }, 4500);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    const size = getRendererSize();
    wWidth = size[0];
    wHeight = size[1];
  };

  const getRendererSize = () => {
    const cam = new THREE.PerspectiveCamera(conf.perspective, camera.aspect);
    const vFOV = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
    const width = height * cam.aspect;
    return [width, height];
  };

  return (
    <div id="page">
      <canvas id="reveal-effect"></canvas>
    </div>
  );
};

export default RevealEffect;
