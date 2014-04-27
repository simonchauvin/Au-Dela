/*globals FM */
/**
* An entity.
*/
var TheThing = function (theThingType, bulletType, avatar) {
    "use strict";
    //Call parent constructor, provide the z index
    FM.GameObject.call(this, 10);
    //Add components to the game object
    this.spatial = new FM.SpatialComponent(512, 370, this);
    this.addComponent(this.spatial);
    this.renderer = new FM.AnimatedSpriteRendererComponent(FM.AssetManager.getAssetByName("theThing"), 140, 140, this);
    this.addComponent(this.renderer);
    this.physic = new FM.CircleComponent(60, this);
    this.physic.offset.x = 10;
    this.physic.offset.y = 10;
    this.addComponent(this.physic);
    
    this.avatar = avatar;
    this.bulletType = bulletType;
    this.theThingType = theThingType;
    this.addType(theThingType);
    //TODO empty the world. WHY ???
    //this.physic.addTypeToCollideWith(this.bulletType);
    
    this.health = 70;
    this.attackSpeed = 70;
    this.avoidSpeed = 100;
    this.burstTime = 0;
    this.avoidTime = 0;
    
    /**
     * AI states.
     */
    this.aIStates = ["avoid", "attack"];
    this.currentState = "avoid";
};
//PlayState inherits from FM.State
TheThing.prototype = Object.create(FM.GameObject.prototype);
TheThing.prototype.constructor = TheThing;
/**
* The update function inherited from FM.State.
* Called each frame.
* @param {Number} dt Fixed delta time since the last frame.
*/
TheThing.prototype.update = function (dt) {
    "use strict";
    // Hit
    var collision = this.theThingType.overlapsWithType(this.bulletType);
    if (collision) {
        var objA = collision.a.owner,
            objB = collision.b.owner;
        if (objA.active || objB.active) {
            if (this.physic.radius > 8) {
                this.health -= 4;
                this.renderer.setWidth(this.renderer.getWidth() - 8);
                this.renderer.setHeight(this.renderer.getHeight() - 8);
                this.physic.radius -= 4;
                this.spatial.position.x += 4;
                this.spatial.position.y += 4;
                if (objA.hasType(this.bulletType)) {
                    objA.kill();
                    objA.hide();
                } else if (objB.hasType(this.bulletType)) {
                    objB.kill();
                    objB.hide();
                }
            } else {
                // Kill
                if (objA.hasType(this.theThingType)) {
                    objA.kill();
                    objA.hide();
                } else if (objB.hasType(this.theThingType)) {
                    objB.kill();
                    objB.hide();
                }
            }
        }
    }
    // Growing
    this.renderer.setWidth(this.renderer.getWidth() + 0.2);
    this.renderer.setHeight(this.renderer.getHeight() + 0.2);
    this.physic.radius += 0.1;
    this.spatial.position.x -= 0.1;
    this.spatial.position.y -= 0.1;
    this.health += 0.1;
    // Avoid player
    if (this.currentState === "avoid") {
        var avatarPosition = new FM.Vector(this.avatar.spatial.position.x + this.avatar.physic.offset.x + this.avatar.physic.radius, this.avatar.spatial.position.y + this.avatar.physic.offset.y + this.avatar.physic.radius),
            center = new FM.Vector(this.spatial.position.x - this.physic.radius, this.spatial.position.y - this.physic.radius),
            distance = new FM.Vector(avatarPosition.x - center.x, avatarPosition.y - center.y);
        if (Math.random() > 0.5 && this.avoidTime > 2) {
            if (Math.random() > 0.75 && center.x < 1024 && center.y < 768) {
                this.physic.velocity.x = this.avoidSpeed;
                this.physic.velocity.y = this.avoidSpeed;
            } else if (Math.random() > 0.5 && center.x > 0 && center.y > 0) {
                this.physic.velocity.x = -this.avoidSpeed;
                this.physic.velocity.y = -this.avoidSpeed;
            } else if (Math.random() > 0.25 && center.x > 0 && center.y < 768) {
                this.physic.velocity.x = -this.avoidSpeed;
                this.physic.velocity.y = this.avoidSpeed;
            } else {
                this.physic.velocity.x = this.avoidSpeed;
                this.physic.velocity.y = -this.avoidSpeed;
            }
            this.avoidTime = 0;
        }
        this.avoidTime += dt;
    } else if (this.currentState === "attack") {
        var avatarPosition = new FM.Vector(this.avatar.spatial.position.x + this.avatar.physic.offset.x + this.avatar.physic.radius, this.avatar.spatial.position.y + this.avatar.physic.offset.y + this.avatar.physic.radius),
            distance = new FM.Vector(avatarPosition.x - this.spatial.position.x - this.physic.radius, avatarPosition.y - this.spatial.position.y - this.physic.radius);
        if (distance.x > 0) {
            this.physic.velocity.x = this.attackSpeed;
        } else if (distance.x < 0) {
            this.physic.velocity.x = -this.attackSpeed;
        } else {
            this.physic.velocity.x = 0;
        }
        if (distance.y > 0) {
            this.physic.velocity.y = this.attackSpeed;
        } else if (distance.y < 0) {
            this.physic.velocity.y = -this.attackSpeed;
        } else {
            this.physic.velocity.y = 0;
        }
        // Randomly increase speed
        if (Math.random() > 0.7 && this.burstTime > 2) {
            this.physic.velocity.x *= 1.3;
            this.physic.velocity.y *= 1.3;
            this.burstTime = 0;
        }
        this.burstTime += dt;
    }
    
    // If low on health then avoid player
    if (this.health <= 70) {
        console.log("AVOID");
        this.currentState = "avoid";
    }
    // If high on health then attack
    if (this.health >= 120) {
        console.log("ATTACK");
        this.currentState = "attack";
    }
    // If player out of bullets then attack
    if (this.avatar.bulletsLeft < 10 && this.health > 70) {
        console.log("ATTACK");
        this.currentState = "attack"
    }
    // If player full of bullets then avoid
    if (this.avatar.bulletsLeft > 30 && this.health < 120) {
        console.log("AVOID");
        this.currentState = "avoid";
    }
};
/**
*
*/
TheThing.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.GameObject.prototype.destroy.call(this);

    //Remove the references
};