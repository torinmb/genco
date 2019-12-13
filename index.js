import * as THREE from 'three';
//import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const container = document.querySelector('.canvas-container');
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.addEventListener('mousemove', onDocumentMouseMove, false);
// renderer.domElement.addEventListener('mousedown', this.onMouseDown, false);
// renderer.domElement.addEventListener('mouseup', this.onMouseUp, false);
// renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
// renderer.domElement.addEventListener('touchstart', this.onTouchStart, false);
// renderer.domElement.addEventListener('touchend', this.onTouchEnd, false);
// renderer.domElement.addEventListener('touchmove', this.onTouchMove, false);
container.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement, {
    enableDamping: true,
    dampingFactor: 0.25,
    minDistance: 10,
    zoomSpeed: 0.5,
    rotateSpeed: 0.5
});

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let group;


init();
animate();
function init() {
    group = new THREE.Group();
    let geometry = new THREE.IcosahedronBufferGeometry(10, 0);
    let material = new THREE.MeshStandardMaterial({ color: 0x550000, metalness: 0.2, shading: THREE.FlatShading });
    material.roughness = 0.3;
    for (let i = 0; i < 10000; i++) {
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 2000 - 1000;
        mesh.position.y = Math.random() * 2000 - 1000;
        mesh.position.z = Math.random() * 2000 - 1000;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
    }
}

let light = new THREE.AmbientLight({ color: 0xffffff });
let light2 = new THREE.PointLight({ color: 0x004455 });
scene.add(light, light2, group);
renderer.sortObjects = false;
camera.position.z = 10;
function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}

function onDocumentMouseMove(event) {
    // console.log('mouse move')
    mouseX = (event.clientX) / window.innerWidth;
    mouseY = (event.clientY) / window.innerHeight;
    let rx = Math.sin(mouseX ) * 0.5;
    let ry = Math.cos(mouseY ) * 0.5;

    group.rotation.x = rx;
    group.rotation.z = ry;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    let time = Date.now() * 0.001;

    controls.update();
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}