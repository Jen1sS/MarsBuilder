/**
 * HO CREATO UN NUOVO ATTRIBUTO rotazione DENTRO EdificiCitta
 *
 * Keybindings:
 * - Spazio: entri/esci dalla edit mode
 * - E:
 *   - Se non sei in edit mode puoi rimuovere oggetti
 *   - Se sei in edit mode funge serve per confermare l'oggetto da selezionare
 * - A/D: Serve a far roteare un oggetto mentre lo piazzi
 * - Q: Serve a confermare
 *   - In caso tu sia in edit mode, piazzi l'edificio (Spazio+E)
 *   - In caso tu non lo sia rimuove l'oggetto selezionato (E)
 * - Frecce (sinistra e destra): Serve a scorrere l'array di costruzioni disponibili mentre sei in edit mode
 *
 * Credenziali per vedere qualcosa di figo:
 *  - 127.0.0.1.chance465@passmail.net
 *  - FDnDVFu&0eTr7qY8!hbR
 */


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
 * Sun model
 */
let sunModel;

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
let perfTrigger = true;
const stats = new Stats()
const maxFPS = 165;

/**
 * Orbital controls
 */
let controls;


/**
 * Resources
 */
let aluminum;
let energy;
let people;
let maxPeople;
let deltaIn;
let deltaOut;

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
let done = false;
let level = 1;

/**
 * Adds specific special buildings
 */
let turbine = [];
let drill = [];
let solar = [];
let living = [];

/**
 * Raycasting
 */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


/**
 * Game initializer
 */
async function initScene() {
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
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50000);

    cameraHUD = new THREE.PerspectiveCamera(50, width / height, 0.1, 20);
    cameraHUD.position.set(20, 0, 0);
    cameraHUD.lookAt(0, 0, 0);
    cameraHUD.updateProjectionMatrix();

    //Orbital controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.autoRotateSpeed = 0;

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

    sunLight.shadow.mapSize.width = 16384;
    sunLight.shadow.mapSize.height = 16384;

    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;

    //sun setup
    let loader = new GLTFLoader();
    const scale = 0.1;

    loader.load("./asset/space_bits/gltf/sun.glb", (gltf) => {
        sunModel = gltf.scene;
        sunModel.scale.set(scale, scale, scale);
        scene.add(sunModel);
    })
    scene.add(sunLight);
    //scene.add(new THREE.PointLightHelper(sunLight,5))

    nLight = new THREE.AmbientLight(0xaaaaff, 0.2);
    scene.add(nLight);

    HUDlight = new THREE.AmbientLight(0xFFFFFF, 1);
    sceneHUD.add(HUDlight)

    //Board creation
    createBoard();

    //region Fetch resources
    let data = {
        citta: cityId,
    };

    let formData = new FormData();
    formData.append("data", JSON.stringify(data));

    let res = await fetch("./api/resources_get.php", {
        method: "POST",
        body: formData
    })
    res = await res.json();

    if (res[0] != undefined) {
        aluminum = res[0].quantita
        energy = res[1].quantita
        people = res[2].quantita
    }

    document.getElementById("email").innerHTML += "<div id='risorse'>";
    for (let i = 0; i < res.length; i++) {
        document.getElementById("email").innerHTML +=
            "<div class='resource-item'>" +
            "<img src='" + res[i].icona + "' class='icona'>" +
            "<p id='" + i + "'>" + res[i].nome + ": " + res[i].quantita + "</p>" +
            "</div>";
    }
    document.getElementById("email").innerHTML += "</div>";
    //endregion


    setInterval(() => {
        let data = {
            citta: cityId,
            aluminum: aluminum,
            energy: energy,
            people: people,
        };

        let formData = new FormData();
        formData.append("data", JSON.stringify(data));

        fetch("./api/resources_update.php", {
            method: "POST",
            body: formData
        })
    }, 5000)
    renderer.setAnimationLoop(animate);
}


/**
 * Creates the Map
 */
