class Food{
    constructor(){
    reference=database.ref("Pet/");
    reference.on("value",function(data){
        petposition=data.val();
        foodN=petposition.food;
        timeN=petposition.time;
        a=petposition.time2;
    });
    pet = createSprite(200,350,10,10);
    pet.addAnimation("pet",petImg);
    pet.addAnimation("pet1",petImg2);
    pet.scale=0.2;
    this.button3=createButton(gameState);
    this.button3.position(300,30);
    this.button3.style("border-radius:20px;background-color:blue;color:white");
    this.button=createButton();
    this.button2=createButton();
    this.button3.hide();
    }


    getState(){
        var refer=database.ref("gameState");
        refer.on("value",function(data){
            gameState=data.val();
        });
     database.ref("Pet").on("value",function(data){
            lastFed=data.val().lastFeed;
    });
    }
    gameState(){
     if(gameState=="hungry"){
         this.hungry();
         this.button.show();
         this.button2.show();
     }else if(gameState=="play"){
         this.play();
         this.button.hide();
         this.button2.hide();
     }else if(gameState=="sleep"){
         this.sleep();
         this.button.hide();
         this.button2.hide();
     }else if(gameState=="washroom"){
        this.washroom();
        this.button.hide();
        this.button2.hide();
    }
    }
    updateGame(state){
        firebase.database().ref("/").update({
            gameState:state
        })
    }
    changeState(){
        var date=new Date;
        // lastFed=18;
        if(date.getHours()==lastFed+1){
            console.log("hello");
            this.updateGame("play");
        }else if(date.getHours()==lastFed+2){
            this.updateGame("sleep");
        }else if(date.getHours()==lastFed+4 || date.getHours()==lastFed+3){
            this.updateGame("washroom");
        }else{
            this.updateGame("hungry");
        }
    }
    update(timeA){
        
        firebase.database().ref("Pet/").update({
            lastFeed:timeA
        })
    }




    hungry(){
        fill("white");
        text("Last Fed : " + timeN + " " + a,100,100);
        if(game=="wait" && frameCount%60==0 ){
            pet.changeAnimation("pet1",petImg2);
            game="play"; 
            }

        for(var i=0;i<foodN;i++){
            if(i<10){
                image(milk,i*40+30,150,40,50);
            }else{
                image(milk,(i-10)*40+30,200,40,50);
            }
        }
        this.button3.html('hungry');
        this.button3.mousePressed(() =>{
            this.updateGame("play");
        })

        this.button.html('Add Food');
        this.button.position(30,30);
        this.button.style("border-radius:20px;background-color:blue;color:white");
        this.button.mousePressed(function(){
            if(petposition != undefined && foodN<20){
                reference.update(
                    {
                        food:foodN+1,
                        time:timeN,
                        time2:a
                    }
                );
                pet.changeAnimation("pet",petImg);
                game="wait";
            }
            
        });
        this.button2.html('Feed the Food');
        this.button2.position(150,30);
        this.button2.style("border-radius:20px;background-color:blue;color:white");
        this.button2.mousePressed(() =>{
            if(petposition != undefined && game=="play") {
            var now=new Date();
            timeN=now.getHours();
            this.update(now.getHours());
            lastFed=now.getHours();
            if(timeN>12){
                timeN=timeN-12;
                a="PM";
            }else{
                a="AM";
            }
            // console.log(timeN);
            reference.update(
                {
                    food:foodN-1,
                    time:timeN,
                    time2:a
                }
            );
            pet.changeAnimation("pet",petImg);
            game="wait";
            
        }
    }
    )
        bg="green";
    }
    play(){
        this.button3.mousePressed(() =>{
            this.updateGame("sleep");
        })
        this.button3.html("play");
    }
    sleep(){
        this.button3.mousePressed(() =>{
            this.updateGame("washroom");
        })
        this.button3.html("sleep");
    }
    washroom(){
        this.button3.mousePressed(() =>{
            this.updateGame("hungry");
        })
        this.button3.html("washroom");
    }
}