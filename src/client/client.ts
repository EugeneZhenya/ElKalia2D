import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Stats from 'three/examples/jsm/libs/stats.module'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './utils/cannonDebugRenderer'

const START_POS = 100
const SEPARATION_DISTANCE = 40

let isSound = true
let isMusic = true

const backAudio = new Audio('Peter_Gresser.mp3')
backAudio.addEventListener('ended', function() {
    this.currentTime = 0
	this.play()
}, false)


const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
const camera = new THREE.PerspectiveCamera(
    30,
    1920 / 1080,
    0.1,
    200
)
camera.position.set(0, 0, 30)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const mainLight = new THREE.AmbientLight('#ffffff', 1.5)
mainLight.position.set(0, 0, 20)

// new OrbitControls(camera, renderer.domElement)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

let clock: THREE.Clock
let delta = 0

let player: any
let monster: any

const texLoader = new THREE.TextureLoader()
let texture, material
const playerRunning: any[] = []
const playerJumping: any[] = []
const playerGameOver: any[] = []
const playerHit: any[] = []
const parallax: any[] = []
const monsterRunning: any[] = []
const lifeBoost: any[] = []
const pointMaterials: any[] = []

const wall = {
    mesh1: new THREE.Mesh(new THREE.BoxBufferGeometry(259.75, 23.7, 1)),
    mesh2: new THREE.Mesh(new THREE.BoxBufferGeometry(259.75, 23.7, 1))
}

const floor = {
    mesh1: new THREE.Mesh(new THREE.BoxBufferGeometry(37.88333333, 4.138888889, 0)),
    mesh2: new THREE.Mesh(new THREE.BoxBufferGeometry(37.88333333, 4.138888889, 0))
}

const fore = new THREE.Mesh(new THREE.BoxBufferGeometry(17.31666656, 4, 0))

const ground = {
    mesh1: new THREE.Mesh(new THREE.BoxBufferGeometry(37.88333333, 4.138888889, 0)),
    mesh2: new THREE.Mesh(new THREE.BoxBufferGeometry(37.88333333, 4.138888889, 0))
}

function PlayerCollide(e: any) {
    switch (e.contact.bj.userData) {
        case 'Rocks_1.png':
            if (e.contact.ni.x > 0) {
                player.mesh.material = playerHit[0]
            }
            break
        case 'Rocks_2.png':
            if (e.contact.ni.x > 0) {
                player.mesh.material = playerHit[0]
            }
            break
        case 'Rocks_3.png':
            if (e.contact.ni.x > 0) {
                player.mesh.material = playerHit[0]
            }
            break
        case 'Rocks_4.png':
            if (e.contact.ni.x > 0) {
                player.mesh.material = playerHit[0]
            }
            break
        case 'Rocks_5.png':
            if (e.contact.ni.x > 0) {
                player.mesh.material = playerHit[0]
            }
            break
        case 'Rocks_6.png':
            if (e.contact.ni.x > 0) {
                player.mesh.material = playerHit[0]
                player.health -= 1
            }
            break
    }
    if (e.contact.ni.y < 0) {
        player.state = 'run'
    }
}

class ParallaxElement {
    position: any
    scale: number
    mesh: any
    name: string

    constructor() {
        this.position = new THREE.Vector3()
        this.scale = 1.0
        this.mesh = new THREE.Mesh()
        this.name = ''
    }
}

class RockElement {
    name: string
    position: any
    collider: any
    params: any
    mesh: any
    body: any

    constructor(params: any) {
        this.position = new THREE.Vector3()
        this.collider = new THREE.Box3()
        this.params = params
        this.name = ''

        this.LoadModel()
    }

