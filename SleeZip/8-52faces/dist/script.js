// Master Timeline
var master = new TimelineMax({
  // onUpdate: controls.updateSlider,
  repeat: -1,
  repeatDelay: 0,
  smoothChildTiming: true
});

var sleftbrow = $('.face0 > path.l'),
  srightbrow = $('.face0 > path.r'),
  smouth = $('.face0 > path.m'),
  seyer = $('.eye:eq(1) path'),
  seyel = $('.eye:eq(0) path');

var randoHex = function() {
  var hex = '#' + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16));

  // console.log(hex);
  return hex;
}

// Animations
function faceMorph(i, eyeX) {
  var t = 0.2,
    d = 0.28;

  var tl = new TimelineMax({
    delay: d,
    ease: Elastic.easeOut
  });

  // tl.timeScale = 2;

  var face = $('.face' + i),
    leftbrow = face.find('path.l'),
    rightbrow = face.find('path.r'),
    mouth = face.find('path.m'),
    eyel = face.find('.el'),
    eyer = face.find('.er');

  tl
    .add('morph' + i)
    .to(sleftbrow, t, {
      morphSVG: leftbrow
    }, 'morph' + i)
    .to(srightbrow, t, {
      morphSVG: rightbrow
    }, 'morph' + i)
    .to(smouth, t, {
      morphSVG: mouth
    }, 'morph' + i)
    .to([seyer, seyel], t, {
      x: eyeX
    }, 'morph' + i)
    // .to('body', t, {backgroundColor: randoHex()}, 'morph' + i)
  ;

  if (eyer.length) {
    tl
      .to(seyer, t, {
        morphSVG: eyer
      }, 'morph' + i)
      .to(seyel, t, {
        morphSVG: eyel
      }, 'morph' + i);
  } else {
    tl
      .to(seyer, t, {
        morphSVG: seyer
      }, 'morph' + i)
      .to(seyel, t, {
        morphSVG: seyel
      }, 'morph' + i);
  }

  return tl;
}

function wiggle() {
  var tl = new TimelineMax({
    repeat: -1
  });

  tl
    .add('start')
    .to('.wiggle1', 0.1, {
      display: 'none'
    }, 'start')
    .to('.wiggle2', 0.1, {
      display: 'block'
    }, 'start')
    .to('.wiggle2', 0.1, {
      display: 'none'
    }, 'start+1')
    .to('.wiggle3', 0.1, {
      display: 'block'
    }, 'start+1')
    .to('.wiggle2', 0.1, {
      display: 'none'
    }, 'start+2')
    .to('.wiggle3', 0.1, {
      display: 'block'
    }, 'start+2');

  return tl;
}

wiggle();
master.add(faceMorph(1, 0));
master.add(faceMorph(2, 0));
master.add(faceMorph(3, 0));
master.add(faceMorph(4, 0));
master.add(faceMorph(5, 0));
master.add(faceMorph(6, 10));
master.add(faceMorph(7, 0));
master.add(faceMorph(8, -10));
master.add(faceMorph(9, 10));
master.add(faceMorph(10, 0));
master.add(faceMorph(11, 0));
master.add(faceMorph(12, 0));
master.add(faceMorph(0, 0));

// reveal

TweenMax.set('.container svg:nth-child(2)', {
  visibility: 'visible',
  delay: 20.5
});

TweenMax.set('.container svg:nth-child(3)', {
  visibility: 'visible',
  delay: 15.5
});

/* controls */

// $('document').ready(controls());

function controls() {
  $('body').append('<div id="slider"></div><button class="replay">Replay?</button>');

  master
    .add('button', 1)
    .from('.replay', 0.2, {
      y: -20,
      opacity: 0
    }, 'button');

  $('button').click(function() {
    master.progress(0).play();
  });

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

  var updateSlider = function() {
    $("#slider").slider("value", master.progress());
  }

  return updateSlider;
}