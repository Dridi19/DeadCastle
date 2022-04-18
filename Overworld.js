class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }
 
  startGameLoop() {
    const step = () => {
 
     //Clear off the canvas
     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
      /////// camera person
      const cameraperson = this.map.gameObjects.hero;


     //Draw Lower layer
     this.map.drawLowerImage(this.ctx, cameraperson);
     //Draw Upper layer

     //drawobject
     Object.values(this.map.gameObjects).forEach(object => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map
      })
      object.sprite.draw(this.ctx,cameraperson);
    })
     
    
 
 
      requestAnimationFrame(() => {
       step();   
      })
    }
    step();
  }
 
  init() {
    //mainroom
    this.map = new OverworldMap(window.OverworldMaps.first_map);
    console.log(this.map.walls);
    this.map.mountObjects();
    this.directionInput = new DirectionInput();
    this.directionInput.init();
  
    this.startGameLoop();
   
 
 
  }
 
 }