    LoadModel() {
        const assets = [
            ['Pit.png', 14.91666667, 3.652777778, -6, 0, -1],
            ['Rocks_1.png', 9.533333333, 6.055555556, -2.35, 0, 100],
            ['Rocks_2.png', 7.3, 2.888888889, -0.8, 0, 0],
            ['Rocks_3.png', 9.766666667, 7.361111111, -2, 0, 100],
            ['Rocks_4.png', 11.58333333, 1.958333333, -1, 0, 0],
            ['Rocks_5.png', 15.11666667, 3.75, 2.25, 0, 0],
            ['Rocks_6.png', 9.516666667, 6.055555556, -2.5, 0, 100],
        ]
        const [asset, width, height, y, z, mass] = assets[rand_int(0, assets.length - 1)]
        // const [asset, width, height, y, z, mass] = assets[0]

        const texLoader = new THREE.TextureLoader()
        const texture = texLoader.load('img/' + asset)
        this.name = asset as string
        this.mesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry(width as number, height as number, 0),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
            }),
        );
        this.params.scene.add(this.mesh)
        this.position.x = rand_range(0, 1000)
        this.position.y = y as number
        this.position.z = z as number

        if (mass as number < 0) {
            // console.log(this)
        }

        if (this.name === 'Pit.png') {
            floorBodyLeft.position.x = -100 - this.mesh.geometry.parameters.width / 2
            floorBodyRight.position.x = 300 + this.mesh.geometry.parameters.width / 2
            const toAdd = rand_range(0, 100)

            const mche1 = point.clone()
            const mche2 = point.clone()
            const mche3 = point.clone()
            const mche4 = point.clone()
            mche1.position.x = START_POS
            mche2.position.x = START_POS
            mche3.position.x = START_POS
            mche4.position.x = START_POS
            mche1.position.y = -2.5
            mche2.position.y = 0
            mche3.position.y = 2.5
            mche4.position.y = 5
            scene.add(mche1, mche2, mche3, mche4)

            if (toAdd > 50) {
                const mche1 = point.clone()
                const mche2 = point.clone()
                const mche3 = point.clone()
                const mche4 = point.clone()
                mche1.position.x = START_POS
                mche2.position.x = START_POS
                mche3.position.x = START_POS
                mche4.position.x = START_POS
                mche1.position.y = -2.5
                mche2.position.y = 0
                mche3.position.y = 2.5
                mche4.position.y = 5
                scene.add(mche1, mche2, mche3, mche4)
            }
        } else {
            const bodyShape = new CANNON.Box(new CANNON.Vec3(this.mesh.geometry.parameters.width / 3, this.mesh.geometry.parameters.height / 2 - 0.2, 5))
            this.body = new CANNON.Body({ mass: mass as number })
            this.body.addShape(bodyShape)
            this.body.position.x = this.position.x
            this.body.position.y = this.position.y
            this.body.position.z = this.position.z
            this.body.angularDamping = 1
            this.body.userData = { name: asset as string }
            world.addBody(this.body)
        }

        if (this.name === 'Rocks_4.png') {
            const heart = scene.getObjectByName('LifeHeart')
            if (typeof heart != 'undefined') {
                
            } else {
                const mche2 = lifeHeart.clone()
                mche2.position.x = START_POS
                scene.add(mche2)
                // console.log(lifeHeart.position.x)
            }
        }

        if (this.name === 'Rocks_6.png' || this.name === 'Rocks_1.png' || this.name === 'Rocks_2.png' || this.name === 'Rocks_3.png') {
            const toAdd = rand_range(0, 100)
            if (toAdd > 50) {
                const mche1 = point.clone()
                const mche2 = point.clone()
                const mche3 = point.clone()
                const mche4 = point.clone()
                const mche5 = point.clone()
                mche1.position.x = START_POS - 5
                mche2.position.x = START_POS - 2.5
                mche3.position.x = START_POS
                mche4.position.x = START_POS + 2.5
                mche5.position.x = START_POS + 5
                mche2.position.y += 2
                mche3.position.y += 4
                mche4.position.y += 2
                scene.add(mche1, mche2, mche3, mche4, mche5)
            }
        }

        if (this.name === 'Rocks_5.png') {
            const toAdd = rand_range(0, 100)
            // if (toAdd > 50) {
                const mche1 = point.clone()
                const mche2 = point.clone()
                const mche3 = point.clone()
                const mche4 = point.clone()
                const mche5 = point.clone()
                mche1.position.x = START_POS - 6
                mche2.position.x = START_POS - 3
                mche3.position.x = START_POS
                mche4.position.x = START_POS + 3
                mche5.position.x = START_POS + 6
                mche1.position.y -= 4
                mche2.position.y -= 4
                mche3.position.y -= 4
                mche4.position.y -= 4
                mche5.position.y -= 4
                scene.add(mche1, mche2, mche3, mche4, mche5)
            // }
        }
    }

    UpdateCollider() {
        this.collider.setFromObject(this.mesh)
    }

    Update(timeElapsed: number) {
        this.mesh.position.copy(this.position)
        this.UpdateCollider()
    }
}

class WorldManager {
    objects: any[]
    unused: any[]
    speed: number
    params: any
    separationDistance: number
    score: number
    scoreText: string
    lifeEmpty: THREE.MeshBasicMaterial
    lifeQuarter: THREE.MeshBasicMaterial
    lifeHalf: THREE.MeshBasicMaterial
    lifeFull: THREE.MeshBasicMaterial
    life: THREE.Mesh
    title: THREE.Mesh

