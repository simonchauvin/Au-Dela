/*globals FM */
/**
* An entity.
*/
var Avatar = function (avatarType, bulletType) {
    "use strict";
    //Call parent constructor, provide the z index
    FM.GameObject.call(this, 10);
    this.addType(avatarType)
    //Add components to the game object
    this.spatial = new FM.SpatialComponent(100, 200, this);
    this.addComponent(this.spatial);
    this.renderer = new FM.AnimatedSpriteRendererComponent(FM.AssetManager.getAssetByName("avatar"), 72, 35, this);
    this.addComponent(this.renderer);
    this.physic = new FM.CircleComponent(30, this);
    this.physic.offset.x += 6;
    this.physic.offset.y -= 12;
    this.addComponent(this.physic);
    this.gun = new FM.GameObject(11);
    this.gunSpatial = new FM.SpatialComponent(this.spatial.position.x + this.physic.radius + 2.5, this.spatial.position.y + this.physic.radius - 25, this.gun);
    this.gun.addComponent(this.gunSpatial);
    this.gun.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("gun"), 5, 20, this.gun));
    this.gun.components[FM.ComponentTypes.RENDERER].rotationCenter = new FM.Vector(1, 18);
    
    this.bulletType = bulletType;
    
    this.SPEED = 150;
    this.bulletsLeft = 50;
    this.bullets = [];
    this.bullet = null;
    this.shootTime = 0;
};
//PlayState inherits from FM.State
Avatar.prototype = Object.create(FM.GameObject.prototype);
Avatar.prototype.constructor = Avatar;
/**
* The update function inherited from FM.State.
* Called each frame.
* @param {Number} dt Fixed delta time since the last frame.
*/
Avatar.prototype.update = function (dt) {
    "use strict";
    // Keep gun attached to the avatar
    this.gunSpatial.position.x = this.spatial.position.x + this.physic.radius + 2.5;
    this.gunSpatial.position.y = this.spatial.position.y + this.physic.radius - 25;
    // Gun rotating
    var position = new FM.Vector(this.spatial.position.x + this.physic.offset.x + this.physic.radius, this.spatial.position.y + this.physic.offset.y + this.physic.radius),
        mousePosition = new FM.Vector(FM.Game.getMouseX(), FM.Game.getMouseY()),
        cursorDistance = new FM.Vector(this.gunSpatial.position.x - (mousePosition.x), this.gunSpatial.position.y - (mousePosition.y));
    // Rotating
    if (cursorDistance.y < 0) {
        this.gunSpatial.angle = -Math.acos(cursorDistance.x / Math.sqrt(cursorDistance.x * cursorDistance.x + cursorDistance.y * cursorDistance.y)) + Math.PI / 2;
    } else {
        this.gunSpatial.angle = Math.acos(cursorDistance.x / Math.sqrt(cursorDistance.x * cursorDistance.x + cursorDistance.y * cursorDistance.y)) + Math.PI / 2;
    }
    // Speed
    if (FM.Game.isKeyPressed(FM.Keyboard.W)) {
        this.physic.velocity = new FM.Vector(Math.cos(this.spatial.angle - Math.PI / 2) * this.SPEED, Math.sin(this.spatial.angle - Math.PI / 2) * this.SPEED);
    }
    if (FM.Game.isKeyPressed(FM.Keyboard.S)) {
        this.physic.velocity = new FM.Vector(Math.cos(this.spatial.angle - Math.PI / 2) * -this.SPEED, Math.sin(this.spatial.angle - Math.PI / 2) * -this.SPEED);
    }
    if (!FM.Game.isKeyPressed(FM.Keyboard.W) && !FM.Game.isKeyPressed(FM.Keyboard.S)) {
        this.physic.velocity.x = 0;
        this.physic.velocity.y = 0;
    }
    // Straff left
    if (FM.Game.isKeyPressed(FM.Keyboard.A)) {
        //console.log(this.spatial.angle * 180 / Math.PI);
        //console.log((this.spatial.angle - (Math.PI / 2)) * cursorDistance.x);
        this.spatial.angle -= 0.1;
        //this.physic.velocity = new FM.Vector((this.spatial.angle + (Math.PI / 2)) * cursorDistance.x, (this.spatial.angle + (Math.PI / 2)) * cursorDistance.y);
    }
    // Straff right
    if (FM.Game.isKeyPressed(FM.Keyboard.D)) {
        this.spatial.angle += 0.1;
    }
    // Put down
    /*if (FM.Game.isMouseClicked()) {
        if (this.shootTime === 0) {
            this.bullet = new Bullet(position, this.bulletType);
            FM.Game.currentState.add(this.bullet);
        }
    }*/
    // Shoot
    if (FM.Game.isMousePressed() && this.shootTime < 0.8 && this.bulletsLeft > 0) {
        if (this.bullet === null) {
            this.bullet = new Bullet(position, this.bulletType, true);
        }
        this.shootTime += dt;
    }
    if (FM.Game.isMouseReleased()) {
        if (this.bullet) {
            this.bullet.spatial.position = position;
            /*if (mousePosition.x > this.gunSpatial.position.x) {
                this.bullet.spatial.position.x -= 10 * Math.tan(this.gunSpatial.angle);
            } else if (mousePosition.x < this.gunSpatial.position.x) {
                this.bullet.spatial.position.x += -10 * Math.tan(this.gunSpatial.angle);
            }
            if (mousePosition.y > this.gunSpatial.position.y) {
                this.bullet.spatial.position.y -= 10 / Math.tan(this.gunSpatial.angle);
            } else if (mousePosition.y < this.gunSpatial.position.y) {
                this.bullet.spatial.position.y += -10 / Math.tan(this.gunSpatial.angle);
            }*/
            
            var bulletPos = this.bullet.components[FM.ComponentTypes.SPATIAL].position,
                bulletPhysic = this.bullet.components[FM.ComponentTypes.PHYSIC],
                xDiff = Math.abs(bulletPos.x - mousePosition.x),
                yDiff = Math.abs(bulletPos.y - mousePosition.y),
                coeff,
                desiredSpeed = new FM.Vector(0, 0);
            if (xDiff < yDiff) {
                coeff = xDiff / yDiff;
                desiredSpeed.x = 300 * coeff;
                desiredSpeed.y = 300;
            } else if (xDiff > yDiff) {
                coeff = yDiff / xDiff;
                desiredSpeed.x = 300;
                desiredSpeed.y = 300 * coeff;
            } else {
                desiredSpeed.x = 300;
                desiredSpeed.y = 300;
            }
            if (mousePosition.x < bulletPos.x) {
                bulletPhysic.velocity.x = -desiredSpeed.x;
            } else if (mousePosition.x > bulletPos.x) {
                bulletPhysic.velocity.x = desiredSpeed.x;
            } else {
                bulletPhysic.velocity.x = 0;
            }
            if (mousePosition.y < bulletPos.y) {
                bulletPhysic.velocity.y = -desiredSpeed.y;
            } else if (mousePosition.y > bulletPos.y) {
                bulletPhysic.velocity.y = desiredSpeed.y;
            } else {
                bulletPhysic.velocity.y = 0;
            }
            if (this.shootTime < 0.2) {
                bulletPhysic.velocity.x *= this.shootTime;
                bulletPhysic.velocity.y *= this.shootTime;
            } else {
                bulletPhysic.velocity.x *= 0.2 + this.shootTime;
                bulletPhysic.velocity.y *= 0.2 + this.shootTime;
            }
            FM.Game.currentState.add(this.bullet);
            this.bullets.push(this.bullet);
            this.bullet = null;
            this.bulletsLeft--;
            FM.Game.currentState.sortByZIndex();
        }
        this.shootTime = 0;
    }
    // Gain new bullets
};
/**
*
*/
Avatar.prototype.destroy = function () {
    "use strict";
    //Call parent method
    FM.GameObject.prototype.destroy.call(this);

    //Remove the references
};