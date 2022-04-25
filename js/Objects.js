class GameObject {
  constructor(config) {
    this.id = null;
    this.ismonster = config.ismonster || false
    this.isMounted = false;
    this.iskey = config.iskey || false
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Draws({
      gameObject: this,
      src: config.src || "/images/warrior_m.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
  }
  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);
  };

  update() {
  }

  async doBehaviorEvent(map) { 

    if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isstanding) {
      return;
    }

    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    const eventHandler = new Events({ map, event: eventConfig });
    await eventHandler.init(); 
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    } 

    this.doBehaviorEvent(map);
    

  }


}