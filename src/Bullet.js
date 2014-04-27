/*globals FM */
/**
* An entity.
*/
var Bullet = function (position, bulletType, active) {
    "use strict";
    //Call parent constructor, provide the z index
    FM.GameObject.call(this, 5);
    
    //Add components to the game object
    this.spatial = new FM.SpatialComponent(position.x, position.y, this);
    this.addComponent(this.spatial);
    /*var size = 2;
    if (!active) {
        size = 3;
    }*/
    this.renderer = new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("bullet"), 6, 6, this);
    this.addComponent(this.renderer);
    this.physic = new FM.CircleComponent(3, this);
    this.addComponent(this.physic);
        
    this.addType(bulletType);
    
    this.active = active;
    
    /**
     * Speed of a bullet.
     */
    this.SPEED = 300;
};
//PlayState inherits from FM.State
Bullet.prototype = Object.create(FM.GameObject.prototype);
Bullet.prototype.constructor = Bullet;
/**
* The update function inherited from FM.State.
* Called each frame.
* @param {Number} dt Fixed delta time since the last frame.
*/
Bullet.prototype.update = function (dt) {
    "use strict";
};
/**
*
*/
Bullet.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.GameObject.prototype.destroy.call(this);

    //Remove the references
};