const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let green = 0
let red = 0
let squareSize = 10
let accuracy = 20
let coolDown = 120
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
                    if(this.x<320){
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
    }
    math(){
        this.size = 7+Math.sqrt(Math.sqrt(Math.pow(this.mass,1.5)))
        if(this.x<600+this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)+3>squares[i].x && this.x-this.size-Math.abs(this.vx)-3<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)+3>squares[i].y && this.y-this.size-Math.abs(this.vy)-3<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.x = 1400-this.size
        }
        if(this.x>1400-this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)+3>squares[i].x && this.x-this.size-Math.abs(this.vx)-3<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)+3>squares[i].y && this.y-this.size-Math.abs(this.vy)-3<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.x = 600+this.size
        }
        if(this.y<this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)+3>squares[i].x && this.x-this.size-Math.abs(this.vx)-3<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)+3>squares[i].y && this.y-this.size-Math.abs(this.vy)-3<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.y = 800-this.size
        }
        if(this.y>800-this.size){
            for(let i=0; i<squares.length; i++){
                if(this.x+this.size+Math.abs(this.vx)+3>squares[i].x && this.x-this.size-Math.abs(this.vx)-3<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)+3>squares[i].y && this.y-this.size-Math.abs(this.vy)-3<squares[i].y+squareSize){
                    squares[i].draw()
                }
            }
            this.y = this.size
        }
        for(let i=0; i<squares.length; i++){
            if(this.x+this.size+Math.abs(this.vx)+3>squares[i].x && this.x-this.size-Math.abs(this.vx)-3<squares[i].x+squareSize && this.y+this.size+Math.abs(this.vy)+3>squares[i].y && this.y-this.size-Math.abs(this.vy)-3<squares[i].y+squareSize){
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
class Slider{
    constructor(x,y,min,max,length,name,description,num){
        this.x = x
        this.y = y
        this.min = min
        this.max = max
        this.length = length
        this.drag = false
        this.num = num
        this.name = name
        this.description = description
    }
    draw(){
        ctx.beginPath()
        ctx.save()
        ctx.translate(this.x,this.y+10)
        ctx.rotate(Math.PI/2)
        ctx.arc(0,0,10,0,Math.PI,false)
        ctx.restore()
        ctx.stroke()
        ctx.beginPath()
        ctx.save()
        ctx.translate(this.x+this.length,this.y+10)
        ctx.rotate(Math.PI*1.5)
        ctx.arc(0,0,10,0,Math.PI,false)
        ctx.restore()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(this.x,this.y)
        ctx.lineTo(this.x+this.length,this.y)
        ctx.moveTo(this.x,this.y+20)
        ctx.lineTo(this.x+this.length,this.y+20)
        ctx.stroke()
        ctx.fillStyle = '#000000'
        ctx.font = '24px Arial'
        let width = ctx.measureText(this.min).width
        ctx.fillText(this.min,this.x-width-15,this.y+18)
        ctx.fillText(this.max,this.x+this.length+15,this.y+18)
        const x = this.x+((this.num-this.min)/(this.max-this.min))*this.length
        ctx.beginPath()
        ctx.arc(x,this.y+10,10,0,Math.PI*2,false)
        ctx.fillStyle = '#7d7d7d'
        ctx.fill()
        ctx.fillStyle = '#000000'
        width = ctx.measureText(this.num).width
        ctx.fillText(this.num,x-width/2,this.y+44)
        width = ctx.measureText(this.name).width
        ctx.fillText(this.name,this.x+this.length/2-width/2,this.y-70)
        ctx.font = '16px Arial'
        let index = this.description.search('\n')
        if(index != -1){
            width = ctx.measureText(this.description.slice(0,index)).width
            ctx.fillText(this.description.slice(0,index),this.x+this.length/2-width/2,this.y-45)
            width = ctx.measureText(this.description.slice(index,this.description.length)).width
            ctx.fillText(this.description.slice(index,this.description.length),this.x+this.length/2-width/2,this.y-25)
        }
        else{
            width = ctx.measureText(this.description).width
            ctx.fillText(this.description,this.x+this.length/2-width/2,this.y-35)
        }
    }
    onDown(e){
        let x = 0
        let y = 0
        if(e.type == 'mousedown'){
            x = e.pageX-10
            y = e.pageY-10
        }
        if(e.type == 'touchstart'){
            x = e.changedTouches[0].pageX-10
            y = e.changedTouches[0].pageY-10
        }
        if(y>=this.y-5 && y<=this.y+25 && x>=this.x-10 && x<=this.x+this.length+10){
            const num = Math.round(this.min+((x-this.x)/this.length)*(this.max-this.min))
            if(num<this.min){
                this.num = this.min
            }
            else if(num>this.max){
                this.num = this.max
            }
            else{
                this.num = num
            }
            this.drag = true
        }
    }
    onMove(e){
        if(this.drag == true){
            let x = 0
            let y = 0
            if(e.type == 'mousemove'){
                x = e.pageX-10
                y = e.pageY-10
            }
            if(e.type == 'touchmove'){
                x = e.changedTouches[0].pageX-10
                y = e.changedTouches[0].pageY-10
            }
            if(y>=this.y-5 && y<=this.y+25 && x>=this.x-10 && x<=this.x+this.length+10){
                const num = Math.round(this.min+((x-this.x)/this.length)*(this.max-this.min))
                if(num<this.min){
                    this.num = this.min
                }
                else if(num>this.max){
                    this.num = this.max
                }
                else{
                    this.num = num
                }
            }
        }
    }
}
class Button{
    constructor(x,y,txt,fn){
        this.x = x
        this.y = y
        this.txt = txt
        this.fn = fn
    }
    draw(){
        ctx.fillStyle = '#0000ff'
        ctx.fillRect(this.x,this.y,125,40)
        ctx.font = '24px Arial'
        ctx.fillStyle = '#000000'
        const width = ctx.measureText(this.txt).width
        ctx.fillText(this.txt,this.x+62.5-width/2,this.y+28)
    }
    wasClicked(e){
        let x = 0
        let y = 0
        if(e.type == 'mousedown'){
            x = e.pageX-10
            y = e.pageY-10
        }
        if(e.type == 'touchstart'){
            x = e.changedTouches[0].pageX-10
            y = e.changedTouches[0].pageY-10
        }
        if(x>=this.x && x<=this.x+125 && y>=this.y && y<=this.y+40){
            this.fn()
        }

    }
}
const colors = ['green','purple','red','yellow','pink','blue','turquoise','black','grey','orange','brown','violet','#00ff00','#7d0000','#00007d','#7d7d00']
const constantColors = ['green','purple','red','yellow','pink','blue','turquoise','black','grey','orange','brown','violet','#00ff00','#7d0000','#00007d','#7d7d00']
const sliders = [new Slider(600,200,15,180,200,'Cooldown(in seconds)','Interval at which more marbles\nare added to the dropper',120)]
const startButton = new Button(650,650,'START',function(){
    settings = false
    for(let i=0; i<squares.length; i++){
        squares[i].draw()
    }
    coolDown = sliders[0].num
})
const marbles = []
const squares = []
const towers = []
const bullets = []
let fps = 0
let t = 0
let time = 0
let settings = true
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
function up(){
    if(settings == true){
        for(let i=0; i<sliders.length; i++){
            sliders[i].drag = false
        }
    }
}
function down(e){
    if(settings == true){
        sliders.filter(s => s.onDown(e))
        startButton.wasClicked(e)
    }
}
function move(e){
    if(settings == true){
        sliders.filter(s => s.onMove(e))
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
function mainLoop(){
    if(settings == true){
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0,0,1500,800)
        for(let i=0; i<sliders.length; i++){
            sliders[i].draw()
        }
        startButton.draw()
    }
    else{
        doMath()
        T+=1
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0,0,600,800)
        ctx.fillRect(1400,0,200,800)
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
        for(let i=0; i<constantColors.length; i++){
            let txt = (squares.filter(s => s.color == constantColors[i]).length/squares.length*100).toFixed(2)
            ctx.fillStyle = constantColors[i]
            ctx.fillText(txt+'%',1425,50+40*i)
        }
    }
    requestAnimationFrame(mainLoop)
}
let T = 0
mainLoop()
setInterval(() => {
    fps = T
    T = 0
},1000)
window.addEventListener('mousedown',function(e){down(e)})
window.addEventListener('mousemove',function(e){move(e)})
window.addEventListener('mouseup',function(){up()})
window.addEventListener('touchstart',function(e){down(e)})
window.addEventListener('touchmove',function(e){move(e)})
window.addEventListener('touchend',function(){up()})
