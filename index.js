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
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 1000);
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
        meshes.forEach(mesh => mesh.visible = false)
        textSelector.material.opacity = 1 - ((100 / (1 - offsetPosition)) * (currOffset - offsetPosition))
            
    } else {
        let offset = .4;
        if (currOffset < offsetPosition) {
            textSelector.material.opacity = ((100 / ((1 - offset)*10)) * (currOffset - offset));
        }
        // if (textSelector.material.opacity !== 1) {
        //     textSelector.material.opacity = 1
        // }
        meshes.forEach(mesh => mesh.visible = true)
        group.visible = true;
    }
    camera.position.z = Math.max(initialCameraZ - initialCameraZ * currOffset, 3.2);
}, false);
window.controls = controls;
let mouseX = 0, mouseY = 0;


let group;
let meshes = [];
let amount = 100;
var dummy = new THREE.Object3D();

init()
animate();




function loadGLTF(name) {
    return new Promise((resolve, reject) => {
        let loader = new GLTFLoader();
        let dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(`./models/${name}/textures`);
        loader.setDRACOLoader(dracoLoader);
        loader.load(`./models/${name}/scene.gltf`, (gltf) => resolve(gltf),
        (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
        (error) => {
            console.error('An error happened', error);
            reject(error);
        });    
    });
}

function loadModels(group) {
    let promises = [];
    for(let i = 0; i < 3; i++) {
        promises.push(loadGLTF(`obj${i}`));
    }
    Promise.all(promises).then((data) => {
        console.log('got resposne', data);
        data.forEach((gltf, index) => {
            // scene.add(gltf.scene);
            let mesh = gltf.scene.children[0];
            let size = 90;
            mesh.position.x = Math.random() * size - size / 2//* (Math.round(Math.random()) ? -1 : 1);
            mesh.position.y = Math.random() * size - size / 2//* (Math.round(Math.random()) ? -1 : 1);
            mesh.position.z = Math.random() * size - size / 2//* (Math.round(Math.random()) ? -1 : 1);
            mesh.updateMatrix();
            
            let numBottles = 200;
            if (window.innerWidth < 500) {
                numBottles = 200;
            }
            
            // console.log('geo', geo);
            // geo.scale(0.5, 0.5, 0.5);
            // let material = new THREE.MeshNormalMaterial();

            // let instanceMesh = new THREE.InstancedMesh(geo, material, amount);
            // meshes.push(instanceMesh);
            // scene.add(instanceMesh);
            let obj = gltf.scene.children[0];
            switch (index) {
                case 0:
                    obj.scale.set(3, 3, 3);
                    break;
                case 1:
                    obj.getObjectByName("Collada_visual_scene_group").scale.set(3, 3, 3);
                    break;
                case 2:
                    obj = obj.getObjectByName('deo_body');
                    break;
                default:
                    break;
            }
            // if(index === 2) {
            //     let geo = obj;
            //     while (geo.type !== 'Mesh' || geo.children.length !== 0) {
            //         geo = geo.children[0];
            //     }
            //     geo = geo.geometry;
            //     console.log(geo)
            //     geo.scale(0.01, 0.01, 0.01);
            //     obj = geo;
            // }
            for (let i = 0; i < numBottles; i++) {
                let mesh = obj.clone();    
                
                mesh.position.x = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                mesh.position.y = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                mesh.position.z = Math.random() * 90 * (Math.round(Math.random()) ? -1 : 1);
                // while (mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 19) {
                //     mesh.position.x = Math.random() * 20 * (Math.round(Math.random()) ? -1 : 1);
                //     mesh.position.y = Math.random() * 20 * (Math.round(Math.random()) ? -1 : 1);
                //     mesh.position.z = Math.random() * 20 * (Math.round(Math.random()) ? -1 : 1);
                // }
                mesh.rotation.x = Math.random() * 2 * Math.PI;
                mesh.rotation.y = Math.random() * 2 * Math.PI;
                mesh.rotation.z = Math.random() * 2 * Math.PI;
                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                group.add(mesh);
            }
        })
    });
}

function init() {
    group = new THREE.Group();
    
    window.group = group;
    let geometry = new THREE.IcosahedronBufferGeometry(10, 0);
    let material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, shading: THREE.FlatShading });
    material.roughness = 0.8;
    loadModels(group);
    /*
    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./models/textures');
    loader.setDRACOLoader(dracoLoader);
    loader.load('./models/scene.gltf', (gltf) => {
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
            let numBottles = 4000;
            if(window.innerWidth < 500) {
                numBottles = 1000;
            }
            for (let i = 0; i < numBottles; i++) {
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
    */
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
    // 6813 1840
    var planeGeometry = new THREE.PlaneGeometry(74, 20, 1, 1);
    var texture = new THREE.TextureLoader().load('./images/logo.png');
    var planeMaterial = new THREE.MeshLambertMaterial({ map: texture, transparent:true, antialias:true });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = 'text';
    textSelector = plane;
    plane.material.opacity = 0;
    // plane.visible = false;
    // rotate and position the plane
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.set(0, 0, 0);
    scene.add(plane);
    // fetch('./images/logo.png').then(img => {
    //     // use the image, e.g. draw part of it on a canvas
    //     var canvas = document.createElement('canvas');
    //     var context = canvas.getContext('2d');
    //     context.drawImage(image, 100, 100);
    // })
    // createTextMesh('GENCO').then(mesh => {
    //     scene.add(mesh);
    // })
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
    // for (let i = 0; i < group.children.length; i++) {
    //     group.children[i].rotation.x += 0.01 * Math.random() - 0.01;
    //     group.children[i].rotation.y += 0.01 * Math.random() - 0.01;
    //     group.children[i].rotation.z += 0.01 * Math.random() - 0.01;
    // }
    // animateMeshes();
    renderer.render(scene, camera);
}

function animateMeshes() {
    if(meshes.length) {
        meshes.forEach(mesh => {
            let time = Date.now() * 0.001;
            mesh.rotation.x = Math.sin(time / 4);
            mesh.rotation.y = Math.sin(time / 2);
            let i = 0;
            let offset = (amount - 1) / 2;
            for (let x = 0; x < amount; x++) {
                for (let y = 0; y < amount; y++) {
                    for (let z = 0; z < amount; z++) {
                        dummy.position.set(offset - x, offset - y, offset - z);
                        dummy.rotation.y = (Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time));
                        dummy.rotation.z = dummy.rotation.y * 2;
                        dummy.updateMatrix();
                        mesh.setMatrixAt(i++, dummy.matrix);
                    }
                }
            }
            mesh.instanceMatrix.needsUpdate = true;
        })
    }
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
    let size = 28;
    if (window.innerWidth <= 500) {
        size = 10
    }
    let textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: size,
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
    
    
    let textOffset = 5;
    if (window.innerWidth <= 500) {
        textOffset = 2;
    }
    mesh.position.y += textOffset;
    mesh.name = 'text';
    textSelector = mesh;
    mesh.material.opacity = 0;
    // if (!textSelector) {
    //     let text = scene.children.filter(child => child.name === 'text');
    //     if (text && text.length) {
    //         textSelector = text[0];
    //     }
    // }
    return mesh;
}