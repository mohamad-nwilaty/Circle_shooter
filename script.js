const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth
const height = innerHeight
canvas.width = width;
canvas.height = height ;
let gameState = true ;
let score = 0 ;
let bestScore = localStorage.getItem("bestScore") || 0 ;
const enemyColors = ["blue", "grey" , "red" , "yellow" , "purple" , "green" , "deeppink" , "aqua" , "chartreuse"];
let bullets = [];
let enemies = [];
let particles = [];


class Player{
    constructor(){
        this.x = width/2 ;
        this.y = height / 2 ;
        this.radius = 20 ;
    }
    Draw(){
        ctx.beginPath();
        ctx.fillStyle = "ghostwhite" ;
        ctx.arc(this.x , this.y , this.radius , 0 , Math.PI *2 , false);
        ctx.fill()
        ctx.closePath();
    }
}
class Enemy{
    constructor(x , y , angle , radius){
        this.x = x ;
        this.y = y ;
        this.radius = radius ;
        this.angle = angle
        this.color = enemyColors[Math.floor(Math.random()*enemyColors.length)]
        this.speed =  1 / radius * 100; // Adjust the multiplier as needed
    }
    update(){
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
    }
    Draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color ;
        ctx.arc(this.x , this.y , this.radius , 0 , Math.PI *2 , false);
        ctx.fill()
        ctx.closePath();
        this.update();
    }
}
class Bullet{
    constructor(x , y ,angle){
        this.x = x ;
        this.y = y ;
        this.radius = 5 ;
        this.angle = angle ;
    }
    update(){
        this.x -= 4 * Math.cos(this.angle);
        this.y -= 4 * Math.sin(this.angle);
    }
    Draw(){
        ctx.beginPath();
        ctx.fillStyle = "white" ;
        ctx.arc(this.x , this.y , this.radius , 0 , Math.PI *2 , false);
        ctx.fill();
        ctx.closePath();
        this.update()
    }
}

class particle{
    constructor(x , y ,velocity , color){
        this.x = x ;
        this.y = y ;
        this.radius = Math.random() *2 ;
        this.velocity = velocity ;
        this.color = color;
        this.alpha = 1 ;
    }
    update(){
        this.x += 2 * this.velocity.x ;
        this.y += 2 * this.velocity.y ;
        this.alpha -= 0.01 ;
    }
    Draw(){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color ;
        ctx.arc(this.x , this.y , this.radius , 0 , Math.PI *2 , false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        this.update()
    }
}


const p = new Player();
spawnEnimies();
requestAnimationFrame(animate) ;

window.addEventListener("click" , (e)=>{
    if(!gameState){
        gameState = true ;
        bullets = [];
        enemies = [];
        particles = [] ;
        score = 0 ;
        requestAnimationFrame(animate)
    }
    const b = new Bullet(p.x, p.y , Math.atan2(p.y - e.offsetY ,p.x - e.offsetX));
    bullets.push(b);
})

function clearCanvas(){
    ctx.clearRect(0,0,width,height);
}
function animate(){
    drawBackground()
    for(let i=0 ; i<bullets.length ; i++){
        bullets[i].Draw();
        if(bulletCollisionWEnemy(bullets[i])){
            bullets.splice(i ,1);
            break;
        }
        if(checkOutofBounds(bullets[i])){
            bullets.splice(i ,1);
            i-- ;
        }
    }
    for(let i = 0 ; i < enemies.length ; i++){
        enemies[i].Draw();
    }

    particles.forEach(( p , index) =>{
        if(p.alpha < 0){
            particles.splice(index , 1)
        }
        else{
            p.Draw() ;
        }
        
    })

    p.Draw();
    drawScore()
    checkGameOver();

    console.log(particles.length)

    if(gameState){
        requestAnimationFrame(animate) 
    }
}
function checkOutofBounds(b){
    if(b.x + b.radius < 0 || b.x + b.radius > width){
        score -= 200 ;
        return true ;
    }
    if(b.y + b.radius< 0 || b.y + b.radius > height){
        score -= 200 ;
        return true ;
    }
    return false ;
}

function spawnEnimies(){
    setInterval(()=>{
        let x ;
        let y ;
        let randius = Math.floor(Math.random() * 10) + 25
        if(Math.random() > 0.5){
            x = Math.random() > 0.5 ? 0 - randius : width + randius ;
            y = Math.random() * height ;
        } 
        else{
            x = Math.random() * width ;
            y = Math.random() > 0.5 ? 0 -randius : height + randius ;
        }
        let angle = Math.atan2(p.y - y , p.x - x);
        let e =  new Enemy(x,y,angle , randius);
        enemies.push(e);
    
    } ,500)
}
function bulletCollisionWEnemy(b){
    
    for(let i=0 ; i<enemies.length ; i++){
        if(b.x < enemies[i].x + enemies[i].radius && b.x > enemies[i].x - enemies[i].radius  ){
            if(b.y < enemies[i].y + enemies[i].radius && b.y > enemies[i].y - enemies[i].radius){
                // spawn particles for dying enemies
                for(let j=0 ; j<enemies[i].radius *2 ; j++){
                    particles.push(new particle(enemies[i].x , enemies[i].y , {x:Math.random() - 0.5 , y:Math.random() - 0.5} ,enemies[i].color))
                }
                enemies.splice(i,1);
                score += 100;
                return true ;
            }
        }
    }
    return false ;
}
function checkGameOver() {
    for (let i = 0; i < enemies.length; i++) {
        // Calculate the distance between the player and the enemy
        const distX = enemies[i].x - p.x;
        const distY = enemies[i].y - p.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Check if the distance is less than the sum of the radii (collision)
        if (distance < enemies[i].radius + p.radius) {
            // Collision detected, game over
            gameState = false;
            console.log("Game Over");
            deathscreen()
            break;
        }
    }
}
function drawBackground(){
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.15)" ;
    ctx.fillRect(0,0,width,height);
    ctx.closePath();
}
function drawScore(){
    ctx.font = "36px pixel-font";
    ctx.fillStyle = "white" ;
    ctx.fillText(score , 50 ,50 )
}
function deathscreen(){
    if(score > bestScore){
        bestScore = score;
        localStorage.setItem("bestScore" , bestScore);
    }
    ctx.font = "60px pixel-font";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(`score: ${score}` , width/2 , height/2 -70);
    ctx.fillText(`best score: ${bestScore}` , width/2 , height/2 );
    ctx.fillText("click to restart" , width/2 , height/2 +70 );
}
