import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

class THREESceen {
  constructor() {
    this.container;
    this.camera;
    this.scene;
    this.renderer;
    this.controls;
    this.material;
    this.uniforms;
    this.geometry;
    this.mesh;
  }

  setup() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);

    this.container = document.getElementById('container');
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );
    this.camera.position.set(0, 0, 5);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.createPlane();
    this.onWindowResize();
    this.eventListeners();
  }

  createPlane() {
    this.uniforms = {
      u_time: { type: 'f', value: 0 },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
      u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: this.uniforms,
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  updateMousePositions() {
    this.uniforms.u_mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.uniforms.u_mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    this.uniforms.u_time.value += 0.05;
    this.renderer.render(this.scene, this.camera);
  }

  eventListeners() {
    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('mousemove', this.updateMousePositions, false);
  }
}

const threeScene = new THREESceen();

threeScene.setup();
threeScene.animate();
