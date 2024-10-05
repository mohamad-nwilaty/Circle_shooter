const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth
const height = innerHeight
canvas.width = width;
canvas.height = height ;
let gameState = true ;
const enemyColors = ["black", "lightgrey" , "red" , "yellow" , "purple" , "green" , "pink"];
let bullets = [];
let enemies = [];



class Player{
    constructor(){
        this.x = width/2 ;
        this.y = height / 2 ;
        this.radius = 30 ;
    }
    Draw(){
        ctx.beginPath();
        ctx.fillStyle = "blue" ;
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
    }
    update(){
        this.x += 2 * Math.cos(this.angle);
        this.y += 2 * Math.sin(this.angle);
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
    constructor(w , h ,angle){
        this.x = w ;
        this.y = h ;
        this.radius = 5 ;
        this.angle = angle ;
    }
    update(){
        this.x -= 4 * Math.cos(this.angle);
        this.y -= 4 * Math.sin(this.angle);
    }
    Draw(){
        ctx.beginPath();
        ctx.fillStyle = "red" ;
        ctx.arc(this.x , this.y , this.radius , 0 , Math.PI *2 , false);
        ctx.fill();
        ctx.closePath();
        this.update()
    }
    
}

const p = new Player();
spawnEnimies();
requestAnimationFrame(animate) ;

window.addEventListener("click" , (e)=>{
    const b = new Bullet(p.x, p.y , Math.atan2(p.y - e.offsetY ,p.x - e.offsetX));
    bullets.push(b);
})

function clearCanvas(){
    ctx.clearRect(0,0,width,height);
}
function animate(){
    clearCanvas();
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
    p.Draw();

    checkGameOver();

    
    console.log(enemies.length , bullets.length);
    if(gameState)[
        requestAnimationFrame(animate) 
    ]
}
function checkOutofBounds(b){
    if(b.x + b.radius < 0 || b.x + b.radius > width){
        return true ;
    }
    if(b.y + b.radius< 0 || b.y + b.radius > height){
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
                enemies.splice(i,1);
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
            break;
        }
    }
}