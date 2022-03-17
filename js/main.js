import * as THREE from 'three';
import {OrbitControls} from './OrbitControls.js'
import { GLTFLoader } from './GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

camera.position.set(0, 10, 20);

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change',render);
controls.minDistance = 500;
controls.maxDistance = 5000;
controls.enablePan = true;
controls.target.set(0,5,0);
controls.update();
//controls end

//lights
const skylight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.6);
scene.add(skylight);

const dirlight = new THREE.DirectionalLight(0xffffff,0.8);
dirlight.position.set(5,10,2);
scene.add(dirlight);
scene.add(dirlight.target);
//lights end

let city;
let cars;
const gltfLoader = new GLTFLoader();
const url = '../models/city/scene.gltf';
gltfLoader.load(url, (gltf) => {
	city = gltf.scene;
	scene.add(city);
	
	cars = city.getObjectByName('Cars');
	
	const box = new THREE.Box3().setFromObject(city);
	const boxSize = box.getSize(new THREE.Vector3()).length();
	const boxCenter = box.getCenter(new THREE.Vector3());

	// set the camera to frame the box
	frameArea(boxSize * 0.5, boxSize, boxCenter, camera);
	// update the Trackball controls to handle the new size
	controls.maxDistance = boxSize * 10;
	controls.target.copy(boxCenter);
	controls.update();
});

camera.position.z = 10

animate();

window.addEventListener( 'resize', onWindowResize );
function render() {
	renderer.render( scene, camera );
}
function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
	const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
	const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
	const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
	// compute a unit vector that points in the direction the camera is now
	// in the xz plane from the center of the box
	const direction = (new THREE.Vector3())
		.subVectors(camera.position, boxCenter)
		.multiply(new THREE.Vector3(1, 0, 1))
		.normalize();

	// move the camera to a position distance units way from the center
	// in whatever direction the camera was from the center already
	camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

	// pick some near and far values for the frustum that
	// will contain the box.
	camera.near = boxSize / 100;
	camera.far = boxSize * 100;

	camera.updateProjectionMatrix();

	// point the camera to look at the center of the box
	camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}