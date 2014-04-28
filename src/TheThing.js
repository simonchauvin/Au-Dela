/*globals FM */
/**
* An entity.
*/
var TheThing = function (theThingType, bulletType, avatar) {
    "use strict";
    //Call parent constructor, provide the z index
    FM.GameObject.call(this, 10);
    //Add components to the game object
    this.spatial = new FM.SpatialComponent(600, 470, this);
    this.addComponent(this.spatial);
    this.renderer = new FM.AnimatedSpriteRendererComponent(FM.AssetManager.getAssetByName("theThing"), 168, 168, this);
    this.renderer.addAnimation("avoid", [0], 5, false);
    this.renderer.addAnimation("attack", [1], 5, false);
    this.addComponent(this.renderer);
    this.renderer.play("avoid");
    this.physic = new FM.CircleComponent(60, this);
    this.physic.offset.x = 24;
    this.physic.offset.y = 24;
    this.addComponent(this.physic);
    this.sound = new FM.AudioComponent(this);
    this.sound.addSound(FM.AssetManager.getAssetByName("the_thing_hit"));
    this.addComponent(this.sound);
    
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
    // Growing
    if (this.currentState !== "freed") {
        // TODO why is it not growing at the same speed (physic and renderer ? frame rate between physics and rendering ?)
        this.renderer.setWidth(this.renderer.getWidth() + 0.1);
        this.renderer.setHeight(this.renderer.getHeight() + 0.1);
        this.physic.radius += 0.05;
        this.spatial.position.x -= 0.05;
        this.spatial.position.y -= 0.05;
        this.health += 0.05;
    }
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
    } else if (this.currentState === "freed") {
        this.physic.velocity.reset(0, -150);
    }
    
    if (this.currentState === "freed" && this.spatial.position.y < 0) {
        FM.Game.switchState(new EndState("win"));
    }
    
    // If low on health then avoid player
    if (this.currentState !== "freed") {
        if (this.health <= 70) {
            this.renderer.play("avoid");
            this.currentState = "avoid";
        }
        // If high on health then attack
        if (this.health >= 120) {
            this.renderer.play("attack");
            this.currentState = "attack";
        }
        // If player out of bullets then attack
        if (this.avatar.bulletsLeft < 10 && this.health > 70) {
            this.renderer.play("attack");
            this.currentState = "attack"
        }
        // If player full of bullets then avoid
        if (this.avatar.bulletsLeft > 30 && this.health < 120) {
            this.renderer.play("avoid");
            this.currentState = "avoid";
        }
    }
    // Hit
    if (this.currentState !== "freed") {
        var collision = this.theThingType.overlapsWithType(this.bulletType);
        if (collision) {
            var objA = collision.a.owner,
                objB = collision.b.owner;
            if (objA.active || objB.active) {
                if (this.physic.radius > 8) {
                    this.health -= 10;
                    this.renderer.setWidth(this.renderer.getWidth() - 20);
                    this.renderer.setHeight(this.renderer.getHeight() - 20);
                    this.physic.radius -= 10;
                    this.spatial.position.x += 10;
                    this.spatial.position.y += 10;
                    if (objA.hasType(this.bulletType)) {
                        var emitterObj = new FM.GameObject(99);
                        emitterObj.addComponent(new FM.SpatialComponent(objA.components[FM.ComponentTypes.SPATIAL].position.x, objA.components[FM.ComponentTypes.SPATIAL].position.y, emitterObj));
                        var emitter = new FM.EmitterComponent(new FM.Vector(2, 2), emitterObj);
                        emitterObj.addComponent(emitter);
                        FM.Game.currentState.add(emitterObj);
                        emitter.createParticles(5, FM.AssetManager.getAssetByName("the_thing_particle"), 4, 4, 1, 99);
                        emitter.emit(2, -1, 5);
                        objA.kill();
                        objA.hide();
                        this.sound.play("the_thing_hit", 1, false);
                    } else if (objB.hasType(this.bulletType)) {
                        var emitterObj = new FM.GameObject(99);
                        emitterObj.addComponent(new FM.SpatialComponent(objB.components[FM.ComponentTypes.SPATIAL].position.x, objB.components[FM.ComponentTypes.SPATIAL].position.y, emitterObj));
                        var emitter = new FM.EmitterComponent(new FM.Vector(2, 2), emitterObj);
                        emitterObj.addComponent(emitter);
                        FM.Game.currentState.add(emitterObj);
                        emitter.createParticles(5, FM.AssetManager.getAssetByName("the_thing_particle"), 4, 4, 1, 99);
                        emitter.emit(2, -1, 5);
                        objB.kill();
                        objB.hide();
                        this.sound.play("the_thing_hit", 1, false);
                    }
                } else {
                    // Kill
                    if (objA.hasType(this.theThingType)) {
                        objA.kill();
                        objA.hide();
                        if (!this.sound.isPlaying("the_thing_hit")) {
                            this.sound.play("the_thing_hit");
                        }
                        FM.Game.switchState(new EndState("winlose"));
                    } else if (objB.hasType(this.theThingType)) {
                        objB.kill();
                        objB.hide();
                        if (!this.sound.isPlaying("the_thing_hit")) {
                            this.sound.play("the_thing_hit");
                        }
                        FM.Game.switchState(new EndState("winlose"));
                    }
                }
            }
        }
    }
};
/**
*
*/
TheThing.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.GameObject.prototype.destroy.call(this);
    this.bulletType.destroy();
    this.bulletType = null;
    this.theThingType.destroy();
    this.theThingType = null;
};