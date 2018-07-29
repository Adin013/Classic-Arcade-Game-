// defining the position of a Beetle
var Beetle = function(x, y, velocity) {
   
    
    if (velocity > 0) {
        this.sprite = 'images/enemy-bug.png';
    } else {
        this.sprite = 'images/enemy-bug-flip.png';
    } 

    // Initial locations of Beetle;
    this.x = x;
    this.y = y;

    // Set the velocity of the Beetles;
    this.velocity = velocity;
};


// Update the Beetle's position with dt
Beetle.prototype.update = function(dt) {
    
    if (this.velocity > 0) {

         if (this.x > 505) {
         this.x = -101; 
         } else {
            this.x += (dt * this.velocity);
         }   
    } else {
        if (this.x < -101) {
         this.x = 505; 
         } else {
            this.x += (dt * this.velocity);
        }
    }

    meetX = false;
    meetY = false ;

    if (player.x < this.x + 65 && player.x > this.x - 65) {meetX = true;} 
    if (player.y === this.y + 7) {meetY = true;}

    if (meetX && meetY) {
        player.die();
    }
};


Beetle.prototype.changevelocity = function() {
    
    let direction = Math.floor(Math.random() - 0.5);
    if (direction > 0) {
         this.velocity *= 1.25; 
         } else 
         { this.velocity *= -1.25;
    }
    
    if (this.velocity > 0) {
         this.sprite = 'images/enemy-bug.png'; 
         } else 
         { this.sprite = 'images/enemy-bug-flip.png';
    }

}

// Draw the Beetle
Beetle.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


const Player = function(x, y) {
   
    this.sprite = 'images/char-boy.png';

    this.x = x;
    this.y = y;

    this.lives = 5;
    this.score = 0;

    // Score reward per each watercross
    this.amount = 20;

    // Check if the player is active.
    this.isActive = true;

    // Check if player died
    this.hasDied = false;
}


Player.prototype.update = function() {
    this.updateScore();
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Draw a red screen when player dies.
    if (this.hasDied) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(0, 50, 505, 535);
        ctx.restore();
        // Clear the red screen after 50ms.
        setTimeout(() => this.hasDied = false, 50);
    }
}


Player.prototype.handleInput = function(allowedKeyes) {
    switch (allowedKeyes) {
        case 'up':
            if (this.y < 0) {
            this.y = this.y; 
            } else { 
                this.y -= 83;
            }
            break;
        case 'down':
            if (this.y > 400) {
            this.y = this.y; 
            } else { 
                this.y += 83;
            }
            break;
        case 'right':
            if (this.x > 400) {
            this.x = this.x; 
            } else { 
                this.x += 100;
            }
            break;
        case 'left':
            if (this.x < 101) {
            this.x = this.x; 
            } else { 
                this.x -= 101;
            }
            break;
    }
}

// what happens when a collision happens with enemies.
Player.prototype.die = function() {
    // Player loses one live.
    this.lives--;
    // scoreboard updates
    scoreboard.update();

    // Return player to starting position.
    this.x = 202;
    this.y = 321;

    // Set hasDied to true to draw a red screen
    this.hasDied = true;

    if (this.lives === 0) {
        // Make player unable to move.
        this.isActive = false;

        // Show the game over screen.
        dialog.type = 'gameOver';
        dialog.isActive = true;
        
    }
}

// Update player's score based on his location.
// Also change the enemies velocity and direction when the score gets high enough.
Player.prototype.updateScore = function() {
    let timer;
    // If player gets to the water.
    if (this.y === -11) {
        // Check when score get higher and increase the amount.
        if (this.score > this.amount * 4) {
            this.amount += Math.floor(this.amount / 2);

            // Change enemies velocity and direction.
            allEnemies.forEach(Beetle => Beetle.changevelocity());
        }

        // player's score will increase
        this.score += this.amount;

        // Set player unable to move
        this.isActive = false;


        // Return player to starting position.
        timer = setTimeout(() => {
            this.x = 202;
            this.y = 321;

            this.isActive = true;

            clearTimeout(timer);
        }, 100);

        // Increase player's horizontal position to avoid score bug increase.
        this.y++;

        // Update scoreboard.
        scoreboard.update();
    }
}

