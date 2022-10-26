import {
  ACESFilmicToneMapping,
  BoxGeometry,
  EquirectangularReflectionMapping,
  Group,
  LinearFilter,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  SpotLight,
  sRGBEncoding,
  Texture,
  TextureLoader,
  WebGLRenderer,
	Mesh
} from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.145.0/three.module.js'

init(document.querySelector("#glCanvas"));

async function init(canvas) {
  const camera = new PerspectiveCamera(50, undefined, 1, 1000)
  camera.position.set(-15, 20, 37)

  const scene = new Scene()
  scene.add(camera)

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas })
  // Doesnt seem to be helping in combination with resizing
  // renderer.pixelRatio = window.devicePixelRatio
  renderer.shadowMap.enabled = false
  renderer.sortObjects = false
  renderer.outputEncoding = sRGBEncoding
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  const group = new Group()
  const light = new SpotLight(0xffffff, 1, 300, Math.PI / 4, 2, 0.5)
  light.position.set(0, 200, 50)
  light.intensity = 4
  scene.add(light)

  let imgURL = canvas.dataset.imgUrl
  const textureLoader = new TextureLoader()
  const texture = await textureLoader.loadAsync(imgURL)
  texture.encoding = sRGBEncoding
  texture.mapping = EquirectangularReflectionMapping
  texture.generateMipmaps = true
  texture.minFilter = LinearFilter

  const panes = makePanes(texture)
  panes.forEach((p) => group.add(p))
  scene.add(group)
  const sceneData = {
    renderer,
    camera,
    group,
    light,
    scene,
    panes,
  }
  setSceneDimensions(
    sceneData,
    canvas.getBoundingClientRect().width,
    canvas.getBoundingClientRect().height,
  )
  return sceneData
}

const ReflectorColors = [0x333333, 0x667788, 0x99cccc]

const makeReflector = (i, texture) =>
  new MeshPhysicalMaterial({
    envMap: texture,
    reflectivity: 1,
    refractionRatio: 0.8,
    ior: 1.23,
    transparent: true,
    opacity: 0.2,
    color: ReflectorColors[i],
    roughness: 0,
    metalness: 0,
    transmission: 0,
    depthWrite: false,
    depthTest: false,
    envMapIntensity: 1,
  })

const PaneSpacing = 7
const PaneGeometry = new BoxGeometry(0.096, 46.4, 57.5, 256, 256)

const makePanes = (texture) =>
  Array.from({ length: 3 }, (_, i) => {
    const mesh = createMultiMaterialObject(PaneGeometry, [
      makeReflector(i, texture),
    ])
    mesh.position.x = PaneSpacing * (i - 1)
    mesh.rotation.y = -0.7
    return mesh
  })

function makeTweenTo(obj, key, to, delta) {
  //delta factor, ie speed based on delta
  const df = Math.min(delta * 0.0025, 1)
  obj[key] += (to - obj[key]) * df
}

const tweener =
  (delta) =>
  (obj, key, to) =>
    makeTweenTo(obj, key, to, delta)

function render({
  sceneData,
  delta,
  mouseX,
  mouseY,
  scrollRatio,
}) {
  const { group, camera, panes, renderer } = sceneData

  const tweenTo = tweener(delta)
  tweenTo(group.rotation, 'y', -mouseX * 0.0001)
  tweenTo(group.rotation, 'x', -mouseY * 0.0001)

  tweenTo(camera.position, 'y', 20 + -scrollRatio * 20)
  tweenTo(camera.position, 'z', 37 + scrollRatio * 10)
  tweenTo(camera.position, 'x', -15 + scrollRatio * 50)

  tweenTo(camera.rotation, 'x', 0.25 + scrollRatio * 0.3)
  tweenTo(camera.rotation, 'y', scrollRatio * 0.7)
  tweenTo(camera.rotation, 'z', -scrollRatio * 0.7)

  panes.forEach((pane, i) => {
    tweenTo(pane.position, 'z', -scrollRatio * -(i - 1) * 40)
  })

  renderer.render(sceneData.scene, sceneData.camera)
}

function setSceneDimensions({ renderer, camera }, width, height) {
  // Seems to be necessary to use dpr here
  renderer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  camera.zoom = Math.pow((camera.aspect * 9) / 16, 0.5)
}

function createMultiMaterialObject( geometry, materials ) {

	const group = new Group();

	for ( let i = 0, l = materials.length; i < l; i ++ ) {

		group.add( new Mesh( geometry, materials[ i ] ) );

	}

	return group;

}