async function createBoard() {
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

            let data = {
                citta: cityId,
            };

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


                            rock.children[0].position.set(rock.position.x, rock.position.y, rock.position.z)
                            scene.add(rock.children[0]);

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
        idleTime += dt;

        controls.autoRotate = controls.autoRotateSpeed > 0;


        //region resource updating

        updateRes(1, dt * 3 * drill.length, 0);

        deltaIn = 0;
        deltaOut = 0;

        deltaOut -= parseInt(people) * dt / 6;
        if (lights[0] !== undefined && lights[0].intensity === 2) deltaOut -= dt * lights.length;

        deltaIn += (dt * 3) * turbine.length;
        if (sunLight.intensity > 4) deltaIn += dt * 4.5 * solar.length;

        updateRes(2, deltaIn, deltaOut);
        updateRes(3, living.length * 3, 0);
        //endregion

        //region sun and lights
        let c = sun(50);

        if (sunLight.intensity > 4 || energy < 1) for (let i = 0; i < lights.length; i++) lights[i].intensity = 0;
        else if (sunLight.intensity < 1) for (let i = 0; i < lights.length; i++) lights[i].intensity = 2;

        if (c.y < 20 && c.x > 40 && sunLight.intensity > 0) sunLight.intensity -= dt;
        else if (c.y > -20 && c.x < -40 && sunLight.intensity < 5) sunLight.intensity += dt;

        if (sunModel !== undefined) sunModel.position.set(c.x, c.y, 0);
        sunLight.position.set(c.x, c.y, 0);
        //endregion

        //region Building animation
        for (let i = 0; i < turbine.length; i++) turbine[i].children[0].rotation.z += dt * 5;
        for (let i = 0; i < drill.length; i++) {
            if (drill[i].children[0].position.y > 0.5) drill[i].children[0].position.y -= dt * 0.5;

            drill[i].children[0].rotation.y += dt * 20;
        }

        //endregion

        if (idleTime < idleTrigger) {
            if (controls.autoRotateSpeed > 0) controls.autoRotateSpeed -= dt * 4;
            else {
                //region Selecting tile
                raycaster.setFromCamera(pointer, camera);

                // calculate objects intersecting the picking ray
                const intersects = raycaster.intersectObjects(scene.children);

                let first = -1;

                if (intersects[0] !== undefined && !intersects[0].object.name.includes("Sun_LOD1__0")) {
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

                    if (ready && first !== -1) {
                        tileCoord = intersects[first].object.parent.position;
                        level = 1;
                    }

                    if (editMode && !open) {
                        elementLoaded = undefined;
                        loaded = false;
                    }

                    if (intersects[0].object.name.includes("basemodule") && editMode && open && elementLoaded !== undefined && elementLoaded.children[0] !== undefined && elementLoaded.children[0].name.includes("basemodule") && !intersects[0].object.towerPart) {
                        intersects[0].object.material.emissive.set(0x0000aa);
                        tileCoord = new THREE.Vector3(intersects[0].object.position.x, intersects[0].object.position.y + 1, intersects[0].object.position.z);
                        level = intersects[0].object.position.y + 1;
                        ready = true;
                    } else if ((!intersects[0].object.name.includes("terrain") || intersects[0].object.parent.linked) && editMode && open) intersects[0].object.material.emissive.set(0xaa0000);
                    else if (!intersects[0].object.name.includes("terrain") && editMode && !open) {
                        intersects[0].object.material.emissive.set(0xaaaa00);
                        elementLoaded = intersects[0].object;
                    } else intersects[0].object.material.emissive.set(0x666666);

                    if (lastSquare !== undefined && intersects[0].object.material.emissive !== lastSquare.object.material.emissive) {
                        lastSquare.object.material.emissive.set(0x000000);
                    }

                    lastSquare = intersects[0];
                } else {
                    if (lastSquare !== undefined) {
                        if (!lastSquare.object.name.includes("Sun_LOD1__0")) lastSquare.object.material.emissive.set(0x000000);
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


                    if (elements[selected] !== undefined) v.set(20, 4, elements[selected].position.z);
                    else v.set(20, 4, (selected) * 5);

                    if (!equals(cameraHUD.position, v, 0.1)) lerpToHUD(v);

                }
                //endregion

                //region Edit mode
                if (editMode) {
                    if (open) {
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

                    }
                } else if (loaded) removeLoaded();
                //endregion
            }
        } else if (controls.autoRotateSpeed < 2) {
            controls.autoRotateSpeed += dt;

            editMode = false;
            if (loaded) {
                elementLoaded.children[0].material.emissive.set(0x000000)
                scene.remove(elementLoaded);
                loaded = false
            }

            open = false;
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
        let cd = buildings.length;

         for (let i = 0; i < buildings.length; i++) {
            let b = buildings[i];

             loader.load(b.modello3D, (gltf) => {
                //Carica la mesh
                let mesh = gltf.scene.children[0];
                //Calcola la posizione nella griglia tridimensionale
                let p = b.livello - 1;
                let r = Math.floor(b.posizione / 10);
                let c = b.posizione % 10;
                //Posiziona l'ogg
                mesh.position.set(r * 2, p, c * 2);
                mesh.rotation.y = parseFloat(b.rotazione);
                meshBoard[c][r].linked = true;


                if (mesh.name.includes("lights")) {
                    if (lights.length < 13) {
                        lights.push(new THREE.PointLight(0xffffaa, 2))
                        lights[lights.length - 1].castShadow = true
                        lights[lights.length - 1].position.set(r * 2, 0.8, c * 2)
                        scene.add(lights[lights.length - 1]);
                    } else console.log("Light limit reached, the lights will not emit light anymore ")
                } else if (mesh.name.includes("wind")) {
                    turbine.push(mesh);
                } else if (mesh.name.includes("dri")) {
                    drill.push(mesh);
                } else if (mesh.name.includes("solar")) {
                    solar.push(mesh);
                } else if (mesh.name.includes("basemo")) {
                    living.push(mesh);
                }

                mesh.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                console.log("a")
                //Aggiunge l'ogg alla scena
                scene.add(mesh);
                cd--;

                 if (cd === 0) {
                     for (let i = 0; i < living.length; i++) {
                         for (let j = 0; j < living.length; j++) {
                             if (living[i].position.y + 1 === living[j].position.y && equals(living[j].position, living[i].position)) {
                                 living[i].towerPart = true;
                             }
                         }
                     }
                     console.log("Found saved map...");
                 }

            })

        }

        console.log("Found saved map...");
        return true;
    } else if (buildings.length === 0) {
        if (!done) {
            done = true;
            console.log("Creating new map...");
            //region Resources start
            await fetch("./api/resources_start.php")
            let data = {
                citta: cityId,
            };

            let formData = new FormData();
            formData.append("data", JSON.stringify(data));

            let res = await fetch("./api/resources_get.php", {
                method: "POST",
                body: formData
            })
            res = await res.json();

            aluminum = res[0].quantita
            energy = res[1].quantita

            //endregion
        }
        return false;
    } else return true;

}

async function loadConstructions() {
    let res = await fetch("./api/buildings_get.php", {
        method: "POST",
    })

    res = await res.json();
    let list = [];
    let loader = new GLTFLoader();


    for (let i in res) list.push([i, res [i]]);


    for (let i = 0; i < list.length; i++) {

        loader.load(list[i][1][1], (gltf) => {
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

    let sum = elementLoaded.position.z / 2 + elementLoaded.position.x / 2 * 10
    if (sum) {
        let data = {
            citta: cityId,
            edificio: elementsId[selected],
            livello: elementLoaded.position.y + 1,
            posizione: sum,
            quantitaProdotta: 1,
            rotazione: elementLoaded.rotation.y,
            alluminio: aluminum,
            energia: energy,
        };

        let formData = new FormData();
        formData.append("data", JSON.stringify(data));

        let res = await fetch("./api/buildingscity_add.php", {
            method: "POST",
            body: formData
        })

        res = await res.json();

        if (res.code === 1) {
            let obj = createIndependentClone(elementLoaded)

            console.log("---------------")
            console.log("Placed: " + obj.children[0].name)
            console.log("Position: " + obj.position.x + "," + obj.position.y + "," + obj.position.z)
            console.log("Rotation Y: " + obj.rotation.y)
            console.log("Level: " + elementLoaded.position.y + 1);
            console.log("---------------")

            if (obj.children[0].name.includes("turbine")) turbine.push(obj.children[0])
            if (obj.children[0].name.includes("drill")) drill.push(obj.children[0])
            if (obj.children[0].name.includes("solar")) solar.push(obj.children[0])
            if (obj.children[0].name.includes("basemodule")) {
                living.push(obj.children[0])

                if (living.length > 1) {
                    for (let i = 0; i < living.length; i++) {
                        if (living[i].position.y + 1 === obj.position.y  && equals(obj.position, living[i].position))living[i].towerPart = true;
                    }
                }
                updateRes(3, living.length * 3, 0);
            }


            obj.children[0].position.set(obj.position.x, obj.position.y, obj.position.z);
            obj.children[0].rotation.set(elementLoaded.rotation.x, elementLoaded.rotation.y, elementLoaded.rotation.z);
            scene.add(obj.children[0]);
            meshBoard[sum % 10][Math.floor(sum / 10)].linked = true;


            updateRes(1, 0, aluminum - res.aluminum);
            updateRes(2, 0, energy - res.energy);

        } else if (res.code === 2) {
            alert("Sei povero")
        }


        editMode = false;
        open = false;
    } else console.log("ERROR " + sum)
}

/**
 * Removes a building from the city
 * @returns {Promise<void>}
 */
async function removeBuilding() {
    if (elementLoaded !== undefined) {
        if (elementLoaded.name.includes("light")) for (let i = 0; i < lights.length; i++) if (equals(elementLoaded.position, lights[i].position, 0.1)) scene.remove(lights[i]); //Linea piu corta in atlanta


        let sum = elementLoaded.position.z / 2 + elementLoaded.position.x / 2 * 10
        let data = {
            citta: cityId,
            posizione: sum,
            livello: elementLoaded.position.y + 1,
        };


        let formData = new FormData();
        formData.append("data", JSON.stringify(data));

        await fetch("./api/buildingscity_remove.php", {
            method: "POST",
            body: formData
        })

        editMode = false;

        if (elementLoaded.name.includes("basemodule")) {
            const raycaster = new THREE.Raycaster();
            const origin = new THREE.Vector3(elementLoaded.position.x, elementLoaded.position.y + 1, elementLoaded.position.z);
            const direction = new THREE.Vector3(0, 2, 0);
            raycaster.set(origin, direction);

            const intersects = raycaster.intersectObjects(scene.children, true);

            // Remove all intersected objects
            intersects.forEach(intersect => {
                scene.remove(intersect.object);
                for (let i = 0; i < living.length; i++) if (intersect.object.uuid === living[i].uuid) living.splice(i,1)
            });

            for (let i = 0; i < living.length; i++){
                if (elementLoaded.uuid === living[i].uuid) living.splice(i,1)
                for (let j = 0; j < living.length; j++) {
                    if (living[i].position.y + 1 === living[j].position.y && equals(living[j].position, living[i].position)) {
                        living[i].towerPart = false;
                    }
                }
            }
        }


        scene.remove(elementLoaded);
        meshBoard[sum % 10][Math.floor(sum / 10)].linked = false;


    }
}

/**
 * Removes the current elementLoaded through the editMode and open
 */
function removeLoaded() {
    elementLoaded.children[0].material.emissive.set(0x000000)
    scene.remove(elementLoaded);
    loaded = false
    editMode = false;
}

/**
 * Creates a copy unlinked copy of an object
 * @param original
 * @returns {*}
 */
function createIndependentClone(original) {
    let clone = original.clone(true);

    clone.traverse((node) => {
        if (node.isMesh) {
            node.geometry = node.geometry.clone();
            node.material = node.material.clone();
            node.material.emissive.set(0x000000);
        }
    });

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

/**
 * Updates the resource
 */
function updateRes(num, income, outcome) {
    income = parseFloat(income);
    outcome = parseFloat(outcome);

    if (outcome > 0) outcome *= -1;
    if (income < 0) income *= -1;

    switch (num) {
        case 1:
            aluminum = parseFloat(aluminum) + income;
            aluminum = parseFloat(aluminum) + outcome;

            document.getElementById("0").innerHTML = "Alluminio: " + aluminum.toFixed(0) + " (+" + (income * (1 / dt)).toFixed(0) + "/s)";
            break;
        case 2:
            energy = parseFloat(energy) + income;
            energy = parseFloat(energy) + outcome;

            if (energy < 0) energy = 0;

            document.getElementById("1").innerHTML = "Energia: " + energy.toFixed(0) + " (+" + (income * (1 / dt)).toFixed(0) + "/s)" + " (" + (outcome * (1 / dt)).toFixed(0) + "/s)";
            break;
        case 3:
            maxPeople = income;

            if (Math.random() > 0.99) if (people < maxPeople) people++;
            else if (Math.random() > 0.5) if (people > maxPeople) people--;

            if (maxPeople - people === 0) document.getElementById("2").innerHTML = "Persone: " + people + " (Overload: " + (people-maxPeople) + ")";
            else if (maxPeople === people) document.getElementById("2").innerHTML = "Persone: " + people + " (max)";
            else document.getElementById("2").innerHTML = "Persone: " + people;

            break;
    }

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
                open = !open;
                if (!open && loaded) removeLoaded();
                break;
            case "KeyE":
                editMode = !editMode;
                break;
            case "KeyQ":
                if (editMode && ready && open) confirmPlacement();
                else if (editMode && !open) removeBuilding();
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
    idleTime = 0;


})

//Mouse listeners
window.addEventListener("mousedown", () => {
    idleTime = 0;
})
window.addEventListener('pointermove', onPointerMove);

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    idleTime = 0;
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

