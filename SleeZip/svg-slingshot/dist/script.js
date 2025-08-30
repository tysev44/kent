(function (exports) {
    
    var
        BallFactory = function BallFactory () {
            
            var 
                sceneRect,                
                sceneContainerElem,
                boundaryHeight,
                boundaryWidth,
                api = {},     
                mouse = mouse,
                
                _boundMove = function _boundMove () {
                    this.el.setAttribute('cx', Number(this.position.x).toFixed(5));
                    this.el.setAttribute('cy', Number(this.position.y).toFixed(5));
                };
            
            api.init = function init (params) {
                
                params = params || {};

                api.el = params.svg || {};

                api.position = {
                    x: Number(api.el.getAttribute('cx')),
                    y: Number(api.el.getAttribute('cy'))
                };
                api.radius = Number(api.el.getAttribute('r'));

                api.velocity = params.velocity || {x: 10, y: 0};
                api.mass = params.mass || 0.1;   // kg
                api.restitution = params.restitution || -0.7; 
                
                mouse = params.mouse || {};

                // TODO: Pick one of the following two
                sceneRect = 
                    params.sceneRect || 
                    api.el.parentNode.getBoundingClientRect() || 
                    document.body.getBoundingClientRect();

                sceneContainerElem = 
                    params.sceneContainerElem || 
                    api.el.parentNode || 
                    document.body;

                boundaryHeight = sceneRect.height;                    
                boundaryWidth = sceneRect.width;

            };
                
            /**
             * Set the initial velocity params for the object when the mouse is released. 
             * After setting here, we'll continue to integrate from these values on every animation frame 
             */
            api.handleMouseUp = function handleMouseUp (ev) {
                

                // diff b/w position where ball drag began, and where the mouse currenly resides
                api.velocity.y = (api.position.y - mouse.y) / 10;                        
                api.velocity.x = (api.position.x - mouse.x) / 10;                
            };


            /**
            * The user has indicted that they would like to move the ball to 
            * this position.
            */
            api.handleMouseDown = function handleMouseDown(ev) {
                if (ev.which === mouse.CODES.mouseDown) {

                    api.position.x = ev.pageX - sceneRect.left;
                    api.position.y = ev.pageY - sceneRect.top;
                    _boundMove.call(api);
                }  
            };

            api.handleWallCollisions = function handleWallCollisions () {
                
                // Left boundary collision
                if (api.position.x < api.radius) { 
                    
                    api.velocity.x *= api.restitution;
                    api.position.x = api.radius;
                }

                // Right boundary collision
                if (api.position.x > boundaryWidth - api.radius) {
                    api.velocity.x *= api.restitution;
                    api.position.x = boundaryWidth - api.radius;
                }

                // Bottom boundary collision
                if (api.position.y > boundaryHeight - api.radius) {          
                    api.velocity.y *= api.restitution;
                    api.position.y = boundaryHeight - api.radius;
                }
                
                // Top boundary collision
                if (api.position.y < api.radius) {
                    api.velocity.y *= api.restitution;
                    api.position.y = api.radius;
                }
            };

            api.move = _boundMove.bind(api);      
            
            return api;
        },
                
    
        Ball = function (params) {
            
            var ball = Object.create(BallFactory());            
            if (params) ball.init(params);      // allow for immediate or deferred initialization
            
            return ball;
        };
        
    
    exports.Ball = Ball;
    
} (window));


