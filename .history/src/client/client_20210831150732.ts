import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera1 = new THREE.PerspectiveCamera(75, 1, 0.1, 10)
const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

camera1.position.z = 2
camera2.position.y = 1
camera2.lookAt(new THREE.Vector3(0, 0, 0))
camera3.position.z = 1
camera4.position.x = 1
camera4.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
 cument.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()