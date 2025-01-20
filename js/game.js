/**
 * Imports
 */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/**
 *  Elements that are used to show the scene and the camera
 */
let renderer = null;      // Il motore di render
let scene = null;         // la scena radice
let sceneHUD = null;         // la scena radice
let camera = null;        // la camera da cui renderizzare la scena
let cameraHUD = null;     // la camera da cui visualizzare la HUD


/**
 * Audio elements
 */
let audiolistener = null; // L'oggetto per sentire i suoni del gioco

/**
 * Basic terrain map
 * @type {string}
 */
let jsonMap = '{"row": 10, "col": 10, "data": ' +
    '[' +
    '[{"cat": 5, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 3, "rot":1}, {"cat": 4, "rot":1}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 3, "rot":2}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}],' +
    '[{"cat": 4, "rot":1}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 1, "rot":0}, {"cat": 2, "rot":1}]' +
    ']}';


/**
 * Array that contains the terrain parts to create the map
 */
let meshBoard = [];

/**
 * Lights used for the game
 *  - sunLight: The light of the sun
 *  - HUDlight: The light for the HUD elements
 *  - nLight: The ambient light for the nighttime
 *  - Lights: The array of the streetlamps
 */
let sunLight = null;
let HUDlight = null;
let nLight = null;
let lights = [];

/**
 * Clock used to get the delta time
 */
let clock = null;
let dt;
let lastFrameTime = 0;

/**
 * Afk time management
 * @type {number}
 */
let idleTime = 0;
let idleTrigger = 10;
let dayDuration = 120000

/**
 * Performance monitoring
 *  - perfTrigger: Trigger which activates the performance panel
 */
let perfTrigger=false;
const stats = new Stats()
const maxFPS = 165;

/**
 * Orbital controls
 */
let controls;

/**
 * Game logic
 */
let elements = [];
let elementsId = [];
let selected;
let elementLoaded;
let open = false //opens the HUD
let editMode = false; //activates editing mode
let lastSquare = undefined;
let loaded = false;
let tileCoord;
let ready = false;
let v = new THREE.Vector3(0, 0, 0);

/**
 * Raycasting
 */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


/**
 * Game initializer
 */
function initScene() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("threejs").style.display = "block";

    if (renderer != null) return;


    //Canvas setup
    let canv = document.getElementById("threejs");

    let width = canv.clientWidth;
    let height = canv.clientHeight;
    canv.width = canv.clientWidth;
    canv.height = canv.clientHeight;


    //Performance monitoring
    if (perfTrigger) stats.showPanel(0)
    if (perfTrigger) document.body.appendChild(stats.dom)


    //Renderer setup
    renderer = new THREE.WebGLRenderer({
        antialias: "true",
        powerPreference: "high-performance",
        canvas: canv
    });

    renderer.autoClear = false;
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap // (default)

    //Camera setup
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);

    cameraHUD = new THREE.PerspectiveCamera(50, width / height, 0.1, 20);
    cameraHUD.position.set(20, 0, 0);
    cameraHUD.lookAt(0, 0, 0);
    cameraHUD.updateProjectionMatrix();

    //Orbital controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.autoRotateSpeed=0;

    //Audio setup
    audiolistener = new THREE.AudioListener();
    camera.add(audiolistener);

    //Clock setup
    clock = new THREE.Clock();

    //Scene setup
    scene = new THREE.Scene();
    sceneHUD = new THREE.Scene();

    //Lights setup
    sunLight = new THREE.DirectionalLight(0xFFFFEE, 3);
    sunLight.castShadow = true

    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;

    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;

    scene.add(sunLight);


    nLight = new THREE.AmbientLight(0xaaaaff,0.2);
    scene.add(nLight);

    HUDlight = new THREE.AmbientLight(0xFFFFFF, 1);
    sceneHUD.add(HUDlight)

    //Board creation
    createBoard();

    renderer.setAnimationLoop(animate);
}


/**
 * Creates the Map
 */
