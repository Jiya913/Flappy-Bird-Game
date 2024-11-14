let board = document.getElementById("board");     
let context = board.getContext("2d"); 
board.height = 640;       
board.width = 360; 
let gameOver = false;  
let score = 0; 
let highscore = 0;


let birdWidth = 34;  
let birdHeight = 24;   
let birdX = board.width/8;  
let birdY = board.height/2;   

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let birdImg = new Image();         
birdImg.src = "./flappybird.png";     
birdImg.onload = function() {               
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);       
};              

let pipeArray = [];           
let pipeWidth = 64;      
let pipeHeight = 512;         
let pipeX = board.width;  
let pipeY = 0;    

let topPipeImg = new Image();          
topPipeImg.src = "./toppipe.png";      
let bottomPipeImg = new Image();        
bottomPipeImg.src = "./bottompipe.png";   

let velocityX = -2; 
let velocityY = 0;
let gravity = 0.4; 

window.onload = function() {
    requestAnimationFrame(update);  
    setInterval(placePipes, 1500); 
    document.addEventListener("keydown", moveBird);  
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;  
    }
    context.clearRect(0, 0, board.width, board.height);  

    velocityY += gravity;       
    bird.y = Math.max(bird.y + velocityY, 0); 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);   
    if (bird.y > board.height) {      
        gameOver = true;    
    }
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;     
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);    

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {  
            score += 0.5;
            if( score > highscore){     
                highscore = score;    
            }
            pipe.passed = true;   
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    context.fillStyle = "white";      
    context.font="45px sans-serif";        
    context.fillText(score, 5, 45);         
    context.fillText(highscore, 290, 45);  

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);  
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);   
    let openingSpace = board.height/4;   

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,  
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);   

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,   
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);      
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6; 
        if (gameOver) {
            bird.y = birdY;  
            pipeArray = [];      
            score = 0;        
            gameOver = false; 
        }
    }
}

function detectCollision(a, b) {  
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height && 
           a.y + a.height > b.y;    
}