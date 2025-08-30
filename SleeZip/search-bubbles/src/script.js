const fileName = "KKwwEiksQMIvw6GO";

function objectArray (all, name) {
  return all.filter(item => item.name== name )
}

let allLensT = [];
let allLensB = [];
let particleArray = [];
let offset = 30;
let sizeObj = {width: window.innerWidth,
							 height: window.innerHeight
							};

function getDuplicateNameObjects (app, obj, name) {
  if(new RegExp(name).test(obj.name)){
    return true
  }
  
}

import { Application } from "https://esm.sh/@splinetool/runtime";
const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
//const myVariables = { displayText: 'Chris!', mySize: 350 };
app.load(`https://prod.spline.design/${fileName}/scene.splinecode`)
.then(() => {
  
    let allObjects = app.getAllObjects();    
  
    allObjects.forEach((i, c) => {
       if(getDuplicateNameObjects(app, i, 'lensT')){
        allLensT.push(i);
      }
     if(getDuplicateNameObjects(app, i, 'lensB')){
        allLensB.push(i);
      }

    })  
  //console.log(allLensT)
  
    let mainTl = gsap.timeline();
  let scale = gsap.utils.random(1, 1.26)
  
    allLensT.forEach((i, c) => {
      //return
      let tl = gsap.timeline();
      tl.fromTo(i.scale, {
        x: 0.2,
        y: 0.2,
        z: 0.2
      },{
        x: scale,
        y: scale,
        z: scale,        
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 0.86
        
      })
   .from(i.position, {
        z: -60,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 0.86
        
      }, 0)      
      mainTl.add(tl, c/offset)
      //console.log(i, c)

    })
    allLensB.forEach((i, c) => {
     let tl = gsap.timeline();
      tl.fromTo(i.scale, {
        x: 0.2,
        y: 0.2,
        z: 0.2
      },{
        x: scale,
        y: scale,
        z: scale,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 0.86        
      })
   .from(i.position, {
        z: -60,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 0.86
        
      }, 0)
      
      mainTl.add(tl, 0.5+c/(offset))
      //console.log(i, c)

    })
  
    mainTl.seek(1000);
  
  function clickBubbles() {
    mainTl.pause()
    allLensB.forEach((i, c) => {
      //gsap.killTweensOf(i);
      gsap.to(i.position, {
        z: '+=900',
        delay: c/90
      })
      gsap.to(i.scale, {
        x: 0,
        y: 0,
        z: 0,
        delay: c/90
      })
    })
   allLensT.forEach((i, c) => {
      //gsap.killTweensOf(i);
      gsap.to(i.position, {
        z: '+=900',
        delay: c/90
      })
      gsap.to(i.scale, {
        x: 0,
        y: 0,
        z: 0,
        delay: c/90
      })
    })
    
    gsap.delayedCall(2, function() {
      mainTl.resume()
    })
  }
  
  
	/* 	app.addEventListener('mouseDown', (e) => {
				
			if (e.target.name === 'whole') {
        clickBubbles()
			}
		});    
   */
	});
  