function createBoard() {
    let map = JSON.parse(jsonMap);

    let loader = new GLTFLoader();

    meshBoard = new Array();
    for (let i = 0; i < map.row; i++) {
        meshBoard[i] = new Array();
        for (let j = 0; j < map.col; j++) {
            let file = './asset/space_bits/gltf/terrain_low.gltf';
            switch (map.data[i][j].cat) {
                case 1:
                    file = './asset/space_bits/gltf/terrain_low.gltf';
                    break;
                case 2:
                    file = './asset/space_bits/gltf/terrain_low_curved.gltf';
                    break;
                case 3:
                    file = './asset/space_bits/gltf/terrain_slope.gltf';
                    break;
                case 4:
                    file = './asset/space_bits/gltf/terrain_slope_outer_corner.gltf';
                    break;
                case 5:
                    file = './asset/space_bits/gltf/terrain_slope_inner_corner.gltf';
                    break;
                default:
                    break;
            }

            loader.load(file, async (gltf) => {     //Loads everything
                meshBoard[i][j] = gltf.scene;
                meshBoard[i][j].position.set(j * 2, 0, i * 2);
                meshBoard[i][j].rotateY(Math.PI * 0.5 * map.data[i][j].rot);
                meshBoard[i][j].row = i;
                meshBoard[i][j].col = j;

                meshBoard[i][j].traverse((node) => {
                    if (node.isMesh) {
                        node.receiveShadow = true;
                        node.castShadow = true;
                    }
                });


                scene.add(meshBoard[i][j]);


                if (!await getCityInfo()) {
                    if (Math.random() * 100 < 25 && i !== 0 && j !== 0) {

                        let id;
                        switch (parseInt(Math.random() * 3)) {
                            case 1:
                                file = './asset/space_bits/gltf/rock_A.gltf';
                                id = 1;
                                break;
                            case 2:
                                file = './asset/space_bits/gltf/rock_B.gltf';
                                id = 2;
                                break;
                            case 3:
                                file = './asset/space_bits/gltf/rocks_A.gltf';
                                id = 3;
                                break;
                            case 0:
                                id = 4;
                                file = './asset/space_bits/gltf/rocks_B.gltf';
                        }


                        loader.load(file, async (gltf) => {
                            let rock = gltf.scene;
                            rock.position.set(j * 2, 0, i * 2);
                            rock.rotateY(Math.PI * Math.random() * 3);

                            rock.traverse((node) => {
                                if (node.isMesh) {
                                    node.castShadow = true;
                                    node.receiveShadow = true;
                                }
                            });

                            scene.add(rock);

                            meshBoard[i][j].linked = true;

                            let data = {
                                citta: cityId,
                                edificio: id,
                                livello: 1,
                                posizione: i + j * 10,
                                quantitaProdotta: 1,
                                rotazione: Math.PI * Math.random() * 3,
                            };

                            let formData = new FormData();
                            formData.append("data", JSON.stringify(data));

                            let res = await fetch("./api/buildingscity_add.php", {
                                method: "POST",
                                body: formData
                            })
                        });
                    }
                }

            });

        }
    }
    loadConstructions();


    sunLight.position.set((map.col * 2 * 0.5) + 80, 80, (map.row * 2 * 0.5));
    camera.position.set((map.col * 2 * 0.5) + 20, 20, (map.row * 2 * 0.5) + 15);
    controls.target = new THREE.Vector3((map.col * 2 * 0.5), 0, (map.row * 2 * 0.5));
    controls.update();
}

/**
 * Called every frame
 * @param timestamp
 */
