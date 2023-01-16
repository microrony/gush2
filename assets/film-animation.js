// Our Javascript will go here.
const container = document.querySelector(".film-warranty-container .full-container");
const contentContainer = document.querySelector(".film-warranty-container .content-container");
const canvas = document.querySelector(".film-warranty-container #armyCanvas");
const cursor = document.querySelector(".film-warranty-container #cursor");
// container.style.height = `${contentContainer.offsetHeight}px`;
let isInScreen = false;
let mousePos = { current: { x: 0, y: 0 }}
let sceneData;

contentContainer.addEventListener("mousemove",(ev) => {
  mousePos.current = { x: ev.pageX, y: ev.pageY }
  cursor.style.setProperty('--x', ev.pageX + 'px')
  cursor.style.setProperty(
    '--y',
    ev.pageY - (container.offsetTop ?? 0) + 'px',
  )
})
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= -(container.offsetHeight) &&
        rect.left >= -container.offsetWidth &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)  + (container.offsetHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + (container.offsetWidth)
    );
}

document.addEventListener('scroll', function () {
     isInScreen = isInViewport(container)
}) 

 async function init(canvas){
    const camera = new THREE.PerspectiveCamera(75, undefined, 1, 1000)
    camera.position.set(-15, 20, 37)
    const scene = new THREE.Scene()
    scene.add(camera)
  
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas })
    // Doesnt seem to be helping in combination with resizing
    // renderer.pixelRatio = window.devicePixelRatio
    renderer.shadowMap.enabled = false
    renderer.sortObjects = false
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
  
    const group = new THREE.Group()
    const light = new THREE.SpotLight(0xffffff, 1, 300, Math.PI / 4, 2, 0.5)
    light.position.set(0, 500, 50)
    light.intensity = 4
    scene.add(light)
  
    let imgURL = canvas.getAttribute("data-img-url");
    const textureLoader = new THREE.TextureLoader()
    const texture = await textureLoader.loadAsync(imgURL)
    texture.encoding = THREE.sRGBEncoding
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearFilter
  
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
    new THREE.MeshPhysicalMaterial({
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
  const PaneGeometry = new THREE.BoxGeometry(0.096, 46.4, 57.5, 1, 1)
  const MobilePaneGeometry = new THREE.BoxGeometry(0.096, 56.4, 17.5, 1, 1)
  
  const makePanes = (texture ) =>
    Array.from({ length: 3 }, (_, i) => {
      const mesh = THREE.SceneUtils.createMultiMaterialObject(window.innerWidth > 750 ? PaneGeometry : MobilePaneGeometry , [
        makeReflector(i, texture),
      ])
      mesh.position.x = PaneSpacing * (i - 1)
      mesh.rotation.y = -0.7
      return mesh
    })
  
  function makeTweenTo(obj, key,to, delta) {
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
  
    tweenTo(camera.position, 'y', 20 + -scrollRatio * 10)
    tweenTo(camera.position, 'z', 37 + scrollRatio * 10)
    tweenTo(camera.position, 'x', -15 + scrollRatio * 75)
  
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
    // if(window.innerWidth> 750){
      renderer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      camera.zoom = Math.pow((camera.aspect * 9) / 16, 0.5)
    // }
  }
  async function initSceneData() {
    sceneData = await init(canvas)
    let last = performance.now();
    useAnimationFrame(
        (ts) => {
          const delta = ts - last ;
          last = ts
          if (sceneData && isInScreen) {
            const scrollRatio = (( window.scrollY ?? 0) - container.offsetTop ?? 0) / ( window.innerHeight ?? 1)
            const clampScrollRatio = Math.min(Math.max(scrollRatio, 0), 1)
            render({
              sceneData,
              delta,
              mouseX: mousePos.current.x,
              mouseY: mousePos.current.y,
              scrollRatio: clampScrollRatio ?? 0,
            })
          }

        }
      )
  }
  initSceneData()

  const useAnimationFrame = (cb) => {
    const animate = (ts) => {
      cb(ts)
      window.requestAnimationFrame(animate)
    }
      window.requestAnimationFrame(animate)
  }