    constructor(params: any) {
        this.objects = []
        this.unused = []
        this.speed = 8
        this.params = params
        this.separationDistance = SEPARATION_DISTANCE
        this.score = 0.0
        this.scoreText = '00000'

        const texLoader = new THREE.TextureLoader()
        this.lifeEmpty = new THREE.MeshBasicMaterial({
            map: texLoader.load('img/lifeEmpty.png'),
            transparent: true
        })
        this.lifeQuarter =  new THREE.MeshBasicMaterial({
            map: texLoader.load('img/lifeQuarter.png'),
            transparent: true
        })
        this.lifeHalf = new THREE.MeshBasicMaterial({
            map: texLoader.load('img/lifeHalf.png'),
            transparent: true
        })
        this.lifeFull = new THREE.MeshBasicMaterial({
            map: texLoader.load('img/lifeFull.png'),
            transparent: true
        })
        this.life = new THREE.Mesh(
            new THREE.BoxBufferGeometry(3.3, 2.597222222, 0),
            this.lifeFull
        )
        this.life.position.x = 12.5
        this.life.position.y = 5.465277778
        this.life.position.z = 1
        this.params.scene.add(this.life)

        const texture = texLoader.load('img/Title.png')
        this.title = new THREE.Mesh(
            new THREE.BoxBufferGeometry(3.966666667, 2.777777778, 0),
            new THREE.MeshBasicMaterial({
                map: texture,
                    transparent: true,
                }),
        )
        this.title.position.x = -11.5
        this.title.position.y = 5.652777778
        this.title.position.z = 1
        this.params.scene.add(this.title)
    }

    GetColliders() {
        return this.objects
    }

    LastObjectPosition() {
        if (this.objects.length == 0) {
            return SEPARATION_DISTANCE;
        }

        return this.objects[this.objects.length - 1].position.x
    }

    SpawnObj() {
        for (let obj of this.objects) {
            if (obj.name === 'Pit.png') return
        }
        const obj = new RockElement(this.params)
        obj.position.x = START_POS
        this.objects.push(obj)
    }

    MaybeSpawn() {
        const closest = this.LastObjectPosition()
        if (Math.abs(START_POS - closest) > this.separationDistance) {
            this.SpawnObj()
            this.separationDistance = rand_range(SEPARATION_DISTANCE, SEPARATION_DISTANCE * 1.5)
        }
    }

    Update(timeElapsed: number) {
        this.MaybeSpawn()
        this.UpdateColliders(timeElapsed)
        if (!player.gameOver) this.UpdateScore(timeElapsed)

        if (player.health <= 25) {
            this.life.material = this.lifeEmpty
        } else {
            if (player.health <= 50) {
                this.life.material = this.lifeQuarter
            } else {
                if (player.health <= 75) {
                    this.life.material = this.lifeHalf
                }
            }
        }

        if (player.health <= 0 && !player.gameOver) {
            player.gameOver = true
            player.state = 'GameOver'
        }
    }

    UpdateScore(timeElapsed: number) {
        this.score += timeElapsed * 10.0
        const scoreText = Math.round(this.score).toLocaleString(
            'en-US',
            {minimumIntegerDigits: 1, useGrouping: false}
        )

        if (scoreText == this.scoreText) {
            return
        }

        textScore.innerHTML = 'SCORE: ' + scoreText
        // document.getElementById('score-text').innerText = scoreText
        // console.log(scoreText)
    }