// This is a function to make the player start playing.
Player.prototype.start = function() {
    // having no more lives then player's stat resets before starting.
    if (this.lives <= 0) {
        this.lives = 5;
        this.score = 0;
        this.amount = 20;

        // Update the scoreboard
        scoreboard.update();
        // Change enemies velocity
        allEnemies.forEach(function(Beetle) {
            Beetle.velocity = (Math.random() * (2-1) + 1) * 101;
            // Change enemies sprite.
            if (Beetle.velocity > 0) {
                Beetle.sprite = 'images/enemy-bug.png'; 
            } else { 
                Beetle.sprite = 'images/enemy-bug-flip.png';
            }
        });
    }



    // player starts playing.
    this.isActive = true;

}



// Scoreboard object
const Scoreboard = function() {
    // Get player's score.
    this.score = player.score.toString();
    // Create player's lives shapes.
    this.lives = '😶😶😶😶😶';
    this.livesSymbol = '😶'
}

Scoreboard.prototype.update = function() {
    // Clear on screen lives.
    this.lives = '';
    // Add lives symbol on screen based on player's lives.
    for (let k = player.lives; k > 0; k--) {
        this.lives += this.livesSymbol;
    }

    // Score update.
    this.score = player.score.toString();
}

Scoreboard.prototype.render = function() {
    // Set font to display the score into text.
    ctx.font = 'bold 25px courier';
    ctx.textAlign = 'start';
    ctx.fillText(`Score: ${this.score}`, 0, 40);

    // Align lives shapes to the right.
    ctx.textAlign = 'right';
    ctx.fillText(this.lives, 505, 575);
}


const Dialog = function(type) {
    // Make the dialog active.
    this.isActive = true;

    // Set the screen type: starting or gameOver.
    this.type = type;

    // Dialog's background and location.
    this.background = 'images/background.png';
    this.x = 0;
    this.y = 0;

    // Set current player sprite.
    this.sprite = player.sprite;

    // An array with all player's sprites.
    this.allSprites = [
        'images/char-boy.png'
    ];


    // Set text locaction in center of canvas.
    this.text_x = 252;
}




Dialog.prototype.render = function() {
    
    // Draw all text in center aligment
    ctx.textAlign = 'center';

    // Check gameover commands
    switch (this.type) {
        

        case 'gameOver':
            // Draw game-over title.
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.font = 'bold 70px courier';
            ctx.fillText('Game Over', this.text_x, 252);
            ctx.restore();

            // Draw score accomplished.
            ctx.fillText(`Score: ${scoreboard.score}`, this.text_x, 287);

            // if you want an automatic restart of the game use activate the following line
            //window.location.reload();
    }
}



// Handle input function for the dialog
Dialog.prototype.handleInput = function(keyType) {
    this.isActive = false;
    player.start();
}


function checkCollisions(obj1, obj2_x, obj2_y, max_x = 0, max_y = 0) {
   
    let checkY = obj1.y - 2 > obj2_y && obj1.y < obj2_y + max_y;

    
    let checkX = obj1.x - 2 > obj2_x && obj1.x < obj2_x + max_x;
    return checkX && checkY;
}

const allEnemies = [];

// Create 3 new enemies in each row.
(function() {
    let BeetleY = -18,
        startingX = 0,
        velocity = 101;
    for (let x = 3; x > 0; x--) {
        let newBeetle = new Beetle(startingX, BeetleY += 83, (Math.random() * (3-1) + 1) * velocity);

        switch (x) {
            case 3:
                startingX = 504;
                velocity *= -1;
                break;
            case 2:
                startingX = 0;
                velocity *= -1;
        }

        allEnemies.push(newBeetle);
    }
})();

const player = new Player(202, 321);

const scoreboard = new Scoreboard();

const dialog = new Dialog('starting');


// allowed keys to press
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    // it will check if the player is permitted to move
    if (player.isActive) {
        e.preventDefault();
        player.handleInput(allowedKeys[e.keyCode]);
    }

    
});