var demo = (function (exports) {

    'use strict';
    
    var         
        SELECTORS = {
            sceneContainer: '.scene',
            ball: '.ball',
            slingshot: '.slingshot'
        },
        
        sceneContainerElem = document.querySelector(SELECTORS.sceneContainer),        
        sceneContainerRect = sceneContainerElem.getBoundingClientRect(),
        
        SVGHeightToPageRatio = sceneContainerRect.height / sceneContainerElem.viewBox.animVal.height,
        SVGWidthToPageRatio = sceneContainerRect.width / sceneContainerElem.viewBox.animVal.width,
    
        ballSVG = sceneContainerElem.querySelector(SELECTORS.ball),
        slingshotSVG = sceneContainerElem.querySelector(SELECTORS.slingshot),
                
        
        // Central Mouse Handler
        Mouse = {
            isDown: false,
            x: 0,
            y: 0,            
            setPositionInScene: function setPositionInScene (ev, sceneContainerRect) {  
                this.x = ev.pageX - sceneContainerRect.left;
                this.y = ev.pageY - sceneContainerRect.top; 
            },            
            CODES: {
                mouseUp: 1,
                mouseDown: 1,
                mouseMove: 1 
            }
        },
        
        // Slingshot
        Slingshot = {
            el: slingshotSVG,
            
            /**
             * Initialize an unstreched line by setting both X's and both Y's to the same point
             */
            setStartPoint: function setStartPoint (ev) {
                this.el.setAttribute('x1', ev.pageX - sceneContainerRect.left);
                this.el.setAttribute('x2', ev.pageX - sceneContainerRect.left);
                this.el.setAttribute('y1', ev.pageY - sceneContainerRect.top);
                this.el.setAttribute('y2', ev.pageY - sceneContainerRect.top);
            },
            
            
            /**
             * mouse move handler to extend the line
             */
            extendLineOnPull: function extendLineOnPull (mouseX, mouseY) {
                this.el.setAttribute('x2', mouseX);
                this.el.setAttribute('y2', mouseY);
            },
            
            disappear: function disappear () {
                this.el.setAttribute('x1', 0);
                this.el.setAttribute('x2', 0);
                this.el.setAttribute('y1', 0);
                this.el.setAttribute('y2', 0);
            }
        },
        
        ATTRIBUTES = {
            ballId: 'data-id'
        },
            
            
        ballObj = Ball({
            svg: ballSVG,
            sceneRect: sceneContainerRect,
            sceneContainerElem: sceneContainerElem,
            velocity: {x: 10, y: 0},
            mass: 0.1,  // kg
            radius: 15,         
            restitution: -0.7,
            mouse: Mouse // TODO: Needed?
        }),
                        
        frameRate = 1 / 60,  // seconds
        frameDelay = frameRate * 1000,
        loopTimout = null,        
                                                
        
        Cd = 0.47,   // Coefficient of drag (Dimensionless for the shape of a ball)
        rho = 1.22,  // Density of the fluid (in this case, air) kg / m^3
        A = Math.PI * ballObj.radius * ballObj.radius / (10000),   // m^2  (Frontal area (or frontal projection) of the object) 
        ag = 9.1,      // m / s^2
            
        Fx,   // Force in X-direction
        Fy,
        
        ax,  // Accelearation in x-direction
        ay,
        
        metersPerPixel = 100, // 1cm == 1px          
        
        // Compute time diff in ms over each call of RAF
        previousTime = new Date().getTime(),  // start the clock
        elapsedTimeMs,
        currentTime;
        
        
    
    function init () {
               
        sceneContainerElem.addEventListener('mouseup', function (ev) {
            
            if (ev.which === Mouse.CODES.mouseUp) {
                debugger;
                Mouse.isDown = false;
                ballObj.handleMouseUp(ev); 
                Slingshot.disappear();
            }
        }, false);
        
        
        sceneContainerElem.addEventListener('mousemove', function (ev) { 
            if (ev.which === Mouse.CODES.mouseMove && Mouse.isDown) {                
                
                Mouse.setPositionInScene(ev, sceneContainerRect);
                Slingshot.extendLineOnPull(Mouse.x, Mouse.y);
            }
        }, false);
            
            
        sceneContainerElem.addEventListener('mousedown', function (ev) {
            
            //debugger;
            
            if (ev.which === Mouse.CODES.mouseDown) {
                
                Mouse.isDown = true;
                Mouse.setPositionInScene(ev, sceneContainerRect);
                
                Slingshot.setStartPoint(ev);
                ballObj.handleMouseDown(ev);
            }            
        }, false);
            
        runLoop();
    }
    

    
    function runLoop () {
        //debugger;
                
        requestAnimationFrame(runLoop);
        
        if (!currentTime) {
            currentTime = new Date().getTime();
        }
        elapsedTimeMs = currentTime - previousTime;
        
        if (!Mouse.isDown) {
            // Compute motion
                        
            // Drag force: Fd = -1/2 * Cd * A * rho * v * v
            Fx = -0.5 * Cd * A * rho * 
                ballObj.velocity.x * ballObj.velocity.x *
                ballObj.velocity.x / Math.abs(ballObj.velocity.x);
            
            Fy = -0.5 * Cd * A * rho * 
                ballObj.velocity.y * ballObj.velocity.y * 
                ballObj.velocity.y / Math.abs(ballObj.velocity.y);
            
            Fx = (isNaN(Fx) ? 0 : Fx);
            Fy = (isNaN(Fy) ? 0 : Fy);
            
            // Calculate acceleration (F / m)
            ax = Fx / ballObj.mass;
            ay = ag + (Fy / ballObj.mass); 
            
            // Integrate to get velocity (velocity is the time-derivative of acceleration)
            //ballObj.velocity.x += (ax * frameRate);
            ballObj.velocity.x += (ax * (1 / 60) );
            ballObj.velocity.y += (ay * (1 / 60) );
            
            // Integrate to get position (position is the velocity derivative) 
            //ballObj.position.x += (ballObj.velocity.x * frameRate * metersPerPixel);
            ballObj.position.x += (ballObj.velocity.x * (1 / 60) * metersPerPixel);
            ballObj.position.y += (ballObj.velocity.y * (1 / 60) * metersPerPixel);    
            
            ballObj.move();
        }
        
        // Handle collisions
        ballObj.handleWallCollisions();
        
        // Draw the slingshot
        if (Mouse.isDown) {
            Slingshot.extendLineOnPull(Mouse.x, Mouse.y);
        }                    
    }
            
    return {
        init: init
    };
    
} (window));


window.addEventListener('DOMContentLoaded', demo.init, false);