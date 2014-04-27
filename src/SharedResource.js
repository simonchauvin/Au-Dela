/*globals FM */
/**
* An entity.
*/
var SharedResource = function () {
    "use strict";
    //Call parent constructor, provide the z index
    FM.GameObject.call(this, 10);
    //Add components to the game object
    this.spatial = new FM.SpatialComponent(800, 100, this);
    this.addComponent(this.spatial);
    this.renderer = new FM.CircleRendererComponent(70, '#0f0', this);
    this.addComponent(this.renderer);
    this.physic = new FM.CircleComponent(70, this);
    this.addComponent(this.physic);
};
//PlayState inherits from FM.State
SharedResource.prototype = Object.create(FM.GameObject.prototype);
SharedResource.prototype.constructor = SharedResource;
/**
* The update function inherited from FM.State.
* Called each frame.
* @param {Number} dt Fixed delta time since the last frame.
*/
SharedResource.prototype.update = function (dt) {
    "use strict";
    
};
/**
*
*/
SharedResource.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.GameObject.prototype.destroy.call(this);

    //Remove the references
};