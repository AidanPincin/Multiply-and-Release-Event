const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let green = 0
let red = 0
let squareSize = 10
let accuracy = 20
let coolDown = 60
class Marble{
    constructor(x,y,r,mass,color,vx,vy,gravity=true){
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.r = r
        this.color = color
        this.mass = mass
        this.gravity=gravity
    }
    math(){
        const list = marbles.filter(m => (m.gravity == true || this.gravity==true) && Math.sqrt(Math.pow(m.x-this.x,2)+Math.pow(m.y-this.y,2))<150)
        for(let i=0; i<accuracy; i++){
            for(let k=0; k<list.length; k++){
                if(this != list[k]){
                    const m1 = this
                    const m2 = list[k]
                    const x_dist = m2.x-m1.x
                    const y_dist = m2.y-m1.y
                    const collisionDist = m2.r+m1.r
                    const dist = Math.sqrt(Math.pow(x_dist,2)+Math.pow(y_dist,2))
                    if(dist<collisionDist){
                        const dx = x_dist/dist
                        const dy = y_dist/dist
                        const vx = m1.vx-m2.vx
                        const vy = m1.vy-m2.vy
                        const speed = (vx*dx+vy*dy)*0.9
                        const impulse = 2*speed/(m1.mass+m2.mass)
                        m1.vx -= impulse*m2.mass*dx
                        m1.vy -= impulse*m2.mass*dy
                        m2.vx += impulse*m1.mass*dx
                        m2.vy += impulse*m1.mass*dy
                        const dif = dist-collisionDist
                        m1.x+=dx*dif*(m2.mass/(m1.mass+m2.mass))
                        m1.y+=dy*dif*(m2.mass/(m1.mass+m2.mass))
                        m2.x-=dx*dif*(m1.mass/(m1.mass+m2.mass))
                        m2.y-=dy*dif*(m1.mass/(m1.mass+m2.mass))
                    }
                }
            }
            if(this.gravity==true){
                if(this.x<110+this.r && this.x>90+this.r && this.y<750){
                    this.vx = Math.abs(this.vx)*0.925
                    this.x = 110+this.r
                }
                if(this.x<this.r){
                    this.vx = Math.abs(this.vx)*0.925
                    this.x = this.r
                }
                if(this.x>90-this.r && this.x<110+this.r && this.y>50+this.r){
                    this.vx = -Math.abs(this.vx)*0.925
                    this.x = 90-this.r
                }
                if(this.x>90-this.r && this.x<110+this.r && this.y<50-this.r){
                    this.x = 320
                    this.vx = Math.random()*5-2.5
                    this.vy = Math.random()*5-2.5
                }
                if(this.x<90-this.r && this.x>this.r && this.vy>-5){
                    this.vy -= 0.2/accuracy
                }
                if(this.y<50+this.r && this.x>this.r && this.x<90-this.r){
                    this.vx += 0.05/accuracy
                }
                if(this.x>530-this.r){
                    this.vx = -Math.abs(this.vx)*0.925
                    this.x = 530-this.r
                }
                if(this.y<this.r){
                    this.vy = Math.abs(this.vy)*0.5
                    this.y = this.r
                }
                if(this.y>750 && this.x>110){
                    this.vx -= 0.05/accuracy
                }
                if(this.y>800-this.r){
                    this.vy = -Math.abs(this.vy)*0.5
                    this.y = 800-this.r
                }
                if(this.y>730-this.r && this.x>110+this.r && this.y<740+this.r){
                    if(this.x<330){
                        towers.find(t => t.color == this.color).size *= 2
                    }
                    else{
                        towers.find(t => t.color == this.color).release()
                    }
                    this.y = 750+this.r
                }
                this.vy += 0.1/accuracy
                if(this.y<750+this.r && this.x>110+this.r && this.y>730-this.r){
                    this.vy = Math.abs(this.vy)
                    this.y = 750+this.r
                }
            }
            this.x += this.vx/accuracy
            this.y += this.vy/accuracy
        }
        this.vx *= 0.999
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}
class Bullet{
    constructor(x,y,vx,vy,color,mass){
        this.x = x
        this.y = y
        this.vx = vx/Math.sqrt(Math.sqrt(mass))
        this.vy = vy/Math.sqrt(Math.sqrt(mass))
        this.color = color
        this.mass = mass
        this.size = 7+Math.sqrt(Math.sqrt(Math.pow(this.mass,1.5)))
        this.detect = true
    }
    math(){
        this.size = 7+Math.sqrt(Math.sqrt(Math.pow(this.mass,1.5)))
        if(this.x<600+this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)>squares[i].x && this.x-this.size-Math.abs(this.vx)<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)>squares[i].y && this.y-this.size-Math.abs(this.vy)<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.x = 1400-this.size
        }
        if(this.x>1400-this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)>squares[i].x && this.x-this.size-Math.abs(this.vx)<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)>squares[i].y && this.y-this.size-Math.abs(this.vy)<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.x = 600+this.size
        }
        if(this.y<this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)>squares[i].x && this.x-this.size-Math.abs(this.vx)<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)>squares[i].y && this.y-this.size-Math.abs(this.vy)<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.y = 800-this.size
        }
        if(this.y>800-this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)>squares[i].x && this.x-this.size-Math.abs(this.vx)<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)>squares[i].y && this.y-this.size-Math.abs(this.vy)<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.y = this.size
        }
        if(this.detect == true){
            const c = []
            for(let i=0; i<squares.length; i++){
                if(c.find(co => co == squares[i].color) == undefined){
                    c.push(squares[i].color)
                }
                if(this.x+this.size+Math.abs(this.vx)>squares[i].x && this.x-this.size-Math.abs(this.vx)<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)>squares[i].y && this.y-this.size-Math.abs(this.vy)<squares[i].y+squareSize){
                    if(squares[i].color != this.color && this.mass>0){
                        this.mass -= 1
                        squares[i].color = this.color
                        if(this.mass == 0){
                            bullets.splice(bullets.findIndex(b => b == this),1)
                        }
                    }
                    squares[i].draw()
                }
            }
            if(c.length==1){
                this.detect = false
            }
        }
        if(towers.length>1){
            for(let i=0; i<towers.length; i++){
                const t = towers[i]
                const x_dist = t.x-this.x
                const y_dist = t.y-this.y
                const collisionDist = this.size+t.s
                const dist = Math.sqrt(Math.pow(x_dist,2)+Math.pow(y_dist,2))
                if(dist<collisionDist && this.color != towers[i].color){
                    let s = t.size
                    t.size -= this.mass
                    this.mass -= s
                    if(t.size<0){
                        colors.splice(colors.findIndex(c => c == t.color),1)
                        let ms = marbles.filter(m => m.color == t.color && m.mass == 1)
                        for(let i=0; i<ms.length; i++){
                            marbles.splice(marbles.findIndex(ma => ma == ms[i]),1)
                        }
                        towers.splice(towers.findIndex(to => to == t),1)
                    }
                    if(this.mass<=0){
                        bullets.splice(bullets.findIndex(b => b == this),1)
                    }
                }
            }
        }
        for(let k=0; k<accuracy; k++){
            for(let i=0; i<bullets.length; i++){
                if(bullets[i] != this){
                    const b1 = this
                    const b2 = bullets[i]
                    const x_dist = b2.x - b1.x
                    const y_dist = b2.y - b1.y
                    const collisionDist = b1.size+b2.size
                    const dist = Math.sqrt(Math.pow(x_dist,2)+Math.pow(y_dist,2))
                    if(dist<collisionDist){
                        const dx = x_dist/dist
                        const dy = y_dist/dist
                        const vx = b1.vx - b2.vx
                        const vy = b1.vy - b2.vy
                        const speed = vx*dx+vy*dy
                        const impulse = 2*speed/(b1.mass+b2.mass)
                        b1.vx -= impulse*b2.mass*dx
                        b1.vy -= impulse*b2.mass*dy
                        b2.vx += impulse*b1.mass*dx
                        const dif = dist-collisionDist
                        b1.x+=dx*dif*(b2.mass/(b1.mass+b2.mass))
                        b1.y+=dy*dif*(b2.mass/(b1.mass+b2.mass))
                        b2.x-=dx*dif*(b1.mass/(b1.mass+b2.mass))
                        b2.y-=dy*dif*(b1.mass/(b1.mass+b2.mass))
                    }
                }
            }
            this.x += this.vx/accuracy
            this.y += this.vy/accuracy
        }
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false)
        ctx.fill()
        if(this.color == 'black'){
            ctx.strokeStyle = '#ffffff'
        }
        else{
            ctx.strokeStyle = '#000000'
        }
        ctx.lineWidth = 1
        ctx.stroke()
        if(this.color == 'black'){
            ctx.fillStyle = '#ffffff'
        }
        else{
            ctx.fillStyle = '#000000'
        }
        ctx.font = '16px Arial'
        const width = ctx.measureText(this.mass).width
        ctx.fillText(this.mass,this.x-width/2,this.y+16/3)
    }
}
class Square{
    constructor(x,y,color){
        this.x = x
        this.y = y
        this.color = color
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y,squareSize,squareSize)
    }
}
class Tower{
    constructor(x,y,color){
        this.x = x
        this.y = y
        this.color = color
        this.angle = Math.random()*Math.PI*2
        this.size = 1
        this.s = 7+Math.sqrt(Math.sqrt(Math.pow(this.size,1.5)))
    }
    math(){
        this.s = 7+Math.sqrt(Math.sqrt(Math.pow(this.size,1.5)))
        if(this.angle>Math.PI*2){
            this.angle = 0
        }
        else{
            this.angle += Math.PI/500
        }
        let r = this.s+29+Math.sqrt(Math.sqrt(Math.pow(this.size,1.75)))
        for(let i=0; i<squares.length; i++){
            if (this.x+r>squares[i].x && this.x-r<squares[i].x+squareSize && this.y+r>squares[i].y && this.y-r<squares[i].y+squareSize){
                squares[i].draw()
            }
        }
    }
    release(){
        const x = Math.cos(this.angle)*34
        const y = Math.sin(this.angle)*34
        const vx = Math.cos(this.angle)*5
        const vy = Math.sin(this.angle)*5
        bullets.push(new Bullet(this.x+x,this.y+y,vx,vy,this.color,this.size))
        this.size = 1
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.s,0,Math.PI*2,false)
        ctx.fill()
        ctx.lineWidth = 2
        if(this.color == 'black'){
            ctx.strokeStyle = '#ffffff'
        }
        else{
            ctx.strokeStyle = '#000000'
        }
        ctx.stroke()
        ctx.save()
        ctx.translate(this.x,this.y)
        ctx.fillStyle = this.color
        ctx.rotate(this.angle)
        ctx.fillRect(0,-5,29+Math.sqrt(Math.sqrt(Math.pow(this.size,1.75))),9+Math.sqrt(Math.sqrt(this.size)))
        ctx.strokeRect(0,-5,29+Math.sqrt(Math.sqrt(Math.pow(this.size,1.75))),9+Math.sqrt(Math.sqrt(this.size)))
        ctx.restore()
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.s-2,0,Math.PI*2,false)
        ctx.fill()
        if(this.color == 'black'){
            ctx.fillStyle = '#ffffff'
        }
        else{
            ctx.fillStyle = '#000000'
        }
        ctx.font = '16px Arial'
        const width = ctx.measureText(this.size).width
        ctx.fillText(this.size,this.x-width/2,this.y+16/3)
    }
}
const colors = ['green','purple','red','yellow','pink','blue','turquoise','black','grey','orange','brown','violet','#00ff00','#7d0000','#00007d','#7d7d00']
const marbles = []
const squares = []
const towers = []
const bullets = []
let fps = 0
let t = 0
let time = 0
for(let i=0; i<16; i++){
    let row = i
    let col = 0
    while(row>3){
        col += 1
        row -= 4
    }
    towers.push(new Tower(700+col*200,100+row*200,colors[i]))
}
for(let i=0; i<16; i++){
    for(let x=0; x<200/squareSize; x++){
        for(let y=0; y<200/squareSize; y++){
            let row = i
            let col = 0
            while(row>3){
                row -= 4
                col += 1
            }
            squares.push(new Square(600+col*200+x*squareSize,row*200+y*squareSize,colors[i]))
        }
    }
}
const infinity = 999999999999999
for (let i=0; i<16; i++){
    marbles.push(new Marble(320+i,10,8,1,colors[i],Math.random()*5-2.5,Math.random()*5-2.5))
}
for(let i=0; i<6; i++){
    for(let k=0; k<4; k++){
        if(i!=5){
            marbles.push(new Marble(160+i*80,100+k*160,20,infinity,'#000000',0,0,false))
        }
        marbles.push(new Marble(120+i*80,180+k*160,20,infinity,'#000000',0,0,false))
    }
}
function doMath(){
    t += 1
    if(t/60 >= coolDown){
        t = 0
        for (let i=0; i<colors.length; i++){
             marbles.push(new Marble(320+i,10,8,1,colors[i],Math.random()*5-2.5,Math.random()*5-2.5))
        }
    }
    for(let i=0; i<marbles.length; i++){
        marbles[i].math()
    }
    for(let i=0; i<towers.length; i++){
        towers[i].math()
    }
    for(let i=0; i<bullets.length; i++){
        bullets[i].math()
    }
}
let fastforward = false
function mainLoop(){
    doMath()
    T+=1
    if(fastforward == true){
        fastForward()
    }
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,600,800)
    ctx.fillStyle = '#000000'
    ctx.fillRect(90,0,20,800)
    ctx.fillRect(530,0,20,800)
    ctx.fillStyle = '#00ff00'
    ctx.fillRect(110,730,210,20)
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(320,730,210,20)
    for(let i=0; i<marbles.length; i++){
        marbles[i].draw()
    }
    for(let i=0; i<towers.length; i++){
        towers[i].draw()
    }
    for(let i=0; i<bullets.length; i++){
        bullets[i].draw()
    }
    ctx.font = '24px Arial'
    ctx.fillStyle = '#000000'
    ctx.fillText(fps,50,50)
    requestAnimationFrame(mainLoop)
}
let T = 0
for(let i=0; i<squares.length; i++){
    squares[i].draw()
}
mainLoop()
setInterval(() => {
    fps = T
    T = 0
},1000)
function fastForward(){
    for(let i=0; i<600; i++){
        doMath()
    }
    fastforward = false
}
window.addEventListener('keypress',function(e){
    if(e.key == 'f' && fastforward == false){
        fastforward = true
    }
})