    UpdateColliders(timeElapsed: number) {
        const invisible = []
        const visible = []
        const mySpeed = this.speed

        // console.log(this.objects)

        for (let obj of this.objects) {
            obj.position.x -= timeElapsed * this.speed
            if (obj.name === 'Pit.png') {
                floorBodyLeft.position.z = -1
                floorBodyLeft.position.x -= timeElapsed * this.speed
                floorBodyRight.position.z = -1
                floorBodyRight.position.x -= timeElapsed * this.speed
            } else {
                obj.body.position.x = obj.position.x
            }

            if (obj.position.x < -32) {
                invisible.push(obj)
                obj.mesh.visible = false
                if (obj.name === 'Pit.png') {

                } else {
                    world.removeBody(obj.body)
                }
            } else {
                visible.push(obj)
            }

            obj.Update(timeElapsed)
        }

        const lifeHeart = scene.getObjectByName('LifeHeart')
        if (typeof lifeHeart != 'undefined') {
            lifeHeart.position.x -= timeElapsed * this.speed
            lifeHeart.userData.texturePosition += 0.1
            if (lifeHeart.userData.texturePosition > 1) {
                // lifeHeart = new THREE.Mesh( new THREE.BoxBufferGeometry(2.7264, 2.5184, 0), lifeBoost[1] )
                lifeHeart.traverse(function(child) {
                    if (child instanceof THREE.Mesh){
                        child.material = lifeBoost[1]
                    }
                })
            }
            if (lifeHeart.userData.texturePosition > 2) {
                lifeHeart.userData.texturePosition = 0
                // lifeHeart = new THREE.Mesh( new THREE.BoxBufferGeometry(2.7264, 2.5184, 0), lifeBoost[0] )
                lifeHeart.traverse(function(child) {
                    if (child instanceof THREE.Mesh){
                        child.material = lifeBoost[0]
                    }
                })
            }
            if (lifeHeart.position.x < -20) {
                scene.remove(lifeHeart)
            }
        }

        try {
            scene.traverse(function(child) {
                if (child.name === "Watermelon") {
                    child.position.x -= timeElapsed * mySpeed
                    child.userData.texturePosition += 0.1
                    if (child.userData.texturePosition > 1) {
                        child.traverse(function(mesh) {
                            if (mesh instanceof THREE.Mesh){
                                mesh.material = pointMaterials[1]
                            }
                        })
                    }
                    if (child.userData.texturePosition > 2) {
                        child.userData.texturePosition = 0
                        child.traverse(function(mesh) {
                            if (mesh instanceof THREE.Mesh){
                                mesh.material = pointMaterials[0]
                            }
                        })
                    }
                    if (child.position.x < -20) {
                        scene.remove(child)
                    }
                }
            })
        } catch {}

        this.objects = visible
        this.unused.push(...invisible)
    }
}

texture = texLoader.load('img/landing1.png')
material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
})
const playerLanding = material

for (let i = 0; i < 2; ++i) {
    texture = texLoader.load('img/LifeHeart_' + i +'.png')
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    })
    lifeBoost.push(material)
}
const lifeHeart = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2.7264, 2.5184, 0),
    lifeBoost[0]
);
lifeHeart.name = 'LifeHeart'
const lifeHeartShape = new CANNON.Box(new CANNON.Vec3(2.7264, 2.5184, 5))
const lifeHeartBody = new CANNON.Body({ mass: 0.1 })
lifeHeartBody.addShape(lifeHeartShape)
lifeHeart.position.x = 6
lifeHeart.position.y = 2
lifeHeart.position.z = 0.5
lifeHeartBody.position.x = lifeHeart.position.x
lifeHeartBody.position.y = lifeHeart.position.y
lifeHeartBody.position.z = lifeHeart.position.z
lifeHeart.userData = { texturePosition: 0 }
// scene.add(lifeHeart)
// world.addBody(lifeHeartBody)

for (let i = 0; i < 2; ++i) {
    texture = texLoader.load('img/GlowingWatermelon_' + i +'.png')
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    })
    pointMaterials.push(material)
}
const point = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.35, 1.97037037, 0),
    pointMaterials[0]
);
point.name = 'Watermelon'
const pointShape = new CANNON.Box(new CANNON.Vec3(3.35, 1.97037037, 5))
const pointBody = new CANNON.Body({ mass: 0.1 })
pointBody.addShape(pointShape)
point.position.x = 6
point.position.y = 2
point.position.z = 0.5
pointBody.position.x = point.position.x
pointBody.position.y = point.position.y
pointBody.position.z = point.position.z
point.userData = { texturePosition: 0 }
// scene.add(point)
// world.addBody(lifeHeartBody)

for (let i = 1; i < 2; ++i) {
    texture = texLoader.load('img/hit2.png')
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    })
    playerHit.push(material)
}

for (let i = 1; i < 3; ++i) {
    texture = texLoader.load('img/over' + i +'.png')
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    })
    playerGameOver.push(material)
}

for (let i = 1; i < 3; ++i) {
    texture = texLoader.load('img/jumping2.png')
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    })
    playerJumping.push(material)
}

texture = texLoader.load('img/Background_0.jpg')
material =new THREE.MeshBasicMaterial({map: texture})
wall.mesh1.material = material
wall.mesh2.material = material
wall.mesh1.scale.setScalar(1)
wall.mesh2.scale.setScalar(1)
wall.mesh1.position.x = 0
wall.mesh1.position.z = -15
wall.mesh2.position.x = 259.75
wall.mesh2.position.z = -15

