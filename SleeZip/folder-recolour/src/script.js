gsap.config({trialWarn: false});
let select = s => document.querySelector(s),
		mainSVG = select('#mainSVG'),
		folderContainer = select('#folderContainer'),
		btnContainer = select('#btnContainer'),
		colorArray = ["f85f60","f8aa47","fbd96d","7ad4f8","88f193","b050d4","323232"],
    dot = select('.dot'),
    outline = select('.outline'),
    spacerX = 100,
    dotPosArr = [],
    currColor = 0,
    folder = select('.folder'),
    folderArr = [],
    btnArr = []
		

colorArray = colorArray.map(x => Array.from(x)[0] == '#' ? x : `#${x}`);
const interp = gsap.utils.interpolate(colorArray);

gsap.set('svg', {
	visibility: 'visible'
})

function getUniqueID() {
    return `_${Math.random()
      .toString(36)
      .substr(2, 9)}`
  }

function newFolder(obj) {
  
  let clone = folder.cloneNode(true);
  folderContainer.appendChild(clone);  
  folderArr.push(clone);
  let q = gsap.utils.selector(clone);
  let GUID = getUniqueID();
  q('.dotClip')[0].id = GUID;
  q('.dotContainer')[0].setAttribute('clip-path', `url(#${GUID})`);
  let dotMask = q('.dotMask')[0];
  let tempDot = dot.cloneNode(true);
  clone.appendChild(tempDot);
  let back = q('.back')[0];
  let front = q('.front')[0];
  gsap.set([back, front, tempDot], {
    fill: colorArray[currColor]
  })
  let tl = gsap.timeline({paused: true});
  tl.fromTo(tempDot, {
    ...dotPosArr[currColor]
  }, {
    //x: 540,
    y: 540,
    attr: {
      r: 20
    },
    ease: 'expo'
  })
  .set(tempDot, {
    attr: {
      r: 0
    }   
  })
 .set(dotMask, {
    x: dotPosArr[currColor].x,
    y: 540    
  })
  .to(dotMask, {
    attr: {
      r: 800
    },
    duration: 0.32,
    ease: 'linear'
  })
  
  if(obj.init) {
    tl.progress(1);
  } else {
    tl.play()
  }

}

function setColor (colorId) {  
  currColor = colorId;
  gsap.to(outline, {
    ...dotPosArr[colorId],
    ease: 'elastic(0.35, 0.73)',
    stroke: colorArray[colorId],
    duration: 0.5
  })
}
colorArray.forEach((i, c) => {
  let clone = dot.cloneNode(true);
  btnContainer.appendChild(clone);
  btnArr.push(clone);
  let pos = {x: 230 + (c * spacerX), y: 913};
  dotPosArr.push(pos);
  gsap.set(clone, {
    transformOrigin: '50% 50%',
    fill: i,
    x: pos.x,
    y: pos.y
  })  
  
  clone.addEventListener('click', (function(e) {
    if(currColor == c ) return;

    
    if(folderArr.length > 2) {
      gsap.to(folderArr[0], {
        opacity: 0,
        duration: 0.2,
        ease: 'linear',
        onComplete: function() {
          folderContainer.removeChild(folderArr[0]);
          folderArr.shift();          
        }
      })
    }
    setColor(c);
    newFolder({init: false});    
  }))
/*   clone.addEventListener('pointerover', (function(e) {
    gsap.to(btnArr, {
        scale: gsap.utils.distribute({
          base: 0.6,
          amount: -0.4,
          from: c,
          //ease: 'expo.inOut'
        }),
    })
    
  }))
   */
})

gsap.set(outline, {...dotPosArr[currColor]})

newFolder({init: true})