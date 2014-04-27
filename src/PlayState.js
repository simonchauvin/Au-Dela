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
    this.bulletType = new FM.ObjectType("Bullet");
    this.theThingType = new FM.ObjectType("TheThing");
    this.availableBullets = [];
    /*
     * Game objects
     */
    this.avatar = new Avatar(this.avatarType, this.bulletType);
    this.theThing = new TheThing(this.theThingType, this.bulletType, this.avatar);
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

    // Avatar killed
    if (this.avatar.physic.overlapsWithObject(this.theThing.physic)) {
        this.avatar.gun.kill();
        this.avatar.gun.hide();
        this.avatar.kill();
        this.avatar.hide();
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
        } else if (objB.hasType(this.bulletType) && !objB.active) {
            this.avatar.bulletsLeft++;
            objB.kill();
            objB.hide();
            for (var i = 0; i < 20; i++) {
                if (this.availableBullets[i] && this.availableBullets[i].getId() === objB.getId()) {
                    this.availableBullets.splice(i, 1);
                }
            }
        }
    }
    
    // Check if it is time to spawn bullets
    if (this.availableBullets.length === 0) {
        if (this.spawnTime >= 10) {
            this.spawnBullets();
        }
        this.spawnTime += dt;
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
};
/**
 * 
 */
PlayState.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.State.prototype.destroy.call(this);

    //Remove the references
    this.entity = null;
};