/*globals FM */
/**
 * The MenuState for creating title, menu and stuff.
 */
var EndState = function (status) {
    "use strict";
    //Call parent constructor
    FM.State.call(this);
    
    this.status = status;
    
    /*
     * The title of the game.
     */
    this.title = new FM.GameObject(10);
    this.cursor = new FM.GameObject(99);
    /**
     * Instructions
     */
    this.instructions = new FM.GameObject(10);
};
//MenuState inherits from FM.State
EndState.prototype = Object.create(FM.State.prototype);
EndState.prototype.constructor = EndState;
/**
 * The init function inherited from FM.State.
 * Called first.
 */
EndState.prototype.init = function () {
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
    this.title.addComponent(new FM.TextRendererComponent("---- THE END ----", this.title));
    //Format the title by calling the setFormat method of the renderer component
    this.title.components[FM.ComponentTypes.RENDERER].setFormat('#f00', '60px sans-serif', 'middle');
    //Add the title to the MenuState to have the engine display and update it
    this.add(this.title);
    //Add a spatial component to the title to specify a position
    this.instructions.addComponent(new FM.SpatialComponent(380, 320, this.instructions));
    //Add a text renderer component to the title to display a text
    var text = "";
    if (this.status === "lost") {
        text = "/* You lost */";
    } else if (this.status === "winlose") {
        text = "/* You killed the thing... */";
    } else {
        text = "/* The thing is free! */";
    }
    this.instructions.addComponent(new FM.TextRendererComponent(text, this.instructions));
    this.instructions.components[FM.ComponentTypes.RENDERER].setFormat('#000', '30px sans-serif', 'middle');
    //Add the title to the MenuState to have the engine display and update it
    this.add(this.instructions);
    this.instructions = new FM.GameObject(10);
    this.instructions.addComponent(new FM.SpatialComponent(380, 440, this.instructions));
    this.instructions.addComponent(new FM.TextRendererComponent("Esc to retry", this.instructions));
    this.instructions.components[FM.ComponentTypes.RENDERER].setFormat('#000', '30px sans-serif', 'middle');
    //Add the title to the MenuState to have the engine display and update it
    this.add(this.instructions);
};
/**
 * The update function inherited from FM.State.
 * Called each frame.
 * @param {Number} dt Fixed delta time since the last frame.
 */
EndState.prototype.update = function (dt) {
    "use strict";
    //Call parent method
    FM.State.prototype.update.call(this, dt);
    
    // Cursor
    this.cursor.components[FM.ComponentTypes.SPATIAL].position.x = FM.Game.getMouseX();
    this.cursor.components[FM.ComponentTypes.SPATIAL].position.y = FM.Game.getMouseY();
    
    FM.Game.setBackgroundColor("rgb(255,255,255)");

    //Update instructions
    //Switch to the PlayState if the player press the SPACE key
    if (FM.Game.isKeyPressed(FM.Keyboard.ESCAPE)) {
        FM.Game.switchState(new PlayState());
    }
};