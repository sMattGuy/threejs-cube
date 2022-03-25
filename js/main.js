import * as THREE from 'three';
import {OrbitControls} from './OrbitControls.js'
import { GLTFLoader } from './GLTFLoader.js';

let lightColor = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change',render);
controls.minDistance = 5;
controls.maxDistance = 500;
controls.enablePan = true;

//ambient light
const ambient = new THREE.AmbientLight(0x111111,0.1);
scene.add(ambient);
//end light
//spotlight
let spotLight1 = createSpotlight(0xFF0000);
let spotLight2 = createSpotlight(0x00FF00);
let spotLight3 = createSpotlight(0x0000FF);
let spotLight4 = createSpotlight(0xFFFFFF);

spotLight1.position.set(-5,5,0);
spotLight2.position.set(5,5,0);
spotLight3.position.set(0,5,5);
spotLight4.position.set(0,5,-5);

scene.add(spotLight1);
scene.add(spotLight2);
scene.add(spotLight3);
scene.add(spotLight4);
//end spotlight

//floor
let floorMaterial = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
let floorGeometry = new THREE.PlaneGeometry( 2000, 2000 );
let floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.position.set( 0, 0, 0 );
floor.rotation.x = - Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);
//end floor

let duck;
let path;
const gltfLoader = new GLTFLoader();

gltfLoader.load('../models/Duck.gltf', (gltf) => {
	duck = gltf.scene;
	duck.position.set(0,0.01,0);
	scene.add(duck);
});

camera.position.z = 10
camera.position.y = 1;

animate();

window.addEventListener( 'resize', onWindowResize );
function render() {
	renderer.render( scene, camera );
}
function animate(){
	requestAnimationFrame(animate);
	
	duck.rotation.y += 0.03;
	
	wobbleDuck();
	
	const time = Date.now()*0.0005;
	
	spotLight1.position.x = Math.sin(time*0.7)*5;
	spotLight1.position.z = Math.cos(time*0.7)*5;
	spotLight2.position.x = -Math.sin(time*0.7)*5;
	spotLight2.position.z = Math.cos(time*0.7)*5;
	spotLight3.position.x = Math.sin(time*0.7)*5;
	spotLight3.position.z = -Math.cos(time*0.7)*5;
	spotLight4.position.x = -Math.sin(time*0.7)*5;
	spotLight4.position.z = -Math.cos(time*0.7)*5;
	
	renderer.render(scene, camera);
}
function wobbleDuck(){
	const freq = Math.PI;
	const time = Date.now() * 0.0005;
	duck.position.y = 0.5 + 0.5 * Math.sin(time*freq);
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
function createSpotlight(color){
	let spotLight = new THREE.SpotLight(color, 0.5);
	spotLight.angle = Math.PI / 8;
	spotLight.penumbra = 0.1;
	spotLight.decay = 0;
	spotLight.distance = 10;

	spotLight.castShadow = true;
	return spotLight;
}