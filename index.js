import * as THREE from 'three';
import {OrbitControls} from 'jsm/controls/OrbitControls.js';
import getStarfield from './getStarfield.js';
import getFresnel from './getFresnel.js';
// import getMoon from './getMoon.js';
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI / 180); // tilt the earth
scene.add(earthGroup);

new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, detail);
const mat = new THREE.MeshStandardMaterial({
    map: loader.load('assets/4_no_ice_clouds_mts_16k.jpg'),
    });

const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);


const lightMat = new THREE.MeshBasicMaterial({
    
    map: loader.load('assets/5_night_16k.jpg'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.2,
});

const lightsMesh = new THREE.Mesh(geo, lightMat);
earthGroup.add(lightsMesh);
// const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
// scene.add(hemiLight);
const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load('assets/storm_clouds_8k.jpg'),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const cloudMesh = new THREE.Mesh(geo, cloudMat);
cloudMesh.scale.setScalar(1.003);
earthGroup.add(cloudMesh);

const fresnelMesh = getFresnel({ rimHex: 0x0088ff });
// fresnelMesh.scale.setScalar(1.001);
earthGroup.add(fresnelMesh);

const stars = getStarfield({radius: 100, count: 500});
scene.add(stars);


const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5)
scene.add(sunLight);
// scene.add(new THREE.AmbientLight(0xffffff, 0.002));
function animate(t=0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y    += 0.002;
    lightsMesh.rotation.y   += 0.002;
    cloudMesh.rotation.y    += 0.0021;
    renderer.render(scene, camera);
}
animate();