function animate(timestamp) {

    if (perfTrigger) stats.begin();

    const delta = timestamp - lastFrameTime;
    if (delta < 1000 / maxFPS) {
        requestAnimationFrame(animate);
        return;
    }

    dt = clock.getDelta();

    renderer.clear();

    controls.update();

    renderer.render(scene, camera);

    renderer.clearDepth();

    renderer.render(sceneHUD, cameraHUD);

    render();
    if (perfTrigger) stats.end();

}
function render() {

    if (camera !== null && scene !== null) {
        idleTime+=dt;

        if (controls.autoRotateSpeed>0) controls.autoRotate = true;
        else controls.autoRotate=false;

        //region sun
        let c = sun(50);


        if (sunLight.intensity > 4) for (let i = 0; i < lights.length; i++) lights[i].intensity = 0;
        else if (sunLight.intensity < 1) for (let i = 0; i < lights.length; i++) lights[i].intensity = 2;

        if (c.y < 20 && c.x > 40 && sunLight.intensity > 0) sunLight.intensity -= dt;
        else if (c.y > -20 && c.x < -40 && sunLight.intensity < 5) sunLight.intensity += dt;

        sunLight.position.set(c.x, c.y, 0);
        //endregion

        if (idleTime<idleTrigger) {
            if (controls.autoRotateSpeed>0) controls.autoRotateSpeed-=dt*4;
            else {
                //region Selecting tile
                raycaster.setFromCamera(pointer, camera);

                // calculate objects intersecting the picking ray
                const intersects = raycaster.intersectObjects(scene.children);

                let first = -1;

                if (intersects[0] !== undefined) {

                    ready = false;
                    for (let i = 0; i < intersects.length; i++) {
                        if (intersects[i].object.name.includes("terrain")) {
                            if (!intersects[i].object.parent.linked) {
                                if (first === -1) first = i;
                                ready = true;
                            } else {
                                ready = false;
                                break;
                            }
                        }
                    }

                    if (ready && first !== -1) tileCoord = intersects[first].object.parent.position;

                    if ((!intersects[0].object.name.includes("terrain") || intersects[0].object.parent.linked) && editMode) intersects[0].object.material.emissive.set(0xaa0000);
                    else intersects[0].object.material.emissive.set(0x666666);

                    if (lastSquare !== undefined && intersects[0].object.material.emissive !== lastSquare.object.material.emissive) {
                        lastSquare.object.material.emissive.set(0x000000);
                    }

                    lastSquare = intersects[0];
                } else {
                    if (lastSquare !== undefined) {
                        lastSquare.object.material.emissive.set(0x000000);
                        lastSquare = undefined
                    }
                }
                //endregion

                //region Buildings Management
                for (let i = 0; i < elements.length; i++) {
                    elements[i].rotation.set(0, elements[i].rotation.y + dt, 0);
                    if (i === selected) elements[selected].rotation.set(0, elements[i].rotation.y + dt * 4, 0);
                }

                if (!open) {
                    if (cameraHUD.position.y < 7.5) cameraHUD.position.y += dt * 5;
                    else cameraHUD.position.y = 7.5;
                } else {
                    if (cameraHUD.position.y > 4) cameraHUD.position.y -= dt * 5;
                    else cameraHUD.position.y = 4;

                    v.set(20, 4, (selected) * 5)
                    if (!equals(cameraHUD.position, v, 0.1)) lerpToHUD(v);

                }
                //endregion

                //region Edit mode
                if (editMode) {
                    if (!loaded) {
                        elementLoaded = elements[selected].clone(true);
                        elementLoaded.rotation.set(0, 0, 0);

                        elementLoaded.traverse((node) => {
                            if (node.isMesh) {
                                node.castShadow = true;
                                node.receiveShadow = true;
                            }
                        });

                        scene.add(elementLoaded);
                        loaded = true;
                    } else elementLoaded.children[0].material.emissive.set(0x666666)
                    if (tileCoord !== undefined && tileCoord.x !== 0 && tileCoord.z !== 0) elementLoaded.position.set(tileCoord.x, tileCoord.y, tileCoord.z);

                } else {
                    if (loaded) {
                        elementLoaded.children[0].material.emissive.set(0x000000)
                        scene.remove(elementLoaded);
                        loaded = false
                    }
                }
                //endregion
            }
        } else if (controls.autoRotateSpeed<2) {
            controls.autoRotateSpeed+=dt;

            editMode=false;
            if (loaded) {
                elementLoaded.children[0].material.emissive.set(0x000000)
                scene.remove(elementLoaded);
                loaded = false
            }

            open=false;
            if (cameraHUD.position.y < 7.5) cameraHUD.position.y += dt * 5;
            else cameraHUD.position.y = 7.5;
        }
    }

}

/**
 * Loads all the buildings of the city (if any)
 * @returns {Promise<boolean>}
 */
let added = false;
async function getCityInfo() {


    let res = await fetch("./api/buildingscity_get.php");

    let buildings = await res.json();


    if (buildings.length !== 0 && !added) {

        let loader = new GLTFLoader();

        added = true;

        for (let i = 0; i < buildings.length; i++) {
            let b = buildings[i];

            loader.load(b.modello3D, (gltf) => {
                //Carica la mesh
                let mesh = gltf.scene.children[0];
                //Calcola la posizione nella griglia tridimensionale
                let p = Math.floor(b.posizione / 100);
                let r = Math.floor(b.posizione / 10);
                let c = b.posizione % 10;
                //Posiziona l'ogg
                mesh.position.set(r * 2, p * 2, c * 2);
                mesh.rotation.y = parseFloat(b.rotazione);
                meshBoard[c][r].linked = true;


                if (mesh.name.includes("lights")) {
                    lights.push(new THREE.PointLight(0xffffaa,2))
                    lights[lights.length-1].castShadow = true
                    lights[lights.length-1].position.set(r * 2, 0.8, c * 2)
                    scene.add(lights[lights.length-1]);
                }

                mesh.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                //Aggiunge l'ogg alla scena
                scene.add(mesh);

            })

        }
        console.log("Found saved map...");
        return true;
    } else if (buildings.length === 0) {
        console.log("Creating new map...");
        return false;
    } else return true;

}


