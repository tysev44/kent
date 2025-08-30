const fileName = "MjCvnJZdA99FCUo4";

function r2d (r) {
  return r * (180/Math.PI);
}
function d2r (d) {
  return d * (Math.PI/180);
}
function objectArray (all, name) {
  return all.filter(item => item.name== name )
}
function getDuplicateNameObjects (app, obj, name) {
  if(new RegExp(name).test(obj.name)){
    return true
  }  
}
//   if(getDuplicateNameObjects(app, c, 'Shape')){
//    shapeObjArr.push(c);
// }
const timelineObject = {
      repeat: -1,
      defaults: {
        ease: 'elastic(0.5, 0.43)',
        duration: 1
      }
    }
import { Application } from "https://esm.sh/@splinetool/runtime";
const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
//const myVariables = { displayText: 'Chris!', mySize: 350 };
app.load(`https://prod.spline.design/${fileName}/scene.splinecode`)
.then(() => {

	});