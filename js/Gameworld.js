class Gameworld {
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

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);
      
      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })
      this.map.drawUpperImage(this.ctx, cameraPerson);
      requestAnimationFrame(() => {
        step();   
      })
    }
    step();
 }
 bindActionInput() {
  new KeyPressListener("Enter", () => {
    //Is there a person here to talk to?
    this.map.checkForActionCutscene()  
  })}
  checkforattack() {
    new KeyPressListener("Space", () => {
      
      //Is there a person here to talk to?
      this.map.attack()  
      
    })}
  checkforkeys(){
    new KeyPressListener("KeyF", () => {
      
      //Is there a person here to talk to?
      this.map.keychecker()  
      
    })
  }

 init() {
  this.map = new Gamemap(window.Gamemaps.first_map);
  this.map.mountObjects();

  this.directionInput = new Movements();
  this.directionInput.init();
  this.bindActionInput();
  this.checkforattack();
  this.checkforkeys();
  this.startGameLoop();
  this.map.startCutscene([
  ])

 }
}