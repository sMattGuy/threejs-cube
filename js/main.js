import * as THREE from 'three';
import {OrbitControls} from './OrbitControls.js'
//import { TeapotGeometry } from '../models/TeapotGeometry.js';
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
controls.enablePan = false;

//ambient light
const ambient = new THREE.AmbientLight(0x111111,0.1);
scene.add(ambient);
//end light
//spotlight
let spotLight1 = createSpotlight(0xFF0000);
let spotLight2 = createSpotlight(0x00FF00);
let spotLight3 = createSpotlight(0x0000FF);

spotLight1.position.set(-5,5,0);
spotLight2.position.set(5,5,0);
spotLight3.position.set(0,5,5);

scene.add(spotLight1);
scene.add(spotLight2);
scene.add(spotLight3);
//end spotlight

//floor
let floorMaterial = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
let floorGeometry = new THREE.PlaneGeometry( 2000, 2000 );
let floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.position.set( 0, - 1, 0 );
floor.rotation.x = - Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);
//end floor


//cube
/*
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF,dithering:true});
const cube = new THREE.Mesh(boxGeometry,boxMaterial);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);
*/
//end cube

/*
//teapot
let teapot;
const teapotSize = 0.5;
let tess = - 1;	// force initialization
let bBottom;
let bLid;
let bBody;
let bFitLid;
let bNonBlinn;
let shading;

createTeapot();
//end teapot
*/

const loader = new GLTFLoader();
loader.load('../models/Pathfinder.glb',function(gltf){
	scene.add(gltf);
});

camera.position.z = 10

animate();

window.addEventListener( 'resize', onWindowResize );
function render() {
	renderer.render( scene, camera );
}
function animate(){
	requestAnimationFrame(animate);
	
	//do things to cube
	/*
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	*/
	/*
	teapot.rotation.x += 0.01;
	teapot.rotation.y += 0.01;
	*/
	renderer.render(scene, camera);
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
/*
function createTeapot(){
	if(teapot !== undefined){
		teapot.geometry.dispose();
		scene.remove(teapot);
	}
	const geometry = new TeapotGeometry( teapotSize, tess);
	let teaMesh = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, dithering: true } );
	teapot = new THREE.Mesh( geometry, teaMesh);

	scene.add( teapot );
}
*/