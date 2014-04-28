/*globals FM */
/**
 * The PlayState for creating gameplay.
 */
var PlayState = function () {
    "use strict";
    //Call parent constructor
    FM.State.call(this);
    /**
     * Game object types
     */
    this.avatarType = new FM.ObjectType("Avatar");
    this.wallType = new FM.ObjectType("Wall");
    this.bulletType = new FM.ObjectType("Bullet");
    this.theThingType = new FM.ObjectType("TheThing");
    this.availableBullets = [];
    /*
     * Game objects
     */
    this.avatar = new Avatar(this.avatarType, this.bulletType);
    this.theThing = new TheThing(this.theThingType, this.bulletType, this.avatar);
    this.ambiance = new FM.GameObject(0);
    
    //this.sharedResource = new SharedResource();
    this.cursor = new FM.GameObject(99);
    this.cursor.addComponent(new FM.SpatialComponent(FM.Game.getMouseX(), FM.Game.getMouseY(), this.cursor));
    this.cursor.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("cursor"), 10, 10, this.cursor));
    
    this.spawnTime = 0;
};
//PlayState inherits from FM.State
PlayState.prototype = Object.create(FM.State.prototype);
PlayState.prototype.constructor = PlayState;
/**
 * The init function inherited from FM.State.
 * Called first.
 */
PlayState.prototype.init = function () {
    "use strict";
    //Call parent method
    FM.State.prototype.init.call(this);

    //Init instructions
    this.ambiance.addComponent(new FM.AudioComponent(this.ambiance));
    this.ambiance.components[FM.ComponentTypes.SOUND].addSound(FM.AssetManager.getAssetByName("ambiance"));
    this.ambiance.components[FM.ComponentTypes.SOUND].play("ambiance", 0.4, true);
    this.add(this.ambiance);
    var background = new FM.GameObject(0);
    background.addComponent(new FM.SpatialComponent(0, 0, background));
    background.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("background"), 1024, 768, background));
    this.add(background);
    var bulletRack = new FM.GameObject(1);
    bulletRack.addComponent(new FM.SpatialComponent(410, 170, bulletRack));
    bulletRack.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("bullet_rack"), 200, 24, bulletRack));
    this.add(bulletRack);
    this.add(this.avatar);
    this.add(this.avatar.gun);
    this.add(this.theThing);
    //this.add(this.sharedResource);
    this.add(this.cursor);
    var wall = new FM.GameObject(9);
    wall.addComponent(new FM.SpatialComponent(168, 550, wall));
    wall.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("wall"), 50, 50, wall));
    wall.addComponent(new FM.AabbComponent(50, 50, wall));
    wall.addType(this.wallType);
    wall.components[FM.ComponentTypes.PHYSIC].setMass(0);
    wall.components[FM.ComponentTypes.PHYSIC].addTypeToCollideWith(this.avatarType);
    this.add(wall);
    wall = new FM.GameObject(9);
    wall.addComponent(new FM.SpatialComponent(800, 550, wall));
    wall.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("wall"), 50, 50, wall));
    wall.addComponent(new FM.AabbComponent(50, 50, wall));
    wall.addType(this.wallType);
    wall.components[FM.ComponentTypes.PHYSIC].setMass(0);
    wall.components[FM.ComponentTypes.PHYSIC].addTypeToCollideWith(this.avatarType);
    this.add(wall);
    // TODO why the avatar is going into the wall when coming from below ?
    wall = new FM.GameObject(9);
    wall.addComponent(new FM.SpatialComponent(168, 170, wall));
    wall.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("wall"), 50, 50, wall));
    wall.addComponent(new FM.AabbComponent(50, 50, wall));
    wall.addType(this.wallType);
    wall.components[FM.ComponentTypes.PHYSIC].setMass(0);
    wall.components[FM.ComponentTypes.PHYSIC].addTypeToCollideWith(this.avatarType);
    this.add(wall);
    wall = new FM.GameObject(9);
    wall.addComponent(new FM.SpatialComponent(800, 170, wall));
    wall.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("wall"), 50, 50, wall));
    wall.addComponent(new FM.AabbComponent(50, 50, wall));
    wall.addType(this.wallType);
    wall.components[FM.ComponentTypes.PHYSIC].setMass(0);
    wall.components[FM.ComponentTypes.PHYSIC].addTypeToCollideWith(this.avatarType);
    this.add(wall);
    this.prison = new FM.GameObject(9);
    //TODO SHAKES WITH float positions
    this.prison.addComponent(new FM.SpatialComponent(479.5, 351.5, this.prison));
    this.prison.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("prison"), 65, 65, this.prison));
    this.prison.addComponent(new FM.AabbComponent(65, 65, this.prison));
    this.prison.components[FM.ComponentTypes.PHYSIC].setMass(0);
    this.prison.components[FM.ComponentTypes.PHYSIC].addTypeToCollideWith(this.avatarType);
    this.prison.addComponent(new FM.AudioComponent(this.prison));
    this.prison.components[FM.ComponentTypes.SOUND].addSound(FM.AssetManager.getAssetByName("the_thing_hit"));
    this.prison.health = 40;
    this.add(this.prison);
    this.chain = new FM.GameObject(9);
    this.chain.addComponent(new FM.SpatialComponent(this.prison.components[FM.ComponentTypes.SPATIAL].position.x, this.prison.components[FM.ComponentTypes.SPATIAL].position.y, this.chain));
    this.chain.addComponent(new FM.LineRendererComponent(5, '#f00', this.chain));
    this.chain.components[FM.ComponentTypes.RENDERER].addPoint(new FM.Vector(this.prison.components[FM.ComponentTypes.SPATIAL].position.x + this.prison.components[FM.ComponentTypes.RENDERER].getWidth() / 2, this.prison.components[FM.ComponentTypes.SPATIAL].position.y + this.prison.components[FM.ComponentTypes.RENDERER].getHeight() / 2));
    this.chain.components[FM.ComponentTypes.RENDERER].addPoint(new FM.Vector(this.theThing.spatial.position.x + this.theThing.renderer.getWidth() / 2, this.theThing.spatial.position.y + this.theThing.renderer.getHeight() / 2));
    this.add(this.chain);
    
    this.soundSpawn = new FM.GameObject(0);
    this.soundSpawn.addComponent(new FM.SpatialComponent(0, 0, this.soundSpawn));
    this.soundSpawn.addComponent(new FM.AudioComponent(this.soundSpawn));
    this.soundSpawn.components[FM.ComponentTypes.SOUND].addSound(FM.AssetManager.getAssetByName("bullet_spawn"));
    this.add(this.soundSpawn);
    this.spawnBullets();
};
/**
 * The update function inherited from FM.State.
 * Called each frame.
 * @param {Number} dt Fixed delta time since the last frame.
 */