/**
 * Adds all the buildings you can build
 */
async function loadConstructions() {
    let res = await fetch("./api/buildings_get.php", {
        method: "POST",
    })

    res = await res.json();
    let list = [];
    let loader = new GLTFLoader();


    for (let i in res) list.push([i, res [i]]);


    for (let i = 0; i < list.length; i++) {
        await loader.load(list[i][1][1], async (gltf) => {

            let obj = gltf.scene;
            obj.position.set(10, 0, i * 5);

            sceneHUD.add(obj);
            elements.push(obj);
            elementsId.push(list[i][1][3])
        });
    }
    selected = 0;
    cameraHUD.position.set(20, 4, 0);
}

/**
 * Places the building when confirming it
 * @returns {Promise<void>}
 */
async function confirmPlacement() {
    scene.add(createIndependentClone(elementLoaded));
    let sum = elementLoaded.position.z / 2 + elementLoaded.position.x / 2 * 10
    if (sum) {
        let data = {
            citta: cityId,
            edificio: elementsId[selected],
            livello: 1,
            posizione: sum,
            quantitaProdotta: 1,
            rotazione: elementLoaded.rotation.y,
        };

        let formData = new FormData();
        formData.append("data", JSON.stringify(data));

        await fetch("./api/buildingscity_add.php", {
            method: "POST",
            body: formData
        })


        meshBoard[sum % 10][Math.floor(sum / 10)].linked = true;

        editMode = false;
        open = false;
    } else console.log("ERROR " + sum)
}

/**
 * Creates a copy unlinked copy of an object
 * @param original
 * @returns {*}
 */
function createIndependentClone(original) {
    const clone = original.clone(true);

    clone.traverse((node) => {
        if (node.isMesh) {
            node.geometry = node.geometry.clone();
            node.material = node.material.clone();
            node.material.emissive.set(0x000000);
        }
    });

    console.log(original)
    if (original.children[0].name.includes("light")) {
        lights.push(new THREE.PointLight(0xffffaa, 2))
        lights[lights.length - 1].castShadow = true
        lights[lights.length - 1].position.set(original.position.x, 0.8, original.position.z)
        scene.add(lights[lights.length - 1]);
    }
    return clone;
}

/**
 * Confronts 2 vectors
 * @param v vector 1
 * @param v2 vector 2
 * @param epsilon bearable error
 * @returns {boolean} are equal?
 */
function equals(v, v2, epsilon = Number.EPSILON) {
    return ((Math.abs(v.x - v2.x) < epsilon) && (Math.abs(v.z - v2.z) < epsilon));
}

/**
 * Lerps the camera to a vector
 * @param v the vector to lerp to
 */
function lerpToHUD(v) {
    cameraHUD.position.lerp(v, 4 * dt);
}

/**
 * Calculates the path of the sun
 * @param radius distance from 0,0,0
 * @returns {{x: number, y: number}} x and y coordinates of the sun
 */
function sun(radius) {
    return {
        x: (Math.sin((Date.now() % dayDuration) / dayDuration * Math.PI * 2) * radius),
        y: (Math.cos((Date.now() % dayDuration) / dayDuration * Math.PI * 2) * radius)
    };
}

//Keyboard listener
document.addEventListener('keydown', (key) => {
    key = key.code;
    if (cameraHUD !== null) {
        switch (key) {
            case "ArrowLeft":
                if (open && !editMode) if (selected < elements.length - 1) selected++;
                break;
            case "ArrowRight":
                if (open && !editMode) if (selected > 0) selected--;
                break;
            case "Space":
                if (!editMode) open = !open;
                break;
            case "KeyE":
                if (open) editMode = !editMode;
                break;
            case "KeyQ":
                if (editMode && ready) confirmPlacement();
                break;
            case "KeyD":
                if (editMode) elementLoaded.rotation.y += 10 * dt;
                break;
            case "KeyA":
                if (editMode) elementLoaded.rotation.y -= 10 * dt;
                break;
            case "KeyR":

                break;
        }
    }
    idleTime=0;


})

//Mouse listeners
window.addEventListener("mousedown",()=>{
    idleTime=0;
})
window.addEventListener('pointermove', onPointerMove);
function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

//Called on window resize
window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        cameraHUD.aspect = width / height;
        camera.updateProjectionMatrix();
        cameraHUD.updateProjectionMatrix()
        renderer.setSize(width, height);
        setCanvasDimensions(renderer.domElement, width, height);
    });
function setCanvasDimensions(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}

window.requestAnimationFrame(render);
document.getElementById("bPlay").addEventListener("click", () => setTimeout(initScene, 100), false);

