/* Engine.js
 * In the Engine file we define render and other functions
 */

var Engine = (function(global) {
    // Predefinition of variables
    
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* The main function which calls defined functions step by step.
     */
    function main() {
        /* defining delta time to be dependant on every body's computer!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        // Calling update and render functions
        
        update(dt);
        render();

        // Set our lastTime variable which is used to determine the time delta
         
        lastTime = now;

        // Using browser's requestAnimationFrame function
        win.requestAnimationFrame(main);
    }

    // initial setup
    
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    // update entity's data

    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    // UpdateEntities
    
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    // rendering function
    
    function render() {
    
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // looping
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                // The drawImage function of the canvas' context element
                 
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    // calling render functions 
     
    function renderEntities() {
        
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        
        if (dialog.isActive) {
            dialog.render();
        
    
            player.render();

            
            scoreboard.render();
        }
    }

    
    function reset() {
        // noop
    }

    // images needed

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-bug-flip.png',
        'images/background.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    
    global.ctx = ctx;
    global.canvas = canvas;
})(this);