texture = texLoader.load('img/ForegroundParallaxElement.png')
material = new THREE.MeshBasicMaterial({map: texture, transparent: true})
fore.material = material
fore.scale.setScalar(1)
fore.position.x = -15
fore.position.y = -6
fore.position.z = 3

texture = texLoader.load('img/Floor_1.png')
material = new THREE.MeshBasicMaterial({map: texture, transparent: true})
floor.mesh1.material = material
floor.mesh2.material = material
floor.mesh1.scale.setScalar(1)
floor.mesh2.scale.setScalar(1)
floor.mesh1.position.x = 0
floor.mesh1.position.y = -6.5
floor.mesh1.position.z = -2
floor.mesh2.position.x = 37.88333333
floor.mesh2.position.y = -6.5
floor.mesh2.position.z = -2

texture = texLoader.load('img/Floor_2.png')
material =new THREE.MeshBasicMaterial({map: texture, transparent: true})
ground.mesh1.material = material
ground.mesh2.material = material
ground.mesh1.scale.setScalar(1)
ground.mesh2.scale.setScalar(1)
ground.mesh1.position.x = 0
ground.mesh1.position.y = -6
ground.mesh1.position.z = 0
ground.mesh2.position.x = 37.88333333
ground.mesh2.position.y = -6
ground.mesh2.position.z = 0

const parAssets = [
    ['ParallaxElement_1.png', 3.466666667, 3.111111111, -4.45],
    ['ParallaxElement_2.png', 5.683333333, 7.625, -1.55],
    ['ParallaxElement_3.png', 8.616666667, 8.986111111, -0.8],
    ['ParallaxElement_4.png', 6.25, 7.388888889, -2.75],
    ['ParallaxElement_5.png', 6.7, 9.097222222, -1],
    ['ParallaxElement_6.png', 7.916666667, 9.194444444, -1],
    ['ParallaxElement_7.png', 6.283333333, 7.875, -1.65],
    ['ParallaxElement_8.png', 12.91666667, 6.055555556, 5],
    ['ParallaxElement_9.png', 2.016666667, 2.111111111, -4.5],
];
for (let i = 0; i < 25; ++i) {
    const element = new ParallaxElement
    const [asset, par_width, par_height, y] = parAssets[rand_int(0, parAssets.length - 1)]
    texture = texLoader.load('img/' + asset)
    element.mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(par_width as number, par_height as number, 0),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        })
    )
    element.name = asset as string
    element.position.x = rand_range(0, 1000)
    element.position.y = y as number
    element.position.z = -5

    element.mesh.position.copy(element.position)
    parallax.push(element);
}

const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(2000, 20)
const groundMesh: THREE.Mesh = new THREE.Mesh(groundGeometry, new THREE.MeshStandardMaterial({color: 0xb44b39}))
groundMesh.rotateX(-Math.PI / 2)
groundMesh.receiveShadow = true
groundMesh.position.y = -8.1

const groundShape = new CANNON.Box(new CANNON.Vec3(1000, 0, 5))
const groundBody = new CANNON.Body({ mass: 0 })
groundBody.addShape(groundShape)
groundBody.position.y = groundMesh.position.y

const floorShape = new CANNON.Box(new CANNON.Vec3(200, 0.5, 10))
const floorBodyLeft = new CANNON.Body({ mass: 0 })
floorBodyLeft.addShape(floorShape)
floorBodyLeft.position.y = -6

const floorBodyRight = new CANNON.Body({ mass: 0 })
floorBodyRight.addShape(floorShape)
floorBodyRight.position.y = -6

const ceilingBody = new CANNON.Body({ mass: 0 })
ceilingBody.addShape(floorShape)
ceilingBody.position.y = 12

const borderShape = new CANNON.Box(new CANNON.Vec3(0.1, 20, 10))
const leftBorder = new CANNON.Body({ mass: 0 })
leftBorder.addShape(borderShape)
leftBorder.position.x = -20

const rightBorder = new CANNON.Body({ mass: 0 })
rightBorder.addShape(borderShape)
rightBorder.position.x = 20
rightBorder.position.y = 25

let pershcodes: WorldManager

let relativeVector = new CANNON.Vec3(0.5,3, 0)
window.addEventListener('click', function(event) {
    // if (player.state === 'run') {
    if (!player.gameOver) {
        player.state = 'jump'
        player.mesh.material = playerJumping[0]
        // cubeBody.position.vadd(relativeVector, cubeBody.position)
    }
})

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// const stats = Stats()
// document.body.appendChild(stats.dom)

const textScore = document.createElement('div')
textScore.id = 'textScore'
textScore.innerHTML = 'SCORE: 0'

