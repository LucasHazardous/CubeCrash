var playerPositionX = 0;
const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const icosahedronGeometry = new THREE.IcosahedronGeometry();

const greenMaterial = new THREE.MeshPhongMaterial({color: 0x17ffae, shininess: 10});
const redMaterial = new THREE.MeshPhongMaterial({color: 0xff1759, shininess: 100});

const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);

const canvas = document.querySelector('#c');

const fov = 70;
const aspect = 2;
const near = 0.1;
const far = 7;

var enemySpeed = 0.01;

document.onkeydown = (e) => {
    if(e.key === "a" && playerPositionX-1 > -5) {
        playerPositionX--;
    } else if(e.key === "d" && playerPositionX+1 < 5) {
        playerPositionX++;
    }
}

function main() {
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;

    const scene = new THREE.Scene();

    light.position.set(-1, 2, 3);
    scene.add(light);

    function makeIcosahedron() {
        const icosahedron = new THREE.Mesh(icosahedronGeometry, redMaterial);
        icosahedron.position.z = -4;
        scene.add(icosahedron);
        return icosahedron;
    }

    var icosahedrons = [];

    for(let i = 0; i < 3; i++) icosahedrons.push(makeIcosahedron());

    const player = new THREE.Mesh(boxGeometry, greenMaterial);
    scene.add(player);
    
    const increaseSpeed = setTimeout(() => {
        enemySpeed += 0.01;
    }, 5000);

    function render(time) {
        time *= 0.001;
        
        player.rotation.x = time;
        player.rotation.y = time;
        player.position.x = playerPositionX;

        icosahedrons.forEach(i => {
            i.position.z += enemySpeed;
            if(i.position.z >= 0 && playerPositionX === i.position.x) {
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            }

            if(i.position.z >= 1) {
                i.position.x = Math.floor(Math.random()*9-4);
                i.position.z = -4;
            }
        });
        
        renderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();