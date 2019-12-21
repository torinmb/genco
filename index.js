import * as THREE from 'three';
//import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/examples/jsm/pmrem/PMREMGenerator.js';


window.THREE = THREE;
let scene = new THREE.Scene();
window.scene = scene;
let sceneRTT = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
let initialCameraZ = 200;
camera.position.z = initialCameraZ;
window.camera = camera;

const container = document.querySelector('.canvas-container');
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, physicallyCorrectLights: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);

// renderer.domElement.addEventListener('mousedown', this.onMouseDown, false);
// renderer.domElement.addEventListener('mouseup', this.onMouseUp, false);
// renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
// renderer.domElement.addEventListener('touchstart', this.onTouchStart, false);
// renderer.domElement.addEventListener('touchend', this.onTouchEnd, false);
// renderer.domElement.addEventListener('touchmove', this.onTouchMove, false);
container.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping =  true;
controls.dampingFactor =  0.25;
controls.minDistance =  0.01;
controls.zoomSpeed =  0.5;
controls.rotateSpeed =  0.5;
controls.enableZoom = false;


let endOffset = document.querySelector('.end-intro').offsetTop - 500;
let textSelector = null;
let offsetPosition = .98;
document.addEventListener('scroll', (e) => {
    // let zoom = controls.getZoomScale();
    if(!textSelector) return;
    let currOffset = (window.pageYOffset / endOffset);
    if (currOffset > offsetPosition) {
        group.visible = false;
        textSelector.material.opacity = 1 - ((100 / (1 - offsetPosition)) * (currOffset - offsetPosition))
        console.log('textSelector', textSelector.material.opacity)
            
    } else {
        let offset = .4;
        if (currOffset < offsetPosition) {
            textSelector.material.opacity = ((100 / ((1 - offset)*10)) * (currOffset - offset));
        }
        // if (textSelector.material.opacity !== 1) {
        //     textSelector.material.opacity = 1
        // }
        group.visible = true;
    }
    camera.position.z = Math.max(initialCameraZ - initialCameraZ * currOffset, 3.2);
    console.log(scene.children);
}, false);
window.controls = controls;
let mouseX = 0, mouseY = 0;


init()
animate();


let group;

function init() {
    group = new THREE.Group();
    
    window.group = group;
    let geometry = new THREE.IcosahedronBufferGeometry(10, 0);
    let material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, shading: THREE.FlatShading });
    material.roughness = 0.8;

    let loader = new GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./models/textures');
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource
    loader.load('./models/scene.gltf', (gltf) => {
            console.log(gltf.scene);
            scene.add(gltf.scene);
            let mesh = gltf.scene.children[0];
            let size = 90;
            mesh.position.x = Math.random() * size - size/2//* (Math.round(Math.random()) ? -1 : 1);
            mesh.position.y = Math.random() * size - size/2//* (Math.round(Math.random()) ? -1 : 1);
            mesh.position.z = Math.random() * size - size/2//* (Math.round(Math.random()) ? -1 : 1);
            mesh.updateMatrix();
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Scene
            // gltf.scenes; // Array<THREE.Scene>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
            
            for (let i = 0; i < 5000; i++) {
                // let mesh = new THREE.Mesh(geometry, material);
                let mesh = gltf.scene.children[0].clone();
                mesh.position.x = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                mesh.position.y = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                mesh.position.z = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                while (mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 80 ) {
                    mesh.position.x = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                    mesh.position.y = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                    mesh.position.z = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                }
                mesh.rotation.x = Math.random() * 2 * Math.PI;
                mesh.rotation.y = Math.random() * 2 * Math.PI;
                mesh.rotation.z = Math.random() * 2 * Math.PI;
                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                group.add(mesh);
            }
        },
        (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
        (error) => console.log('An error happened'));    
    
    // for (let i = 0; i < 500; i++) {
    //     let mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = Math.random()*90 * (Math.round(Math.random()) ? -1 : 1);
    //     mesh.position.y = Math.random()*90 * (Math.round(Math.random()) ? -1 : 1);
    //     mesh.position.z = Math.random()*90 * (Math.round(Math.random()) ? -1 : 1);
    //     while (mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 90) {
    //         mesh.position.x = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
    //         mesh.position.y = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
    //         mesh.position.z = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
    //     }
    //     mesh.rotation.x = Math.random() * 2 * Math.PI;
    //     mesh.rotation.y = Math.random() * 2 * Math.PI;
    //     mesh.rotation.z = Math.random() * 2 * Math.PI;
    //     mesh.matrixAutoUpdate = false;
    //     mesh.updateMatrix();
    //     group.add(mesh);
    // }
    
    let light = new THREE.AmbientLight({ color: 0xffffff });
    let light2 = new THREE.PointLight({ color: 0x004455 });
    scene.add(light, light2, group);
    renderer.sortObjects = false;

    createTextMesh('GENCO').then(mesh => {
        mesh.position.y += 5;
        scene.add(mesh);
    })
}

function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}

function onDocumentMouseMove(event) {
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
    for (let i = 0; i < group.children.length; i++) {
        group.children[i].rotation.x += 0.01 * Math.random() - 0.01;
        group.children[i].rotation.y += 0.01 * Math.random() - 0.01;
        group.children[i].rotation.z += 0.01 * Math.random() - 0.01;
    }
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // composer.setSize(window.innerWidth, window.innerHeight)
    renderer.setSize(window.innerWidth, window.innerHeight);
}


let font = null;
function createTextMesh(text) {
    return new Promise((resolve, reject)=> {
        if(!font) {
            let fontLoader = new THREE.FontLoader();
            fontLoader.load('./fonts/SharpSansNo2Bold_Regular.json', (response) => {
                console.log('got font', response)
                font = response;
                resolve(createText(text, font));
            });
        }
    });
}

function createText(text, font) {
    let textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: 28,
        height: 5,
        curveSegments: 15,
        bevelThickness: 0.0,
        bevelSize: 0,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    textGeo.center();
    let mat = new THREE.MeshPhongMaterial({ color: 0xa1c1dd, flatShading: true, transparent: true });
    let mesh = new THREE.Mesh(textGeo, mat);
    mesh.name = 'text';
    textSelector = mesh;
    mesh,material.opacity = 0;
    // if (!textSelector) {
    //     let text = scene.children.filter(child => child.name === 'text');
    //     if (text && text.length) {
    //         textSelector = text[0];
    //     }
    // }
    console.log(mesh);
    return mesh;
}