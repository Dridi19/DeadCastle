class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    //Shadow
    this.shadow = new Image();
    this.useShadow = true; //config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "/images/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-up" : [ [0,0] ],
      "idle-right": [ [0,1] ],
      "idle-down"   : [ [0,2] ],
      "idle-left" : [ [0,3] ],
      "walk-up" : [ [1,0],[0,0],[2,0],[0,0], ],
      "walk-right": [ [1,1],[0,1],[2,1],[0,1], ],
      "walk-down"   : [ [1,2],[0,2],[2,2],[0,2], ],
      "walk-left" : [ [1,3],[0,3],[2,3],[0,3], ]
    }
    this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 4;
    this.animationFrameProgress = this.animationFrameLimit;
    

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }


  }
  

  draw(ctx,cameraperson) {
    const x = this.gameObject.x -2 + utils.withGrid(6)- cameraperson.x;
    const y = this.gameObject.y - 8 + utils.withGrid(4)- cameraperson.y;
    
    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);


    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,
      frameX * 33, frameY * 36,
      33,36,
      x,y,
      30,30
    )

    this.updateAnimationProgress();
  }

}