PlayState.prototype.update = function (dt) {
    "use strict";
    //Call parent method
    FM.State.prototype.update.call(this, dt);

    // Cursor
    this.cursor.components[FM.ComponentTypes.SPATIAL].position.x = FM.Game.getMouseX();
    this.cursor.components[FM.ComponentTypes.SPATIAL].position.y = FM.Game.getMouseY();
    
    // Chain
    this.chain.components[FM.ComponentTypes.RENDERER].points[1] = (new FM.Vector(this.theThing.spatial.position.x + this.theThing.renderer.getWidth() / 2, this.theThing.spatial.position.y + this.theThing.renderer.getHeight() / 2));
    
    // Bullets killed
    var collision = this.bulletType.overlapsWithType(this.wallType);
    if (collision) {
        var objA = collision.a.owner,
            objB = collision.b.owner;
        if (objA.hasType(this.bulletType)) {
            objA.kill();
            objA.hide();
        } else {
            objB.kill();
            objB.hide();
        }
    }
    // Bullets hit prison
    var collision = this.bulletType.overlapsWithObject(this.prison);
    if (collision) {
        var objA = collision.a.owner,
            objB = collision.b.owner,
            emitterObj = new FM.GameObject(99);
        this.add(emitterObj);
        if (objA.hasType(this.bulletType)) {
            emitterObj.addComponent(new FM.SpatialComponent(objA.components[FM.ComponentTypes.SPATIAL].position.x, objA.components[FM.ComponentTypes.SPATIAL].position.y, emitterObj));
            var emitter = new FM.EmitterComponent(new FM.Vector(2, 2), emitterObj);
            emitterObj.addComponent(emitter);
            objA.kill();
            objA.hide();
        } else {
            emitterObj.addComponent(new FM.SpatialComponent(objB.components[FM.ComponentTypes.SPATIAL].position.x, objB.components[FM.ComponentTypes.SPATIAL].position.y, emitterObj));
            var emitter = new FM.EmitterComponent(new FM.Vector(2, 2), emitterObj);
            emitterObj.addComponent(emitter);
            objB.kill();
            objB.hide();
        }
        this.prison.components[FM.ComponentTypes.SOUND].play("the_thing_hit", 1, false);
        emitter.createParticles(5, FM.AssetManager.getAssetByName("prison_particle"), 4, 4, 1, 99);
        emitter.emit(2, -1, 5);
        this.prison.health--;
    }
    // Retry
    if (FM.Game.isKeyPressed(FM.Keyboard.ESCAPE)) {
        FM.Game.switchState(new PlayState());
    }
    
    // Prison has no more health
    if (this.prison.health <= 0) {
        this.chain.kill();
        this.chain.hide();
        this.prison.kill();
        this.prison.hide();
        this.theThing.currentState = "freed";
        this.theThing.zIndex = 9;
        this.sortByZIndex();
        this.chain.kill();
        this.chain.hide();
    }
    
    // Retrieve bullets
    //TODO DONT WORK : var collision = this.bulletType.overlapsWithObject(this.avatar);
    var collision = this.bulletType.overlapsWithType(this.avatarType);
    if (collision) {
        var objA = collision.a.owner,
            objB = collision.b.owner;
        if (objA.hasType(this.bulletType) && !objA.active) {
            this.avatar.bulletsLeft++;
            objA.kill();
            objA.hide();
            for (var i = 0; i < 20; i++) {
                if (this.availableBullets[i] && this.availableBullets[i].getId() === objA.getId()) {
                    this.availableBullets.splice(i, 1);
                }
            }
            this.avatar.sound.play("bullet_picked", 0.3, false);
        } else if (objB.hasType(this.bulletType) && !objB.active) {
            this.avatar.bulletsLeft++;
            objB.kill();
            objB.hide();
            for (var i = 0; i < 20; i++) {
                if (this.availableBullets[i] && this.availableBullets[i].getId() === objB.getId()) {
                    this.availableBullets.splice(i, 1);
                }
            }
            this.avatar.sound.play("bullet_picked", 0.3, false);
        }
    }
    
    // Check if it is time to spawn bullets
    if (this.availableBullets.length === 0) {
        if (this.spawnTime >= 10) {
            this.spawnBullets();
        }
        this.spawnTime += dt;
    }
    // Avatar killed
    if (this.theThing.currentState !== "freed") {
        if (this.avatar.physic.overlapsWithObject(this.theThing.physic)) {
            this.avatar.gun.kill();
            this.avatar.gun.hide();
            this.avatar.kill();
            this.avatar.hide();
            FM.Game.switchState(new EndState("lost"));
            if (!this.avatar.sound.isPlaying("avatar_hit")) {
                this.avatar.sound.play("avatar_hit");
            }
        }
    }
};
PlayState.prototype.spawnBullets = function () {
    var i;
    for (i = 0; i < 20; i++) {
        this.availableBullets.push(new Bullet(new FM.Vector(i * 9 + 421, 180), this.bulletType, false));
        this.add(this.availableBullets[i]);
        this.sortByZIndex();
    }
    this.spawnTime = 0;
    if (!this.soundSpawn.components[FM.ComponentTypes.SOUND].isPlaying("bullet_spawn")) {
        this.soundSpawn.components[FM.ComponentTypes.SOUND].play("bullet_spawn", 0.3, false);
    }
};
/**
 * 
 */
PlayState.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.State.prototype.destroy.call(this);
};