let HighScore = 1000

const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

let moveVector = new CANNON.Vec3(0, 0, 0)
function animate() {
    if (player.state !== 'Restart') {
        requestAnimationFrame(animate)
    }

    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)

    cannonDebugRenderer.update()

    let moveVector2 = new CANNON.Vec3(-0.1, 0, 0)

    player.body.position.z = .5

    if (player.state === 'jump' && !player.gameOver) {
        moveVector.y += 0.01
        moveVector.x += 0
        player.body.position.vadd(moveVector, player.body.position)
        if (player.body.position.y > 6) {
            moveVector = new CANNON.Vec3(0, 0, 0)
            player.state = 'land'
        }
        player.mesh.material = playerJumping[1]
    }
    // console.log(cubeBody.position.y, player.state)
    if (player.state === 'run' && !player.gameOver) {
        player.spriteFrame += 0.1
        if (player.spriteFrame > 10) player.spriteFrame = 0;

        player.mesh.material = playerRunning[Math.round(player.spriteFrame)]
        // player.mesh.material.needsUpdate = true;
    }

    if (player.state === 'land' && !player.gameOver)  {
        player.mesh.material = playerLanding
        if (player.body.position.y < -2) {
            player.state = 'run'
        }
    }

    if (player.state === 'GameOver')  {
        player.mesh.material = playerGameOver[0]
        setTimeout(function() {
            // world.removeBody(player.body)
            player.state = 'Death'
        }, 1250);
    }

    if (player.state === 'Death')  {
        player.mesh.material = playerGameOver[1]
        player.body.position.y = -4
        world.removeBody(player.body)
        player.gameOverCounter += 1
        if (player.gameOverCounter > 200) {
            player.state = 'FullPpc'
            if (pershcodes.score > HighScore) {
                HighScore = pershcodes.score
            }

            const gameOverScreen = document.createElement('div')
            gameOverScreen.id = 'gameOverScreen'
            document.body.appendChild(gameOverScreen)
            const goYOULOSE = document.createElement('img')
            goYOULOSE.id = 'goYOULOSE'
            goYOULOSE.src = 'img/goYOULOSE.png'
            gameOverScreen.appendChild(goYOULOSE)
            const goBactToMenu = document.createElement('img')
            goBactToMenu.id = 'goBactToMenu'
            goBactToMenu.src = 'img/goBactToMenu.png'
            goBactToMenu.addEventListener("click", (e:Event) => {
                player.state = 'Restart'
                for (var i = scene.children.length - 1; i >= 0; i--) { 
                    const obj = scene.children[i]
                    // obj.material.dispose()
                    // obj.geometry.dispose()
                    scene.remove(obj)
                }
                for (var i = world.bodies.length - 1; i >= 0; i--) { 
                    const obj = world.bodies[i]
                    world.removeBody(obj)
                }

                pershcodes.score = 0

                document.body.removeChild(renderer.domElement)
                document.body.removeChild(textScore)
                gameOverScreen.remove()
                StartScreen()
            })
            gameOverScreen.appendChild(goBactToMenu)
            const goShareButton = document.createElement('img')
            goShareButton.id = 'goShareButton'
            goShareButton.src = 'img/goShareButton.png'
            goShareButton.addEventListener("click", (e:Event) => {
                window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fgames.klio.dp.ua%2Fgames%2FElKalia3D%2Findex.html&amp;src=sdkpreparse', '_blank')
            })
            gameOverScreen.appendChild(goShareButton)
            gameOverScreen.appendChild(goBactToMenu)
            const goPlayButton = document.createElement('img')
            goPlayButton.id = 'goPlayButton'
            goPlayButton.src = 'img/goPlayButton.png'
            goPlayButton.addEventListener("click", (e:Event) => {
                player.state = 'Restart'
                for (var i = scene.children.length - 1; i >= 0; i--) { 
                    const obj = scene.children[i]
                    // obj.material.dispose()
                    // obj.geometry.dispose()
                    scene.remove(obj)
                }
                for (var i = world.bodies.length - 1; i >= 0; i--) { 
                    const obj = world.bodies[i]
                    world.removeBody(obj)
                }

                gameOverScreen.remove()
                
                pershcodes.score = 0
                Initial()
            })
            gameOverScreen.appendChild(goPlayButton)
            const goSCORE = document.createElement('div')
            goSCORE.id = 'goSCORE'
            goSCORE.innerHTML = 'SCORE: ' + Math.round(pershcodes.score).toLocaleString(
                'en-US',
                {minimumIntegerDigits: 1, useGrouping: false}
            )
            gameOverScreen.appendChild(goSCORE)
            const goHighScore = document.createElement('div')
            goHighScore.id = 'goHighScore'
            goHighScore.innerHTML = 'HIGH SCORE:<br />' + Math.round(HighScore).toLocaleString(
                'en-US',
                {minimumIntegerDigits: 1, useGrouping: false}
            )
            gameOverScreen.appendChild(goHighScore)
        }
    }

    CheckCollisions()

    player.mesh.position.set(
        player.body.position.x,
        player.body.position.y,
        player.body.position.z
    )
    // cubeMesh.quaternion.set(
        // cubeBody.quaternion.x,
        // cubeBody.quaternion.y,
        // cubeBody.quaternion.z,
        // cubeBody.quaternion.w
    // )

    wall.mesh1.position.x -= delta * 1
    wall.mesh2.position.x -= delta * 1
    if (wall.mesh1.position.x <= -259.75) {
        wall.mesh1.position.x = wall.mesh2.position.x + 259.75
    }
    if (wall.mesh2.position.x <= -259.75) {
        wall.mesh2.position.x = wall.mesh1.position.x + 259.75
    }

    floor.mesh1.position.x -= delta * 1.5
    floor.mesh2.position.x -= delta * 1.5
    if (floor.mesh1.position.x <= -37.88333333) {
        floor.mesh1.position.x = floor.mesh2.position.x + 37.88333333
    }
    if (floor.mesh2.position.x <= -37.88333333) {
        floor.mesh2.position.x = floor.mesh1.position.x + 37.88333333
    }

    ground.mesh1.position.x -= delta * pershcodes.speed
    ground.mesh2.position.x -= delta * pershcodes.speed
    if (ground.mesh1.position.x <= -37.88333333) {
        ground.mesh1.position.x = ground.mesh2.position.x + 37.88333333
    }
    if (ground.mesh2.position.x <= -37.88333333) {
        ground.mesh2.position.x = ground.mesh1.position.x + 37.88333333
    }        

    for (let c of parallax) {
        c.position.x -= delta * 10

        if (c.position.x <= -100) {
            c.position.x = rand_range(100, 1000)
        }
    
        c.mesh.position.copy(c.position)
        c.mesh.scale.setScalar(c.scale)
    }

    pershcodes.Update(delta)

    monster.mesh.position.x += delta * 0.5
    monster.spriteFrame += 0.1
    if (monster.spriteFrame > 6) monster.spriteFrame = 0
    monster.mesh.material = monsterRunning[Math.round(monster.spriteFrame)]

    fore.position.x -= delta * 2
    if (fore.position.x < - 20) {
        fore.position.x = 20
    }

    render()

    // stats.update()
}

