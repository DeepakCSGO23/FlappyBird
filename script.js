var gameOver;
document.addEventListener('keypress', () => {
    var audio=document.getElementById("gamesound");
    var gameOverAudio=document.getElementById("gameOverSound")
    audio.volume=0.2
    audio.play();   
    var text=document.querySelector(".start-message");
    //overwrites z-index attribute if it is already availabe or creates new z-index attribute style if the z-index is not created before
    text.style.zIndex="-1";
    //Bird character
    var bird = document.querySelector('.bird');
    //Game Container
    var skyContainer = document.querySelector('.sky');
    //Gravity Value
    let gravity = 0;
    //Function to apply gravity by 1px every animation frame
    function applyGravity() {
        bird.style.top = gravity + 'px';
        gravity += 1;
        if (gravity >= 660) {
            audio.pause();
            gameOverAudio.play();
            clearInterval(ob)
            var gameOverMessage=document.querySelector(".restart-message");
            gameOverMessage.style.top="40%";
            gameOverMessage.addEventListener("click",function(){
                window.location.reload();
            })
        }
        const obstacles = document.querySelector('.obstacle');
        if (obstacles != null && isColliding(bird, obstacles)) {
            gameOver=true;
            audio.pause();
            gameOverAudio.play();
            console.log(bird)
            bird.style.backgroundImage="url('vadivelu-crying.gif')";
            clearInterval(ob)
            var gameOverMessage=document.querySelector(".restart-message");
            gameOverMessage.style.top="40%";
            gameOverMessage.addEventListener("click",function(){
                window.location.reload();
            })
            
            cancelAnimationFrame(animationID);
            cancelAnimationFrame(obstacleAnimationID);
            // Stop applying gravity immediately
        }
        animationID = requestAnimationFrame(applyGravity);
    }

    var animationID = requestAnimationFrame(applyGravity);

    //Check if the pressed key is w/space/up arrow
    document.addEventListener("keyup", checkKeyPress);

    function checkKeyPress(event) {
        if(gameOver==true){
            return;
        }
        //calling jump function
        if (event.code == 'Space' || event.code == 'KeyW' || event.code == 'ArrowUp') {
            jump();
        }
    }
    //Function to make the bird jump
    function jump() {
        //Jump closer to the parent so minus 100px from the gravity
        //the bird character can't jump above the game container
        if (gravity - 50>= 0) {
            gravity -= 50;
        }
        //Set top to gravity pixels so that the bird is closer to the game container
        bird.style.top = gravity + "px";
        //Collecting all the obstacles
    }

    function isColliding(a, b) {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        if(aRect.right>bRect.left){
            
            document.getElementById("scoreInc").innerText=`${score}`;
        }
        return !(
            (aRect.bottom < bRect.top) ||
            (aRect.top > bRect.bottom) ||
            (aRect.right < bRect.left) ||
            (aRect.left > bRect.right)
        );
    }
    //Function to create Obstacle
    function createObstacle() {
        score++;
        if(score!=0&&score%10==0){
            var superpaSound=document.getElementById("superpaSound");
            superpaSound.play();
        }
        var obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        //Generate random Obstacle height
        obstacle.style.height = (Math.random() * 400)+50 + "px";
        //Generate obstacle randomly on either top or bottom side
        if (Math.random() >= 0.5) {
            obstacle.style.top = 0 + "px";
        } else {
            obstacle.style.bottom = 0 + "px";
        }
        //move obstacle to the game container
        skyContainer.appendChild(obstacle);
        //Positioning obstacle
        let obstacleRight = 0;
        //Move the obstacle by calling the function every animation frame
        function moveObstacle() {
            //the obstacle moves 5px from right every animation frame
            obstacle.style.right = obstacleRight + "px";
            obstacleRight += 5;
            if (obstacleRight == 1650) {
                cancelAnimationFrame(obstacleAnimationID);
                skyContainer.removeChild(obstacle);
            } else {
                obstacleAnimationID = requestAnimationFrame(moveObstacle);
            }
        }
        var obstacleAnimationID = requestAnimationFrame(moveObstacle);
    }
    //create Obstacle every 2.1 seconds
    var ob=setInterval(createObstacle, 2100);
    //Initially the score is 0
    var score=-1;
},{once:true});
