import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './utils/cannonDebugRenderer'

const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

const camera = new THREE.PerspectiveCamera(
    30,
    1920 / 1080,
    0.1,
    200
)
camera.position.set(0, 0, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const mainLight = new THREE.AmbientLight('#ffffff', 1.5)
mainLight.position.set(0, 0, 20)
scene.add(mainLight)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const cubeGeometry = new THREE.BoxGeometry(1, 1, 0)
const cubeMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshNormalMaterial())
cubeMesh.position.x = -6
cubeMesh.position.y = 3
cubeMesh.castShadow = true
scene.add(cubeMesh)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1))
const cubeBody = new CANNON.Body({ mass: 65 })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
world.addBody(cubeBody)

const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(2000, 20)
const groundMesh: THREE.Mesh = new THREE.Mesh(groundGeometry, new THREE.MeshStandardMaterial({color: 0xb44b39}))
groundMesh.rotateX(-Math.PI / 2)
groundMesh.receiveShadow = true
groundMesh.position.y = -8.1
scene.add(groundMesh)
const groundShape = new CANNON.Box(new CANNON.Vec3(1000, 0, 5))
const groundBody = new CANNON.Body({ mass: 0 })
groundBody.addShape(groundShape)
groundBody.position.y = groundMesh.position.y
world.addBody(groundBody)

const floorGeometry = new THREE.BoxGeometry(10, 1, 0)
const floorMesh = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({color:0xff0000, transparent:true, opacity:0, side: THREE.DoubleSide}))
floorMesh.position.x = 0
floorMesh.position.y = -7.5
floorMesh.castShadow = true
scene.add(floorMesh)
const floorShape = new CANNON.Box(new CANNON.Vec3(5, 0.5, 10))
const floorBody = new CANNON.Body({ mass: 0 })
floorBody.addShape(floorShape)
floorBody.position.x = floorMesh.position.x
floorBody.position.y = floorMesh.position.y
floorBody.position.z = floorMesh.position.z
world.addBody(floorBody)

const floorGeometry2 = new THREE.BoxGeometry(10, 1, 0)
const floorMesh2 = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({color:0xff0000, transparent:true, opacity:0, side: THREE.DoubleSide}))
floorMesh2.position.x = 19
floorMesh2.position.y = -7.5
floorMesh2.castShadow = true
scene.add(floorMesh2)
const floorShape2 = new CANNON.Box(new CANNON.Vec3(5, 0.5, 10))
const floorBody2 = new CANNON.Body({ mass: 0 })
floorBody2.addShape(floorShape2)
floorBody2.position.x = floorMesh2.position.x
floorBody2.position.y = floorMesh2.position.y
floorBody2.position.z = floorMesh2.position.z
world.addBody(floorBody2)

let relativeVector = new CANNON.Vec3(.1, 0, 0)
window.addEventListener("click", function(event) {
    cubeBody.position.vadd(relativeVector, cubeBody.position)
});

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta

const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

function animate() {
    requestAnimationFrame(animate)

    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)

    cannonDebugRenderer.update()

    cubeBody.position.vadd(relativeVector, cubeBody.position)

    cubeMesh.position.set(
        cubeBody.position.x,
        cubeBody.position.y,
        cubeBody.position.z
    )
    cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
    )

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()