var outline1 = $('#outlines1 > *')
var outline2 = $('#outlines2 > *')
var letters = $('#letters')
var shadow = $('#fill')
var blendFills = $('#blend > rect')
var topType = $('#blend rect')
var bottomType = $('#bottom > g, #NASAlogo')
var topType = $('#top > g')

function drawOutlines() {
  var tl = new TimelineMax();
  
  // Animate
  tl
  .from(outline1, 1, {
    drawSVG: '0% 0%',
    ease: Linear.easeNone
  }, 0)
  .from(outline2, 1, {
    drawSVG: '0% 0%',
    ease: Linear.easeNone
  }, 0)
  
  return tl;
}

function fillIn() {
  var tl = new TimelineMax()
  
  tl
  .staggerTo(blendFills, 0.05, {
    opacity: 1
  }, 0.005)
  
  return tl
}

function linesIn() {
  var tl = new TimelineMax();
  
  tl
  .staggerTo(outline2, 0.3, {
    x: -10,
    y: -10,
    ease: Linear.easeNone
  }, -0.1)
  .set([outlines1, outline2], {
    display: 'none'
  })
   
  return tl;
}

function linesOut() {
  var tl = new TimelineMax();
  
  tl
  .staggerTo(outline2, 0.3, {
    x: 0,
    y: 0,
    ease: Linear.easeNone
  }, -0.1)
  
  return tl;
}

function shadowFills() {
    var tl = new TimelineMax();
  
  tl
  .set(shadow, {
    fill: 'none',
    stroke: "black",
    opacity: 1
  })
  .from(shadow, 0.2, {
    drawSVG: "40% 40%"
  })
  .to(shadow, 0.2, {
      fill: 'black'
  })
  
  return tl;
}

function topTextIn(){
  var tl = new TimelineMax()
  
  tl
  .set(topType, {
    opacity: 0,
    y: 10
  })
  .staggerTo(topType, 0.5, {
    opacity: 1,
    y: 0
  }, 0.3)
  
  return tl
}

function bottomTextIn(){
  var tl = new TimelineMax()
  
  tl
  .set(bottomType, {
    opacity: 0,
    y: 10
  })
  .staggerTo(bottomType, 0.5, {
    opacity: 1,
    y: 0
  }, 0.3)
  
  return tl
}


// Master Timeline

var master = new TimelineMax({
  onUpdate: function(){
    $("#slider").slider("value", master.progress());
  },
  repeat: -1,
  repeatDelay: 7,
  yoyo: true,
  smoothChildTiming: true
});


// Set out layers
master
.set([blendFills, shadow, bottomType, topType, '#NASAlogo'], {
  opacity: 0
})
.set([outline1, outline2], {
  stroke: '#fff'
})
.set(outline2, {
  x: -10,
  y: -10
})
.set('svg', {visibility: 'visible'})
master.add(drawOutlines())
master.add(linesOut())
master.add(fillIn())
master.add(linesIn(), 'one')
master.add(shadowFills(), 'one')
master.add(topTextIn())
master.add(bottomTextIn())

TweenMax.globalTimeScale( 2 )

/* controls */
$('body').append('<div class="controls"><div id="slider"></div></div>');

// master
//   .add('button')
//   .from('.replay', 0.2, {
//     y: -20,
//     opacity: 0
//   }, 'button');

// $('button').click(function() {
//   master.progress(0).play();
// });

$("#slider").slider({
  range: false,
  min: 0,
  max: 1,
  step: .001,
  slide: function(event, ui) {
    master.progress(ui.value).pause();
  },
  stop: function() {
    master.play();
  }
});


/* Post Proc */
// (function postProc() {
//   var image = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/152635/ricepaper_v3.png',
//     color = '#CD5C5C',
//     blend = 'multiply';

//   $('body').append('<div class="overlay"></div>');

//   TweenMax.set('.overlay', {
//     backgroundImage: 'url("' + image + '")',
//     opacity: 0.3,
//     backgroundColor: color,
//     backgroundBlendMode: blend
//   })
// })();