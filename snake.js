//TIMEOUT FUNCTION TO ENSURE HTML LOAD BEFORE
window.setTimeout(function(){
    //SIZE DEFINITIONS
    var scale=20;
    var cs;
    var width;
    var height;
    var rows;
    var cols;    
    var resize = ()=>{
        var img = document.getElementById("playingRegion");
        var canvas = getComputedStyle(img);
        width = parseInt(canvas.getPropertyValue('width'),10);
        height = parseInt(canvas.getPropertyValue('height'),10);        
        width = Math.floor(width/scale)*scale;
        height = Math.floor(height/scale)*scale;        
        cs = document.getElementById("playingArea");
        //CHECKING WHETHER THERE ACTUALLY HAS BEEN SOME CHANGE
        if(width!==cs.width || height!==cs.height){
            cs.width = width;
            cs.height = height;        
            rows = cs.height/scale;
            cols = cs.width/scale;
            return true;
        }        
        cs.width = width;
        cs.height = height;        
        rows = cs.height/scale;
        cols = cs.width/scale;
        return false;
    };

    //CHECKS WIDTH OF THE CANVAS FOR SIZE INCREMENT OR DECREMENT
    function widthChecker(){
        if(width<500){
            if(scale==20){
                scale=10;
                return true;
            }
            return false;            
        }
        else{
            if(scale===10){
                scale = 20;
                return true;
            }
            return false;
        }    
    }

    resize();
    // GETS CONTEXT
    const ctx = cs.getContext("2d");   

    //STORES THE LAST DIRECTION, SO AS TO AVOID THE SNAKE FROM COLLIDING INTO ITSELF.
    var lastDirection='Down';
    //ONLY FOR AUTOMOMOUS MAZE MODE
    var newDirection;


    //GAME VARIABLES WHICH SHOWS PAUSED OR EXIT STATE
    var isPaused = true;
    var quit = false;
    var score = 0;
    var maze = false;
    var timeout;
    var auto=false;

    //REFRESH RATE -> USED TO CONTROL THE SPEED OPTION
    //DEFINITIONS FOR REFRESH RATES
    const easyRR = 90;
    const medRR = 75;
    const hardRR = 60;
    var gameRR = easyRR;

    

    //BUTTON TOGGLES LOADING OF SECOND PAGE
    document.getElementById("begin_button").onclick = function(){
        document.getElementById("initial").style.animation = "Disappear";
        document.getElementById("initial").style.animationDuration = "2s";
        window.setTimeout(function(){
            document.getElementById("initial").style.display = "none";
        },2000);        
    }

    //BUTTON TOGGLES BEGINNING OF GAME
    document.getElementById("game_start_button").onclick = function(){
        document.getElementById("second").style.animation = "Disappear";
        document.getElementById("second").style.animationDuration = "2s";
        setRR();
        setMaze();
        window.setTimeout(()=>{
            document.getElementById("second").style.display = "none";
            isPaused = true;
        },2000);        
    }
    //SELECTING THE CORRECT SETTING FOR USER ENTRIES
    function setRR(){
        if(document.getElementById("_easy").checked===true){
            console.log("Easy");
            gameRR = easyRR;
            document.getElementById("speedValue").innerHTML = "11 FPS";
        }
        else if(document.getElementById("_medium").checked===true){
            console.log("Medium");
            gameRR = medRR;
            document.getElementById("speedValue").innerHTML = "13 FPS";
        }
        else{
            console.log("Hard");
            gameRR = hardRR;
            document.getElementById("speedValue").innerHTML = "16 FPS";
        }
    }
    function setMaze(){
        if(document.getElementById("_maze").checked===true){
            console.log("Maze");
            maze = true;
        }
        else{
            console.log("No Maze");
            maze = false;
        }
        // if(maze===true){
        //     document.getElementById("autoButton").style.display = "none";
        // }        
        document.getElementById("autoButton").onclick = ()=>{
            if(auto===false){
                document.getElementById("autoButton").innerHTML = "Manual Mode";
                auto=true;
            }
            else{
                document.getElementById("autoButton").innerHTML = "Auto Mode";
                auto=false;
            }
        }
    }

    //ADDING THE PAUSED FUNCTIONALITY
    document.getElementById("pause").onclick = ()=>{
        if(isPaused === false){
            document.getElementById("pause").innerHTML = "r";
            isPaused = true;
        }
        else{
            document.getElementById("pause").innerHTML = "q";
            isPaused = false;
        }
    }

    //ADDING THE INSTRUCTION MENU
    document.getElementById("instructions").onclick = ()=>{
        isPaused = true;
        document.getElementById("infoPage").style.display = "block";
    }
    //GOING BACK FROM THE INSTRUCTIONS MENU
    document.getElementById("popupClose").onclick = () =>{
        document.getElementById("infoPage").style.display = "none";
        document.getElementById("pause").innerHTML = "r";
    }

    //STOPPING THE GAME WHEN COLLISION TAKES PLACE
    var snakeCollide = function(){        
        window.setInterval(()=>{
            ctx.clearRect(0,0,cs.width,cs.height);
        },4000);
    }

    //STOPPING THE GAME WHEN CLICKED ON THE STOP BUTTON
    document.getElementById("stop").onclick = () =>{
        quit = true;
        window.clearTimeout(timeout);
        ctx.clearRect(0,0,cs.width,cs.height);
        gameOver();
        gameSound.pause();
    }

    //UPDATING THE SCORE FUNCTION
    var updateScore = ()=>{
        document.getElementById("scoreValue").innerHTML = score;
    }

    //CHECKING THE SPEED OPTION AND UPDATING THE SPEED OF THE GAME
    var updateSpeed = ()=>{
        document.getElementById("speedInc").onclick = function(){
        
            if(gameRR != hardRR){
                if(gameRR=== easyRR){
                    gameRR = medRR;
                    document.getElementById("speedValue").innerHTML = "13 FPS";
                }
                else{
                    gameRR = hardRR;
                    document.getElementById("speedValue").innerHTML = "16 FPS";                    
                }
            }
        }
        document.getElementById("speedDec").onclick = function(){
            if(gameRR!= easyRR && document.getElementById("speedDec").onclick){
                if(gameRR===hardRR){
                    gameRR = medRR;
                    document.getElementById("speedValue").innerHTML = "13 FPS";
                }
                else{
                    gameRR = easyRR;
                    document.getElementById("speedValue").innerHTML = "11 FPS";
                }
            }
        }       
       
    }
    
    //GAME OVER SCREEN
    function gameOver(){
        document.getElementById("gameOverHeading").style.display = "block";
        document.getElementById("gameOverText").style.display = "block";
        document.getElementById("gameOverHeading").style.animationName = "Appear";
        document.getElementById("gameOverHeading").style.animationDuration ="2s"
        document.getElementById("gameOverText").style.animation = "Appear 2s"
        document.getElementById("playingArea").style.display = "none";      

    }


    
    
    //SOUNDS
    const deathSound = new Audio("sound/death.mp3");
    const gameSound = new Audio("sound/play.mp3");
    const biteSound = new Audio("sound/bite.mp3");

    //SNAKE
    function Snake(){
        this.x = 2*scale;
        this.y = 2*scale;
        this.vx = 0;
        this.vy = scale;
        this.total = 1 ;
        this.tail = [];

        this.draw = function(){
            for(let i=0;i<this.tail.length;i++){
                if(i%2==0){
                    ctx.fillStyle = "black";
                }
                else{
                    ctx.fillStyle = "#60F03C";
                }
                ctx.fillRect(this.tail[i].x,this.tail[i].y,scale,scale);
            }
                    ctx.fillStyle = "#EC68A2";
            ctx.fillRect(this.x,this.y,scale,scale);
        },


        this.update = function(){
            for(let i=0;i<this.tail.length - 1;i++){
                this.tail[i]=this.tail[i+1];
            }
            this.tail[this.total-1] = {x:this.x, y:this.y}
            this.x += this.vx;
            this.y += this.vy;
            ctx.clearRect(0,0,cs.width,cs.height);
            this.wrap();
        },
        this.changeDirection = (direction)=>{
            switch(direction){
                case 'Up':
                    if(lastDirection!=='Down' && lastDirection!=='Up'){
                        this.vx=0;
                        this.vy = -scale;
                        document.getElementById('dir').innerHTML = "&#xe010;";
                        lastDirection = 'Up';                        
                    }
                    break;                    
                case 'Down':
                    if(lastDirection!=='Up' && lastDirection!=='Down'){
                        this.vx= 0;
                        this.vy = scale;
                        document.getElementById('dir').innerHTML = "&#xe008;";
                        lastDirection = 'Down';                         
                    } 
                    break;                   
                case 'Left':
                    if(lastDirection!=='Right' && lastDirection!=='Left'){
                        this.vx = -scale;
                        this.vy = 0;
                        document.getElementById('dir').innerHTML = "&#xe00f;";
                        lastDirection = 'Left'; 
                    }
                    break;                    
                case 'Right':
                    if(lastDirection!=='Left' && lastDirection!=='Right'){
                        this.vx = scale;
                        this.vy = 0;
                        document.getElementById('dir').innerHTML = "&#xe00b;";
                        lastDirection = 'Right'; 
                    }
                    break;                    
                default:
                    break;
            }
        },
        

        this.wrap = () => {
            if(this.x >= cs.width){this.x=0;}
            else if(this.x < 0){this.x = cs.width;}
            if(this.y<0){this.y=cs.height;}
            else if(this.y >= cs.height){this.y=0;}
            // if(this.y===cs.height){this.y=0;}
            // if(this.x===cs.width){this.x=0;}
        },


        this.eat = (fruit) => {            
            if(this.x===fruit.x && this.y===fruit.y){
                //UPDATING THE SCORE
                score = score + (900/gameRR);
                updateScore();
                this.total++;
                biteSound.play();
                return true;
            }
            return false;
        },


        this.collide = ()=>{
            for(let i=0;i<this.tail.length;i++){
                if(this.x===this.tail[i].x && this.y===this.tail[i].y){
                    gameSound.pause();
                    deathSound.play();
                    return true;
                }
            }
            return false;
        }
        
        this.bump = function(){
            for(let i=0;i<Mazes.length;i++){
                if(this.x===Mazes[i].x && this.y===Mazes[i].y){
                    gameSound.pause();
                    deathSound.play();
                    return true;
                }
            }
            return false;
        }

        //AUTO FUNCTION FOR AUTONOMOUS FUNCTIONALITY
        this.auto = function(fruit){
            var direction;
            if(maze===false){
                if(this.x===fruit.x){
                    if(this.vy==0){
                        direction = 'Up';
                    } 
                }
                else if(this.y===fruit.y){
                    if(this.vx==0){
                        direction = "Left";
                    }
                }
            }
            this.changeDirection(direction);
            lastDirection = direction;
        }


        this.autoMaze = function(Mazes,fruit){        
            // newDirection;
            if(this.x===fruit.x){
                // console.log(0);
                if(this.vy==0){
                    newDirection = 'Up';
                    console.log("Up")
                    // console.log(newDirection);
                } 
            }
            else if(this.y===fruit.y){
                // console.log(1);
                if(this.vx==0){
                    console.log("Left");
                    newDirection = "Left";
                    // console.log(newDirection);
                }
            }
            
            for(var i=0;i<Mazes.length;i++){
                //IF MOVING UP AND DIRECTION IS CHANGING TO LEFT

                if(this.vy==0 && (this.x - scale === Mazes[i].x) && (this.y===Mazes[i].y)){
                    this.changeDirection("Up");
                    console.log("Up");
                    return;
                }
                else if(this.vx==0 && (this.y - scale === Mazes[i].y) &&(this.x===Mazes[i].x)){
                    this.changeDirection("Left");
                    console.log("Left");
                    return;
                }
                else if(newDirection==='Left' && (this.x - scale === Mazes[i].x) && (this.y===Mazes[i].y)){
                    this.changeDirection("Up");
                    // lastDirection = "Up";
                    console.log("Up");                    
                    return;
                    // console.log(newDirection);
                    // break; 
                }
                else if(newDirection==='Up' && (this.y - scale === Mazes[i].y) &&(this.x===Mazes[i].x)){
                    this.changeDirection("Left");
                    // lastDirection = "Left";
                    console.log("Left");
                    return;
                    // console.log(newDirection);
                    // break;
                }
            }
            console.log(newDirection);
            this.changeDirection(newDirection);
            // lastDirection = newDirection;       
               
        }
    };

    //FRUIT
    function Fruit(){
        this.x;
        this.y;
        
        this.position = ()=>{
            this.x = scale*Math.floor((width*Math.random())/scale);
            this.y = scale*Math.floor((height*Math.random())/scale);
            for(let i=0;i<Mazes.length;i++){
                if(this.x===Mazes[i].x || this.y===Mazes[i].y){
                    this.position();
                    return;
                }
            }
            if(this.x===snake.x && this.y===snake.y){
                this.position();
                return;
            }
            for(let i=0;i<snake.tail.length;i++){
                if(snake.tail[i].x===this.x && snake.tail[i].y===this.y){
                    this.position();
                    return;
                }
            }

        }
        
        this.draw = ()=>{
            ctx.fillStyle = "black";
            ctx.fillRect(this.x,this.y,scale,scale);
            ctx.fillStyle = "red";
            ctx.fillRect(this.x+2,this.y+2,scale-4,scale-4);
        }
        
    }

    //THE MAZE CONSTRUCTOR WHICH WILL CREATE A SINGLE MAZE RECTANGLE
    function Maze(){
        this.x;
        this.y;
        this.fillObject = function(){
            ctx.fillStyle = "#137488";
            ctx.fillRect(this.x,this.y,scale,scale);
            ctx.strokeStyle = "##5D4335";
            ctx.strokeRect(this.x,this.y,scale,scale);
        }        
        
    }

    //ARRAY OF MAZES
    var Mazes = [];
    function createMazes(){
        Mazes = [];
        for(let i=0;i<Math.floor(rows/4);i++){
            Mazes.push(new Maze());
            Mazes[i].x = scale*Math.floor(cs.width/(scale*4));
            Mazes[i].y = i*scale;
            Mazes[i].fillObject();       
        }
        // console.log(cols);
        for(let j=0;j<Math.floor(cols/5);j++){
            Mazes.push(new Maze());
            var newMaze = new Maze();
            newMaze.x = scale*Math.floor(cs.width/(scale*2)) + j*scale;
            newMaze.y = scale*Math.floor(cs.height/(scale*4));
            newMaze.fillObject();
            Mazes.push(newMaze);
        }
        for(let j=0;j<Math.floor(cols/5);j++){
            Mazes.push(new Maze());
            var newMaze = new Maze();
            newMaze.x = scale*Math.floor(cs.width/(scale*4)) + j*scale;
            newMaze.y = scale*Math.floor(3*cs.height/(scale*4));
            newMaze.fillObject();
            Mazes.push(newMaze);
        }
        for(let j=0;j<Math.floor(rows/4);j++){
            Mazes.push(new Maze());
            var newMaze = new Maze();
            newMaze.x = scale*Math.floor(3*cs.width/(scale*4));
            newMaze.y = scale*Math.floor(3*cs.height/(scale*4)) + j*scale;
            newMaze.fillObject();
            Mazes.push(newMaze);
        }

    };
    //IN ORDER TO PLAY THE MAIN SOUND ONLY ONCE (RECURSION!!!!)
    var playCount = 1;
    if(maze===true){
        createMazes();    
    }    
    //GAME LOOP DEFINITIONS
    var snake;
    function activity(){
        gameSound.pause();
        timeout = window.setTimeout(function(){
            if(isPaused===false){
                if(playCount===1){
                    gameSound.play();
                    playCount++;
                }                
                if(resize()||widthChecker()){
                    fruit.position();
                    fruit.draw();
                };
                if(maze===true){
                    createMazes();
                }
                snake.update();
                fruit.draw();
                snake.draw();
                updateSpeed();
                if(auto===true){
                    if(maze===false){snake.auto(fruit);}                        
                    if(maze===true){snake.autoMaze(Mazes,fruit);}                        
                }
                if(maze===true){
                    createMazes();
                }
                if(snake.eat(fruit)){
                    fruit.position();
                }
                if(snake.collide() || snake.bump()){                
                   snakeCollide();
                   quit = true;                   
                   window.clearTimeout(timeout);
                   window.setTimeout(function(){
                    gameOver();
                   },4100);                   
                   return;
                }
                if(quit===true){
                    window.clearTimeout(timeout);
                    gameSound.pause();
                }                
            }
            //RECURSION
            activity();

        },gameRR);
    }

    (function setup() {
               
        snake = new Snake();
        fruit = new Fruit();
        fruit.position();
        updateSpeed();
        resize();
        if(widthChecker()){
            fruit.position();
        };
        //EXECUTING THE GAME LOOP 
        activity();
    }());
    
    //CHANGING DIRECTION
    window.addEventListener("keydown",(event)=>{
        if(auto==false){
            const direction = event.key.replace('Arrow','');
            if(isPaused===false){
                snake.changeDirection(direction);
            }        
            lastDirection = direction;
            if(event.key==='Escape'){
                isPaused = !isPaused;
            }
        }
    });

    //SWIPE FUNCTIONALITY
    function swipedetect(el, callback){
  
        var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 10, 
        allowedTime = 300,
        elapsedTime,
        startTime,
        handleswipe = callback || function(swipedir){}
      
        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0];
            swipedir = 'none';
            dist = 0;
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
            e.preventDefault();
        }, false)
      
        touchsurface.addEventListener('touchmove', function(e){
            e.preventDefault(); // prevent scrolling when inside DIV
        }, false)
      
        touchsurface.addEventListener('touchend', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime){
                //CHECKS IF HORIZONTAL MOVEMENT > VERTICAL MOMENT 
                if (Math.abs(distX) >= threshold && Math.abs(distY) < Math.abs(distX)){ 
                    swipedir = (distX < 0)? 'Left' : 'Right';
                }
                //ELSE CHECKS IF VERTICAL MOVEMENT > HORIZONTAL MOVEMENT
                else if (Math.abs(distY) >= threshold && Math.abs(distX) < Math.abs(distY)){
                    swipedir = (distY < 0)? 'Up' : 'Down';
                }
            }
            handleswipe(swipedir);
            e.preventDefault();
        }, false)
    }
      
    //USAGE:
    //SELECTS THE PLAYING REGION
    var el = document.getElementById("playingRegion");
    swipedetect(el, function(swipedir){    
        if(auto===false){    
            if(isPaused===false){
                snake.changeDirection(swipedir);
            }
            lastDirection = swipedir;
        }
    })
    
},300);
