    (function (){   
        var body, container, hearts, spades, isTouch;        

        body = $('body');
        container = $("<div>");
        hearts = $("<div>");
        spades = $("<div>");


        TweenMax.set(body, {css:{
          width:258,
          height:401,
          transformStyle:"preserve-3d",
          perspective: 800,
          perspectiveOrigin:'50% 50% 0px',
          backgroundColor:'#000000',
          'margin-left':'auto',
          'margin-right':'auto'
        }})


        TweenMax.set(container, {css:{
          transformStyle:"preserve-3d",
          z:0
        }});

        TweenMax.set(hearts, {css:{
          backgroundImage:'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/hearts.png")'
        }});

        TweenMax.set(spades, {css:{
          backgroundImage:'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/spades.png")',
                                  rotationY:-180

                                }});


        TweenMax.set([hearts, spades], {css:{
          width:258,
          height:401,
          backfaceVisibility:"hidden", 
          position:"absolute",}})

        container.appendTo(body);
        hearts.appendTo(container);
        spades.appendTo(container);

        isTouch = ("touchstart" in document.documentElement);

        
        enableUI();


      

      function onMouseDown (e){

        TweenMax.to(container, 2, {css:{rotationY:"+=180"}, onComplete:enableUI, ease:Power2.easeInOut});
        TweenMax.to(container, 1, {css:{z:"-=100"}, yoyo:true, repeat:1, ease:Power2.easeIn});
      }

      function enableUI (){
        
        if(isTouch){

          container.one("touchend", onMouseDown);
        } else {

          container.one("click", onMouseDown);
        }
      }
})();