class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.spikes = config.spikes || {};
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;
    this.ismonster = config.ismonster || false;
    this.hp = 1500;
    this.check = true;
    this.isCutscenePlaying = false;
    this.talking = config.talking || [];

  }

  drawLowerImage(ctx, cameraperson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(6)- cameraperson.x, utils.withGrid(4)- cameraperson.y)
  }
  stairs(){
    this.gameObjects["hero"].x = utils.withGrid(2)
    this.gameObjects["hero"].y = utils.withGrid(9)
    
  }
  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    if(`${x},${y}` === `${12*32},${15*32}`){
      this.gamewin()
      
    };
    if(`${x},${y}` === `${3*32},${3*32}`){
      this.stairs()
      
    }
    this.checkifmonsterthere();
    if(this.walls[`${x},${y}`]){
      this.checkforspikes(x,y);
      return true
    }
    return this.walls[`${x},${y}`] || false;
  }
  lose(){
    const lose = document.querySelector('.ending');
    lose.id = "lost";
  }
  gamewin(){
    const end = document.querySelector('.ending');
    end.id = "gameend";
  }
  checkifmonsterthere(){
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      if (object.ismonster) {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`}
    });
    
    if (match) {
      this.hp-=1
      document.getElementById("hp").innerHTML = this.hp + `HP <img src="images/touse/heart.png" alt="">`;
      if (this.hp <= 0){
        this.hp = 0
        this.lose()
        this.dridi();
      }
    }
}
  checkforspikes(x,y){
    if(this.spikes[`${x},${y}`]){
      this.hp -=1;
      document.getElementById("hp").innerHTML = this.hp + `HP <img src="images/touse/heart.png" alt="">`;
      if (this.hp <= 0){
        this.hp = 0
        this.lose()
        this.dridi()
      }
    }
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;
      //TODO: determine if this object should actually mount
      console.log(this.gameObjects[key].iskey)
      if(!this.gameObjects[key].iskey){
      object.mount(this);}

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;


    /// reset movements
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }
  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }
   attack(){
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    this.gameObjects.attack = new Person({
      x: nextCoords.x,
      y: nextCoords.y ,
      src: "/images/touse/attacka.png", },);
      setTimeout(() => {
        delete this.gameObjects.attack
        const match = Object.values(this.gameObjects).find(object => {
          if (object.ismonster) {
            var y = object.y - nextCoords.y
            var x =object.x - nextCoords.x
            return (  x>=-20 && x<=20 && y>=-20 && y<=20  )
            
          }
         
        });
        if (match) {
          console.log(this.gameObjects[match.id])
          const newobjcoords =utils.nextPosition(this.gameObjects[match.id].x,this.gameObjects[match.id].y, "right");
          this.removeWall(this.gameObjects[match.id].x,this.gameObjects[match.id].y)
          this.removeWall(newobjcoords.x+32,newobjcoords.y)
          this.removeWall(newobjcoords.x-32,newobjcoords.y)
          delete this.gameObjects[match.id]
       
        }
      }, 500);
    
    
    }
    
keychecker(){
  const hero = this.gameObjects["hero"];
  const key1 = this.gameObjects["keyFirstroom"] || {};
  const key2 = this.gameObjects["keySecondroom"];
  console.log(key1.x)
  console.log(hero.x)
  
  if (`${hero.x},${hero.y}` === `${key1.x},${key1.y}`){
    delete this.gameObjects["keyFirstroom"];
    const newobjcoords =utils.nextPosition(11,6,"right");
    delete this.walls[`${12*32},${6*32}`];
    delete this.walls[`${11*32},${6*32}`];
    this.lowerImage.src = "/images/touse/castel2.png";
    
  };
  if(`${hero.x},${hero.y}` === `${key2.x},${key2.y}`){
    delete this.gameObjects["keySecondroom"];
    this.lowerImage.src = "/images/touse/castel3.png"
    delete this.walls[`${14*32},${15*32}`];
    delete this.walls[`${14*32},${16*32}`];
  }
}
  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }
}

window.OverworldMaps = {
  

first_map: {
  lowerSrc: "/images/touse/castel.png",
  ///game objects
  gameObjects: {
    /// hero
    hero: new Person({
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(2),
      src: "/images/touse/char.png"
    }),
    queen: new Person({
      x: utils.withGrid(12),
      y: utils.withGrid(15),
      src: "/images/touse/queen.png"
    }),
    ////keys
    keyFirstroom: new Person({
      iskey: true,
      x: utils.withGrid(12),
      y: utils.withGrid(2),
      src: "/images/touse/key.png",
    }),
    keySecondroom: new Person({
      iskey: true,
      x: utils.withGrid(21),
      y: utils.withGrid(16),
      src: "/images/touse/key.png",
    }),

    //// PNGS
    Png1: new Person({
      
      x: utils.withGrid(5),
      y: utils.withGrid(2),
      src: "/images/touse/2.png",
      behaviorLoop: [
        { type: "stand",  direction: "left", time: 800 },
       // { type: "stand",  direction: "up", time: 800 },
        //{ type: "stand",  direction: "right", time: 1200 },
        //{ type: "stand",  direction: "up", time: 300 },
      ],
      talking: [
          {
            events: [
              { type: "textmessage", text: "Bonjour dans ce jeu votre objectif est de sauver la princesse des monstres."},
              { type: "textmessage", text: "Ces monstres augmenteront de niveau à chaque confrontation"},
              { type: "textmessage", text: " Attention!!! Ilya aura des pièges aussi dans ce jeu qui peuvent vous tuer"},
              { type: "textmessage", text: "Et donc vous faire perdre le jeu. "},
            ]
          }
        ]

    }),
    Png2: new Person({
      x: utils.withGrid(28),
      y: utils.withGrid(2),
      src: "/images/touse/2.png",
      behaviorLoop: [
        { type: "stand",  direction: "left", time: 800 },
      ],
      talking: [
          {
            events: [
              { type: "textmessage", text: "Vous entrez maintenant dans la maze c'est le chemin le plus compliqué du jeu."},
              { type: "textmessage", text: "Essayer de ne pas se perdre, tuez tous les monstres et SAUVER LA PRINCESSE !!!"},

            ]
          }
        ]

    }),
    Png3: new Person({
      
      x: utils.withGrid(25),
      y: utils.withGrid(16),
      src: "/images/touse/2.png",
      behaviorLoop: [
        { type: "stand",  direction: "up", time: 800 },
      ],
      talking: [
          {
            events: [
              { type: "textmessage", text: "vous y êtes presque !!! Sauvez la princesse et remporter la victoire"},

            ]
          }
        ]

    }),
    /// second level monsters
    secondlevel: new Person({
      ismonster: true,
      x: utils.withGrid(12),
      y: utils.withGrid(5),
      src: "/images/touse/3.png",
      behaviorLoop: [
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 1200 },
        { type: "stand",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 1200 },
      ]
    }),
    /// THIRd LEVEL MONSTERS
    secondlevel2: new Person({
      ismonster: true,
      x: utils.withGrid(15),
      y: utils.withGrid(10),
      src: "/images/touse/3.png",
      behaviorLoop: [
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 800 },
        { type: "stand",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 300 },
      ]
    }),
    // ladder room monster
    zombie: new Person({
      ismonster: true,
      x: utils.withGrid(17),
      y: utils.withGrid(10),
      src: "/images/touse/1.png",
      behaviorLoop: [
        { type: "walk",  direction: "left", time: 800 },
        { type: "stand",  direction: "right", time: 1400 },
        { type: "walk",  direction: "right", time: 800 },
      ]
    }),
    third2: new Person({
      ismonster: true,
      x: utils.withGrid(18),
      y: utils.withGrid(3),
      src: "/images/touse/3.png",
      behaviorLoop: [
        { type: "stand",  direction: "left", time: 800 },
        { type: "stand",  direction: "up", time: 800 },
        { type: "stand",  direction: "right", time: 1200 },
        { type: "stand",  direction: "up", time: 300 },
      ]
    }),
    ///// maze zombies
    maze_zombie: new Person({
      ismonster: true,
      x: utils.withGrid(34),
      y: utils.withGrid(11),
      src: "/images/touse/1.png",
      behaviorLoop: [
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 800 },
        { type: "stand",  direction: "right", time: 300 },
        { type: "walk",  direction: "right", time: 800 },
        { type: "walk",  direction: "right", time: 800 },
        { type: "walk",  direction: "right", time: 800 },
      ]
    }),
    maze_zombie2: new Person({
      ismonster: true,
      x: utils.withGrid(28),
      y: utils.withGrid(11),
      src: "/images/touse/1.png",
      behaviorLoop: [
        { type: "walk",  direction: "left", time: 1500 },
        { type: "walk",  direction: "left", time: 1500 },
        { type: "walk",  direction: "left", time: 1500 },
        { type: "walk",  direction: "left", time: 1500 },
        { type: "stand",  direction: "right", time: 1500 },
        { type: "walk",  direction: "right", time: 1500 },
        { type: "walk",  direction: "right", time: 1500 },
        { type: "walk",  direction: "right", time: 1500 },
        { type: "walk",  direction: "right", time: 1500 },
      ]
    }),
    maze_zombie3: new Person({
      ismonster: true,
      x: utils.withGrid(31),
      y: utils.withGrid(5),
      src: "/images/touse/1.png",
      behaviorLoop: [
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 800 },
        { type: "walk",  direction: "left", time: 1200 },
        { type: "stand",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 1200 },
        { type: "walk",  direction: "right", time: 800 },
        { type: "walk",  direction: "right", time: 800 },
        { type: "walk",  direction: "right", time: 800 },
      ]
    }),

    //// queen rooom monsters
    last_zombie: new Person({
      ismonster: true,
      x: utils.withGrid(15),
      y: utils.withGrid(15),
      src: "/images/touse/1.png",
      behaviorLoop: [
        { type: "stand",  direction: "left", time: 800 },
        { type: "stand",  direction: "up", time: 800 },
        { type: "stand",  direction: "right", time: 1200 },
        { type: "stand",  direction: "up", time: 300 },
      ]
    }),
    last1_zombie: new Person({
      ismonster: true,
      x: utils.withGrid(15),
      y: utils.withGrid(16),
      src: "/images/touse/1.png",
      behaviorLoop: [
        { type: "stand",  direction: "left", time: 800 },
        { type: "stand",  direction: "up", time: 800 },
        { type: "stand",  direction: "right", time: 1200 },
        { type: "stand",  direction: "up", time: 300 },
      ]
    }),
  },
walls: {
  //////doors
  [utils.asGridCoord(12,6)]: true,
  [utils.asGridCoord(11,6)]: true,
  [utils.asGridCoord(14,15)]: true,
  [utils.asGridCoord(14,16)]: true,

  /////walls

  [utils.asGridCoord(17,2)]: true,
  [utils.asGridCoord(18,2)]: true,
  [utils.asGridCoord(16,2)]: true,
  [utils.asGridCoord(11,11)]: true,
  [utils.asGridCoord(12,11)]: true,
  [utils.asGridCoord(13,11)]: true,
  [utils.asGridCoord(10,3)]: true,
  [utils.asGridCoord(11,3)]: true,
  [utils.asGridCoord(10,4)]: true,
  [utils.asGridCoord(11,4)]: true,
  [utils.asGridCoord(0,0)]: true,
  [utils.asGridCoord(0,1)]: true,
  [utils.asGridCoord(0,2)]: true,
  [utils.asGridCoord(0,3)]: true,
  [utils.asGridCoord(0,4)]: true,
  [utils.asGridCoord(0,5)]: true,
  [utils.asGridCoord(0,6)]: true,
  [utils.asGridCoord(0,7)]: true,
  [utils.asGridCoord(0,8)]: true,
  [utils.asGridCoord(0,9)]: true,
  [utils.asGridCoord(0,10)]: true,
  [utils.asGridCoord(0,11)]: true,
  [utils.asGridCoord(0,12)]: true,
  [utils.asGridCoord(1,1)]: true,
  [utils.asGridCoord(2,1)]: true,
  [utils.asGridCoord(3,1)]: true,
  [utils.asGridCoord(4,1)]: true,
  [utils.asGridCoord(5,1)]: true,
  [utils.asGridCoord(6,1)]: true,
  [utils.asGridCoord(7,1)]: true,
  [utils.asGridCoord(7,2)]: true,
  [utils.asGridCoord(8,1)]: true,
  [utils.asGridCoord(9,1)]: true,
  [utils.asGridCoord(10,1)]: true,
  [utils.asGridCoord(11,1)]: true,
  [utils.asGridCoord(12,1)]: true,
  [utils.asGridCoord(13,1)]: true,
  [utils.asGridCoord(19,1)]: true,
  [utils.asGridCoord(20,1)]: true,
  [utils.asGridCoord(21,1)]: true,
  [utils.asGridCoord(22,1)]: true,
  [utils.asGridCoord(23,1)]: true,
  [utils.asGridCoord(24,1)]: true,
  [utils.asGridCoord(25,1)]: true,
  [utils.asGridCoord(26,1)]: true,
  [utils.asGridCoord(27,1)]: true,
  [utils.asGridCoord(28,1)]: true,
  [utils.asGridCoord(29,1)]: true,
  [utils.asGridCoord(30,1)]: true,
  [utils.asGridCoord(31,1)]: true,
  [utils.asGridCoord(32,1)]: true,
  [utils.asGridCoord(33,1)]: true,
  [utils.asGridCoord(34,1)]: true,
  [utils.asGridCoord(35,1)]: true,
  [utils.asGridCoord(36,1)]: true,
  [utils.asGridCoord(37,1)]: true,
  [utils.asGridCoord(38,1)]: true,
  [utils.asGridCoord(14,0)]: true,
  [utils.asGridCoord(14,1)]: true,
  [utils.asGridCoord(14,2)]: true,
  [utils.asGridCoord(14,3)]: true,
  [utils.asGridCoord(14,4)]: true,
  [utils.asGridCoord(14,5)]: true,
  [utils.asGridCoord(14,6)]: true,
  [utils.asGridCoord(15,6)]: true,
  [utils.asGridCoord(16,6)]: true,
  [utils.asGridCoord(17,6)]: true,
  [utils.asGridCoord(18,6)]: true,
  [utils.asGridCoord(19,6)]: true,
  [utils.asGridCoord(20,6)]: true,
  [utils.asGridCoord(13,7)]: true,
  [utils.asGridCoord(14,7)]: true,
  [utils.asGridCoord(15,7)]: true,
  [utils.asGridCoord(16,7)]: true,
  [utils.asGridCoord(17,7)]: true,
  [utils.asGridCoord(18,7)]: true,
  [utils.asGridCoord(19,7)]: true,
  [utils.asGridCoord(20,7)]: true,
  [utils.asGridCoord(20,3)]: true,
  [utils.asGridCoord(20,4)]: true,
  [utils.asGridCoord(20,5)]: true,
  [utils.asGridCoord(10,6)]: true,
  [utils.asGridCoord(10,7)]: true,
  [utils.asGridCoord(10,8)]: true,
  [utils.asGridCoord(10,9)]: true,
  [utils.asGridCoord(10,10)]: true,
  [utils.asGridCoord(10,11)]: true,
  [utils.asGridCoord(10,12)]: true,
  [utils.asGridCoord(10,13)]: true,
  [utils.asGridCoord(10,14)]: true,
  [utils.asGridCoord(10,15)]: true,
  [utils.asGridCoord(10,16)]: true,
  [utils.asGridCoord(10,17)]: true,
  [utils.asGridCoord(10,18)]: true,
  [utils.asGridCoord(10,18)]: true,
  [utils.asGridCoord(11,18)]: true,
  [utils.asGridCoord(12,18)]: true,
  [utils.asGridCoord(13,18)]: true,
  [utils.asGridCoord(14,18)]: true,
  [utils.asGridCoord(15,18)]: true,
  [utils.asGridCoord(16,18)]: true,
  [utils.asGridCoord(17,18)]: true,
  [utils.asGridCoord(18,18)]: true,
  [utils.asGridCoord(19,18)]: true,
  [utils.asGridCoord(20,18)]: true,
  [utils.asGridCoord(21,18)]: true,
  [utils.asGridCoord(22,18)]: true,
  [utils.asGridCoord(23,18)]: true,
  [utils.asGridCoord(24,18)]: true,
  [utils.asGridCoord(25,18)]: true,
  [utils.asGridCoord(26,18)]: true,
  [utils.asGridCoord(27,18)]: true,
  [utils.asGridCoord(28,18)]: true,
  [utils.asGridCoord(29,18)]: true,
  [utils.asGridCoord(30,18)]: true,
  [utils.asGridCoord(31,18)]: true,
  [utils.asGridCoord(32,18)]: true,
  [utils.asGridCoord(33,18)]: true,
  [utils.asGridCoord(34,18)]: true,
  [utils.asGridCoord(35,18)]: true,
  [utils.asGridCoord(36,18)]: true,
  [utils.asGridCoord(37,18)]: true,
  [utils.asGridCoord(38,18)]: true,
  [utils.asGridCoord(1,6)]: true,
  [utils.asGridCoord(2,6)]: true,
  [utils.asGridCoord(3,6)]: true,
  [utils.asGridCoord(4,6)]: true,
  [utils.asGridCoord(5,6)]: true,
  [utils.asGridCoord(6,6)]: true,
  [utils.asGridCoord(7,6)]: true,
  [utils.asGridCoord(8,6)]: true,
  [utils.asGridCoord(9,6)]: true,
  [utils.asGridCoord(10,6)]: true,
  [utils.asGridCoord(7,5)]: true,
  [utils.asGridCoord(0,7)]: true,
  [utils.asGridCoord(1,7)]: true,
  [utils.asGridCoord(2,7)]: true,
  [utils.asGridCoord(3,7)]: true,
  [utils.asGridCoord(4,7)]: true,
  [utils.asGridCoord(5,7)]: true,
  [utils.asGridCoord(13,6)]: true,
  [utils.asGridCoord(14,6)]: true,
  [utils.asGridCoord(15,6)]: true,
  [utils.asGridCoord(16,6)]: true,
  [utils.asGridCoord(17,6)]: true,
  [utils.asGridCoord(18,6)]: true,
  [utils.asGridCoord(19,6)]: true,
  [utils.asGridCoord(20,6)]: true,
  [utils.asGridCoord(13,7)]: true,
  [utils.asGridCoord(14,7)]: true,
  [utils.asGridCoord(15,7)]: true,
  [utils.asGridCoord(16,7)]: true,
  [utils.asGridCoord(17,7)]: true,
  [utils.asGridCoord(18,7)]: true,
  [utils.asGridCoord(19,7)]: true,
  [utils.asGridCoord(20,7)]: true,
  [utils.asGridCoord(20,3)]: true,
  [utils.asGridCoord(20,4)]: true,
  [utils.asGridCoord(20,5)]: true,
  [utils.asGridCoord(1,11)]: true,
  [utils.asGridCoord(2,11)]: true,
  [utils.asGridCoord(3,11)]: true,
  [utils.asGridCoord(4,11)]: true,
  [utils.asGridCoord(5,11)]: true,
  [utils.asGridCoord(1,12)]: true,
  [utils.asGridCoord(2,12)]: true,
  [utils.asGridCoord(3,12)]: true,
  [utils.asGridCoord(4,12)]: true,
  [utils.asGridCoord(5,11)]: true,
  [utils.asGridCoord(5,7)]: true,
  [utils.asGridCoord(5,8)]: true,
  [utils.asGridCoord(5,9)]: true,
  [utils.asGridCoord(5,10)]: true,
  [utils.asGridCoord(5,11)]: true,
  [utils.asGridCoord(10,7)]: true,
  [utils.asGridCoord(10,8)]: true,
  [utils.asGridCoord(10,9)]: true,
  [utils.asGridCoord(10,10)]: true,
  [utils.asGridCoord(10,11)]: true,
  [utils.asGridCoord(10,12)]: true,
  [utils.asGridCoord(10,13)]: true,
  [utils.asGridCoord(10,14)]: true,
  [utils.asGridCoord(10,15)]: true,
  [utils.asGridCoord(10,16)]: true,
  [utils.asGridCoord(10,17)]: true,
  [utils.asGridCoord(10,18)]: true,
  [utils.asGridCoord(10,19)]: true,
  [utils.asGridCoord(10,12)]: true,
  [utils.asGridCoord(11,12)]: true,
  [utils.asGridCoord(12,12)]: true,
  [utils.asGridCoord(13,12)]: true,
  [utils.asGridCoord(14,12)]: true,
  [utils.asGridCoord(15,12)]: true,
  [utils.asGridCoord(16,12)]: true,
  [utils.asGridCoord(17,12)]: true,
  [utils.asGridCoord(18,12)]: true,
  [utils.asGridCoord(19,12)]: true,
  [utils.asGridCoord(20,12)]: true,
  [utils.asGridCoord(10,13)]: true,
  [utils.asGridCoord(11,13)]: true,
  [utils.asGridCoord(12,13)]: true,
  [utils.asGridCoord(13,13)]: true,
  [utils.asGridCoord(14,13)]: true,
  [utils.asGridCoord(15,13)]: true,
  [utils.asGridCoord(16,13)]: true,
  [utils.asGridCoord(17,13)]: true,
  [utils.asGridCoord(18,13)]: true,
  [utils.asGridCoord(19,13)]: true,
  [utils.asGridCoord(20,13)]: true,
  [utils.asGridCoord(14,14)]: true,
  [utils.asGridCoord(14,17)]: true,
  [utils.asGridCoord(38,0)]: true,
  [utils.asGridCoord(38,1)]: true,
  [utils.asGridCoord(38,2)]: true,
  [utils.asGridCoord(38,3)]: true,
  [utils.asGridCoord(38,4)]: true,
  [utils.asGridCoord(38,5)]: true,
  [utils.asGridCoord(38,6)]: true,
  [utils.asGridCoord(38,7)]: true,
  [utils.asGridCoord(38,8)]: true,
  [utils.asGridCoord(38,9)]: true,
  [utils.asGridCoord(38,10)]: true,
  [utils.asGridCoord(38,11)]: true,
  [utils.asGridCoord(38,12)]: true,
  [utils.asGridCoord(38,13)]: true,
  [utils.asGridCoord(38,14)]: true,
  [utils.asGridCoord(38,15)]: true,
  [utils.asGridCoord(38,16)]: true,
  [utils.asGridCoord(38,17)]: true,
  [utils.asGridCoord(38,18)]: true,
  [utils.asGridCoord(38,19)]: true,
  [utils.asGridCoord(20,14)]: true,
  [utils.asGridCoord(21,14)]: true,
  [utils.asGridCoord(22,14)]: true,
  [utils.asGridCoord(23,14)]: true,
  [utils.asGridCoord(24,14)]: true,
  [utils.asGridCoord(25,14)]: true,
  [utils.asGridCoord(20,15)]: true,
  [utils.asGridCoord(21,15)]: true,
  [utils.asGridCoord(22,15)]: true,
  [utils.asGridCoord(23,15)]: true,
  [utils.asGridCoord(24,15)]: true,
  [utils.asGridCoord(25,15)]: true,
  [utils.asGridCoord(25,14)]: true,
  [utils.asGridCoord(25,13)]: true,
  [utils.asGridCoord(25,12)]: true,
  [utils.asGridCoord(22,16)]: true,
  [utils.asGridCoord(23,16)]: true,
  [utils.asGridCoord(24,16)]: true,
  [utils.asGridCoord(7,3)]: true,
  [utils.asGridCoord(7,2)]: true,
  [utils.asGridCoord(23,0)]: true,
  [utils.asGridCoord(23,1)]: true,
  [utils.asGridCoord(23,3)]: true,
  [utils.asGridCoord(23,4)]: true,
  [utils.asGridCoord(23,5)]: true,
  [utils.asGridCoord(23,6)]: true,
  [utils.asGridCoord(23,7)]: true,
  [utils.asGridCoord(23,8)]: true,
  [utils.asGridCoord(23,9)]: true,
  [utils.asGridCoord(23,10)]: true,
  [utils.asGridCoord(23,11)]: true,
  [utils.asGridCoord(23,12)]: true,
  [utils.asGridCoord(23,13)]: true,
  [utils.asGridCoord(24,3)]: true,
  [utils.asGridCoord(25,3)]: true,
  [utils.asGridCoord(24,4)]: true,
  [utils.asGridCoord(25,4)]: true,
  [utils.asGridCoord(25,6)]: true,
  [utils.asGridCoord(25,7)]: true,
  [utils.asGridCoord(25,8)]: true,
  [utils.asGridCoord(25,9)]: true,
  [utils.asGridCoord(26,9)]: true,
  [utils.asGridCoord(26,10)]: true,
  [utils.asGridCoord(29,2)]: true,
  [utils.asGridCoord(29,3)]: true,
  [utils.asGridCoord(29,4)]: true,
  [utils.asGridCoord(28,4)]: true,
  [utils.asGridCoord(28,3)]: true,
  [utils.asGridCoord(27,3)]: true,
  [utils.asGridCoord(27,4)]: true,
  [utils.asGridCoord(27,5)]: true,
  [utils.asGridCoord(27,6)]: true,
  [utils.asGridCoord(27,7)]: true,
  [utils.asGridCoord(27,8)]: true,
  [utils.asGridCoord(27,9)]: true,
  [utils.asGridCoord(27,10)]: true,
  [utils.asGridCoord(26,10)]: true,
  [utils.asGridCoord(25,10)]: true,
  [utils.asGridCoord(31,3)]: true,
  [utils.asGridCoord(32,3)]: true,
  [utils.asGridCoord(33,3)]: true,
  [utils.asGridCoord(34,3)]: true,
  [utils.asGridCoord(35,3)]: true,
  [utils.asGridCoord(36,4)]: true,
  [utils.asGridCoord(31,4)]: true,
  [utils.asGridCoord(32,4)]: true,
  [utils.asGridCoord(33,4)]: true,
  [utils.asGridCoord(34,4)]: true,
  [utils.asGridCoord(35,4)]: true,
  [utils.asGridCoord(36,4)]: true,
  [utils.asGridCoord(32,5)]: true,
  [utils.asGridCoord(29,6)]: true,
  [utils.asGridCoord(30,6)]: true,
  [utils.asGridCoord(31,6)]: true,
  [utils.asGridCoord(32,6)]: true,
  [utils.asGridCoord(33,6)]: true,
  [utils.asGridCoord(34,6)]: true,
  [utils.asGridCoord(36,6)]: true,
  [utils.asGridCoord(37,6)]: true,
  [utils.asGridCoord(29,7)]: true,
  [utils.asGridCoord(30,7)]: true,
  [utils.asGridCoord(31,7)]: true,
  [utils.asGridCoord(32,7)]: true,
  [utils.asGridCoord(33,7)]: true,
  [utils.asGridCoord(34,7)]: true,
  [utils.asGridCoord(36,7)]: true,
  [utils.asGridCoord(37,7)]: true,
  [utils.asGridCoord(29,7)]: true,
  [utils.asGridCoord(29,8)]: true,
  [utils.asGridCoord(29,9)]: true,
  [utils.asGridCoord(29,10)]: true,
  [utils.asGridCoord(29,11)]: true,
  [utils.asGridCoord(29,12)]: true,
  [utils.asGridCoord(29,13)]: true,
  [utils.asGridCoord(29,14)]: true,
  [utils.asGridCoord(29,17)]: true,
  [utils.asGridCoord(27,12)]: true,
  [utils.asGridCoord(28,12)]: true,
  [utils.asGridCoord(29,12)]: true,
  [utils.asGridCoord(31,12)]: true,
  [utils.asGridCoord(32,12)]: true,
  [utils.asGridCoord(27,13)]: true,
  [utils.asGridCoord(28,13)]: true,
  [utils.asGridCoord(29,13)]: true,
  [utils.asGridCoord(31,13)]: true,
  [utils.asGridCoord(32,13)]: true,
  [utils.asGridCoord(31,9)]: true,
  [utils.asGridCoord(32,9)]: true,
  [utils.asGridCoord(33,9)]: true,
  [utils.asGridCoord(34,9)]: true,
  [utils.asGridCoord(35,9)]: true,
  [utils.asGridCoord(36,9)]: true,
  [utils.asGridCoord(31,10)]: true,
  [utils.asGridCoord(32,10)]: true,
  [utils.asGridCoord(33,10)]: true,
  [utils.asGridCoord(34,10)]: true,
  [utils.asGridCoord(35,10)]: true,
  [utils.asGridCoord(36,10)]: true,
  [utils.asGridCoord(36,11)]: true,
  [utils.asGridCoord(36,12)]: true,
  [utils.asGridCoord(36,13)]: true,
  [utils.asGridCoord(36,14)]: true,
  [utils.asGridCoord(33,12)]: true,
  [utils.asGridCoord(34,12)]: true,
  [utils.asGridCoord(34,13)]: true,
  [utils.asGridCoord(34,14)]: true,
  [utils.asGridCoord(34,15)]: true,
  [utils.asGridCoord(27,14)]: true,
  [utils.asGridCoord(29,14)]: true,
  [utils.asGridCoord(30,14)]: true,
  [utils.asGridCoord(26,15)]: true,
  [utils.asGridCoord(32,15)]: true,
  [utils.asGridCoord(34,15)]: true,
  [utils.asGridCoord(37,15)]: true,
  [utils.asGridCoord(26,16)]: true,
  [utils.asGridCoord(28,16)]: true,
  [utils.asGridCoord(30,16)]: true,
  [utils.asGridCoord(31,16)]: true,
  [utils.asGridCoord(35,16)]: true,
  [utils.asGridCoord(28,17)]: true,
  [utils.asGridCoord(29,17)]: true,
  [utils.asGridCoord(33,17)]: true,
  [utils.asGridCoord(15,5)]: true,
  [utils.asGridCoord(19,5)]: true,
  [utils.asGridCoord(14,8)]: true,
  [utils.asGridCoord(8,2)]: true,
  [utils.asGridCoord(6,3)]: true,
  [utils.asGridCoord(4,9)]: true,
  [utils.asGridCoord(14,9)]: true,
  [utils.asGridCoord(15,9)]: true,
  [utils.asGridCoord(16,9)]: true,
  [utils.asGridCoord(17,9)]: true,
  [utils.asGridCoord(18,9)]: true,
  [utils.asGridCoord(19,9)]: true,
  [utils.asGridCoord(20,9)]: true,
  [utils.asGridCoord(14,11)]: true,
  [utils.asGridCoord(15,11)]: true,
  [utils.asGridCoord(16,11)]: true,
  [utils.asGridCoord(17,11)]: true,
  [utils.asGridCoord(18,11)]: true,
  [utils.asGridCoord(19,11)]: true,
  [utils.asGridCoord(20,11)]: true,
  [utils.asGridCoord(14,1)]: true,
  [utils.asGridCoord(15,1)]: true,
  [utils.asGridCoord(16,1)]: true,
  [utils.asGridCoord(17,1)]: true,
  [utils.asGridCoord(18,1)]: true
},
spikes:{
  [utils.asGridCoord(17,2)]: true,
  [utils.asGridCoord(18,2)]: true,
  [utils.asGridCoord(16,2)]: true,
  [utils.asGridCoord(11,11)]: true,
  [utils.asGridCoord(12,11)]: true,
  [utils.asGridCoord(13,11)]: true,
  [utils.asGridCoord(10,3)]: true,
  [utils.asGridCoord(11,3)]: true,
  [utils.asGridCoord(10,4)]: true,
  [utils.asGridCoord(11,4)]: true,



}
},/////first_map ending

}