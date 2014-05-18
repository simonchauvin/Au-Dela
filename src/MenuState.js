/*globals FM */
/**
 * The MenuState for creating title, menu and stuff.
 */
var MenuState = function () {
    "use strict";
    //Call parent constructor
    FM.State.call(this);
    /*
     * The title of the game.
     */
    this.title = new FM.GameObject(10);
    this.cursor = new FM.GameObject(99);
    /**
     * Instructions
     */
    this.instructions = new FM.GameObject(10);
    this.tuto = new FM.GameObject(10);
};
//MenuState inherits from FM.State
MenuState.prototype = Object.create(FM.State.prototype);
MenuState.prototype.constructor = MenuState;
/**
 * The init function inherited from FM.State.
 * Called first.
 */
MenuState.prototype.init = function () {
    "use strict";
    //Call parent method
    FM.State.prototype.init.call(this);

    FM.Game.setBackgroundColor("rgb(255,255,255)");

    this.cursor.addComponent(new FM.SpatialComponent(FM.Game.getMouseX(), FM.Game.getMouseY(), this.cursor));
    this.cursor.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("cursor"), 10, 10, this.cursor));
    this.add(this.cursor);

    //Init instructions
    //Add a spatial component to the title to specify a position
    this.title.addComponent(new FM.SpatialComponent(100, 100, this.title));
    //Add a text renderer component to the title to display a text
    this.title.addComponent(new FM.TextRendererComponent("---- AU DELA ----", this.title));
    //Format the title by calling the setFormat method of the renderer component
    this.title.components[FM.ComponentTypes.RENDERER].setFormat('#f00', '60px sans-serif', 'middle');
    //Add the title to the MenuState to have the engine display and update it
    this.add(this.title);
    //Add a spatial component to the title to specify a position
    this.instructions.addComponent(new FM.SpatialComponent(380, 320, this.instructions));
    //Add a text renderer component to the title to display a text
    this.instructions.addComponent(new FM.TextRendererComponent("/* Mouse click to start */", this.instructions));
    this.instructions.components[FM.ComponentTypes.RENDERER].setFormat('#000', '30px sans-serif', 'middle');
    //Add the title to the MenuState to have the engine display and update it
    this.add(this.instructions);
    this.tuto.addComponent(new FM.SpatialComponent(100, 450, this.tuto));
    this.tuto.addComponent(new FM.TextRendererComponent("| WASD to move |", this.tuto));
    this.tuto.components[FM.ComponentTypes.RENDERER].setFormat('#000', '20px sans-serif', 'middle');
    this.add(this.tuto);
    this.tuto = new FM.GameObject(10);
    this.tuto.addComponent(new FM.SpatialComponent(100, 500, this.tuto));
    this.tuto.addComponent(new FM.TextRendererComponent("| Mouse to aim |", this.tuto));
    this.tuto.components[FM.ComponentTypes.RENDERER].setFormat('#000', '20px sans-serif', 'middle');
    this.add(this.tuto);
    this.tuto = new FM.GameObject(10);
    this.tuto.addComponent(new FM.SpatialComponent(100, 550, this.tuto));
    this.tuto.addComponent(new FM.TextRendererComponent("| Short mouse click to shoot a slow bullet |", this.tuto));
    this.tuto.components[FM.ComponentTypes.RENDERER].setFormat('#000', '20px sans-serif', 'middle');
    this.add(this.tuto);
    this.tuto = new FM.GameObject(10);
    this.tuto.addComponent(new FM.SpatialComponent(100, 600, this.tuto));
    this.tuto.addComponent(new FM.TextRendererComponent("| Long mouse click to shoot a fast bullet |", this.tuto));
    this.tuto.components[FM.ComponentTypes.RENDERER].setFormat('#000', '20px sans-serif', 'middle');
    this.add(this.tuto);
    this.tuto = new FM.GameObject(10);
    this.tuto.addComponent(new FM.SpatialComponent(100, 650, this.tuto));
    this.tuto.addComponent(new FM.TextRendererComponent("| SPACE to boost speed for a few seconds |", this.tuto));
    this.tuto.components[FM.ComponentTypes.RENDERER].setFormat('#000', '20px sans-serif', 'middle');
    this.add(this.tuto);
    this.tuto = new FM.GameObject(10);
    this.tuto.addComponent(new FM.SpatialComponent(100, 700, this.tuto));
    this.tuto.addComponent(new FM.TextRendererComponent("| Esc to retry |", this.tuto));
    this.tuto.components[FM.ComponentTypes.RENDERER].setFormat('#000', '20px sans-serif', 'middle');
    this.add(this.tuto);
};
/**
 * The update function inherited from FM.State.
 * Called each frame.
 * @param {Number} dt Fixed delta time since the last frame.
 */
MenuState.prototype.update = function (dt) {
    "use strict";
    //Call parent method
    FM.State.prototype.update.call(this, dt);
    
    // Cursor
    this.cursor.components[FM.ComponentTypes.SPATIAL].position.x = FM.Game.getMouseX();
    this.cursor.components[FM.ComponentTypes.SPATIAL].position.y = FM.Game.getMouseY();
    
    FM.Game.setBackgroundColor("rgb(255,255,255)");

    //Update instructions
    //Switch to the PlayState if the player press the SPACE key
    if (FM.Game.isMouseClicked()) {
        FM.Game.switchState(new PlayState());
    }
};