function render() {
    renderer.render(scene, camera)
}

function CheckCollisions() {
    player.playerBox.setFromObject(player.mesh)
    monster.monsterBox.setFromObject(monster.mesh)
    if (monster.monsterBox.intersectsBox(player.playerBox)) {
        // console.log('EAT!')
        player.health -= 1
    }

    const heart = scene.getObjectByName('LifeHeart')
    if (typeof heart != 'undefined') {
        const heartBox = new THREE.Box3()
        heartBox.setFromObject(heart)
        if (player.playerBox.intersectsBox(heartBox)) {
            player.health = 100
            monster.mesh.position.x = -20
            // monster.mesh.position.x -= 5
            scene.remove(heart)
            pershcodes.Update(0);
        }
    }

    try {
        scene.traverse(function(child) {
            if (child.name === "Watermelon") {
                const pointBox = new THREE.Box3()
                pointBox.setFromObject(child)
                if (player.playerBox.intersectsBox(pointBox)) {
                    monster.mesh.position.x = -20
                    // player.mesh.position.x += 5
                    // player.body.position.x += 0.5
                    scene.remove(child)
                    beep()
                }
            }
        })
    } catch {}
}

function rand_int(a: number, b: number) {
    return Math.round(Math.random() * (b - a) + a)
}

function rand_range(a: number, b: number) {
    return Math.random() * (b - a) + a;
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=")
    snd.muted = !isSound
    snd.play()
}

