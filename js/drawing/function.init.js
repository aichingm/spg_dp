/**
 * Setup the THREE.Scene, the renderer
 * @returns 
 */function init() {
    // Create the scene and set the scene size.
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 2000000000);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function () {
        var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });
    // Set the background color of the scene.
    //renderer.setClearColorHex(0x333F47, 1);
    renderer.setClearColor(0x333F47, 1);
    // Create a light, set its position, and add it to the scene.
    //var light = new THREE.PointLight(0xffffff, 1000, 0);
    //light.position.set(-1000, 2000, 1000);
    //scene.add(light);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.userPanSpeed = 15;
}
