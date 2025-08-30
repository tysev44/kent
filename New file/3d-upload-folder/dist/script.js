import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';
const main = document.querySelector('main');
const input = main.querySelector('input');
const canvas = main.querySelector('canvas');
const camera = new THREE.OrthographicCamera(canvas.offsetWidth / -2, canvas.offsetWidth / 2, canvas.offsetHeight / 2, canvas.offsetHeight / -2, -50000, 10000);
camera.position.set(0, 0, 0);
camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));
const scene = new THREE.Scene();
const loader = new SplineLoader();
loader.load('https://prod.spline.design/UqvCyljDbsFDF8Mh/scene.splinecode', (splineScene) => {
    splineScene.position.x = 0;
    scene.add(splineScene);
});
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
renderer.setAnimationLoop(animate);
// scene settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.left = canvas.offsetWidth / -2;
    camera.right = canvas.offsetWidth / 2;
    camera.top = canvas.offsetHeight / 2;
    camera.bottom = canvas.offsetHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}
function animate(time) {
    renderer.render(scene, camera);
}
input.addEventListener('dragenter', (e) => {
    if (main.classList.contains('dragover')) {
        return;
    }
    main.classList.add('dragover');
    gsap.to(main, {
        '--document-rotate': .4,
        '--document-x': .65,
        '--document-center-y': '-4px',
        duration: .55,
        ease: 'elastic(1, .8)'
    });
});
input.addEventListener('dragleave', (e) => {
    if (!main.classList.contains('dragover')) {
        return;
    }
    main.classList.remove('dragover');
    gsap.to(main, {
        '--document-rotate': 1,
        '--document-x': 1,
        '--document-center-y': '0px',
        duration: .2,
    });
});
input.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!main.classList.contains('dragover')) {
        return;
    }
    main.classList.remove('dragover');
    gsap.to(main, {
        keyframes: [{
                '--document-rotate': 0,
                '--document-x': .25,
                '--document-opacity': 0,
                duration: .2,
            }, {
                '--header-scale': .9,
                '--header-y': '-16px',
                '--header-opacity': 0,
                duration: .25
            }, {
                '--document-center-y': '-136px',
                '--document-center-rotate': '90deg',
                '--document-center-scale': '.85',
                '--folder-y': '-45%',
                '--folder-scale': .5,
                '--folder-opacity': 1,
                duration: .35
            }, {
                '--loading-scale': 1,
                '--loading-y': 0,
                '--loading-opacity': 1,
                duration: .2,
                delay: .15,
                onStart: () => {
                    gsap.to(main, {
                        '--document-center-y': '-24px',
                        duration: .4,
                        onComplete: () => {
                            gsap.to(main, {
                                keyframes: [{
                                        '--document-center-y': '-20px',
                                        '--folder-y': '-43.5%',
                                        duration: .1
                                    }, {
                                        '--document-center-y': '-24px',
                                        '--folder-y': '-45%',
                                        duration: .25
                                    }]
                            });
                        }
                    });
                }
            }, {
                '--loading-scale': .75,
                '--loading-y': '-8px',
                '--loading-opacity': 0,
                '--folder-opacity': 0,
                '--document-center-opacity': 0,
                duration: .35,
                delay: 2,
                onComplete: () => {
                    gsap.set(main, {
                        '--folder-scale': .5,
                        '--folder-y': '-55%',
                        '--folder-opacity': 0,
                        '--loading-scale': .75,
                        '--loading-y': '8px',
                        '--document-x': 0,
                        '--document-rotate': 0,
                        '--document-opacity': 0,
                        '--document-center-y': '-8px',
                        '--document-center-rotate': '0deg'
                    });
                }
            }, {
                '--document-center-y': '0px',
                '--document-center-opacity': '1',
                '--document-center-scale': 1,
                '--document-opacity': 1,
                '--header-scale': 1,
                '--header-y': '0px',
                '--header-opacity': 1,
                duration: .35
            }, {
                '--document-x': 1,
                '--document-rotate': 1,
                duration: .65,
                ease: 'elastic(1, .75)'
            }]
    });
});