function StartScreen() {
    const startScreen = document.createElement('div')
    startScreen.id = 'startScreen'
    document.body.appendChild(startScreen)
    const ssInsta = document.createElement('img')
    ssInsta.id = 'ssInsta'
    ssInsta.src = 'img/ssInsta.png'
    ssInsta.addEventListener("click", (e:Event) => {
        window.open('https://www.instagram.com/clickhouse_media/', '_blank')
    })
    startScreen.appendChild(ssInsta)
    const ssKalia = document.createElement('img')
    ssKalia.id = 'ssKalia'
    ssKalia.src = 'img/ssKalia.png'
    startScreen.appendChild(ssKalia)
    const ssTitle = document.createElement('img')
    ssTitle.id = 'ssTitle'
    ssTitle.src = 'img/ssTitle.png'
    startScreen.appendChild(ssTitle)
    const ssPlayButton = document.createElement('img')
    ssPlayButton.id = 'ssPlayButton'
    ssPlayButton.src = 'img/goPlayButton.png'
    ssPlayButton.addEventListener("click", (e:Event) => {
        startScreen.remove()

        document.body.appendChild(renderer.domElement)
        document.body.appendChild(textScore)

        Initial()
    })
    startScreen.appendChild(ssPlayButton)
    const ssMusicButton = document.createElement('img')
    ssMusicButton.id = 'ssMusicButton'
    if (isMusic) {
        ssMusicButton.src = 'img/MusicButton.png'
    } else {
        ssMusicButton.src = 'img/MusicButtonOff.png'
    }
    ssMusicButton.addEventListener("click", (e:Event) => {
        isMusic = !isMusic
        if (isMusic) {
            ssMusicButton.src = 'img/MusicButton.png'
        } else {
            ssMusicButton.src = 'img/MusicButtonOff.png'
        }
    })
    startScreen.appendChild(ssMusicButton)
    const ssSoundButton = document.createElement('img')
    ssSoundButton.id = 'ssSoundButton'
    if (isSound) {
        ssSoundButton.src = 'img/SoundButton.png'
    } else {
        ssSoundButton.src = 'img/SoundButtonOff.png'
    }
    ssSoundButton.addEventListener("click", (e:Event) => {
        isSound = !isSound
        if (isSound) {
            ssSoundButton.src = 'img/SoundButton.png'
        } else {
            ssSoundButton.src = 'img/SoundButtonOff.png'
        }
    })
    startScreen.appendChild(ssSoundButton)
}

StartScreen()

function Initial() {
    clock = new THREE.Clock()
    delta = 0

    backAudio.muted = !isMusic
    backAudio.play()

    player = {
        velocity: 0.0,
        animations: [],
        gameOver: false,
        gameOverCounter: 0,
        health: 100,
        state: 'run',
        spriteFrame: 0,
        mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(4.683333333, 5.861111111, 0)),
        shape: new CANNON.Box(new CANNON.Vec3(2.3416666665, 2.9305555555, 1)),
        body: new CANNON.Body({ mass: 65 }),
        playerBox: new THREE.Box3()
    }

    monster = {
        velocity: 0.0,
        animations: [],
        spriteFrame: 0,
        mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(12.01666667, 11.09722222, 0)),
        monsterBox: new THREE.Box3()
    }
    for (let i = 1; i < 8; ++i) {
        texture = texLoader.load('img/monster' + i +'.png')
        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        })
        monsterRunning.push(material)
    }
    monster.mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12.01666667, 11.09722222, 0),
        monsterRunning[0]
    )
    monster.mesh.position.x = -20
    monster.mesh.position.y = -1.5
    monster.mesh.position.z = 0.5    

    scene.add(mainLight)
    scene.add(monster.mesh)
    world.addBody(player.body)
    scene.add(player.mesh)
    scene.add(wall.mesh1)
    scene.add(wall.mesh2)
    scene.add(fore)
    scene.add(floor.mesh1)
    scene.add(floor.mesh2)
    world.addBody(groundBody)
    scene.add(ground.mesh1)
    scene.add(ground.mesh2)
    world.addBody(floorBodyLeft)
    world.addBody(floorBodyRight)
    world.addBody(ceilingBody)
    world.addBody(leftBorder)
    world.addBody(rightBorder)

    for (let c of parallax) {
        scene.add(c.mesh)
    }
    scene.add(groundMesh)
    player.body.addEventListener("collide", PlayerCollide)

    for (let i = 1; i < 12; ++i) {
        texture = texLoader.load('img/running' + i +'.png')
        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        })
        playerRunning.push(material)
    }
    player.mesh.material = playerRunning[0]
    player.mesh.position.z = .5

    player.body.addShape(player.shape)
    player.body.position.x = player.mesh.position.x
    player.body.position.y = player.mesh.position.y
    player.body.position.z = player.mesh.position.z
    player.body.angularDamping = 1

    pershcodes = new WorldManager({scene: scene, world: world})

    animate()
}