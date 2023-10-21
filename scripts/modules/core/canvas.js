import {getValueFlag, is_viewed_scene_iso} from "../../utils.js";
import {Isostate} from "../pro/isostate.js";
import {DIMETRIC_CONVERSION, DUNGEON_BUILDER_CONVERSION, ISOMETRIC_CONVERSION, MODULE_ID} from "../settings/consts.js";
import {hideAllTiles} from "./sight.js";


export async function canvasReady() {
    if (is_viewed_scene_iso()) {
        let saved_pan_x = canvas.stage.pivot.x;
        let saved_pan_y = canvas.stage.pivot.y;
        let saved_pan_zoom = canvas.stage.scale.x;
        canvas.app.stage.scale.x = 1;
        canvas.app.stage.scale.y = 1;


        await canvas.app.stage.skew.set(30 * (Math.PI / 180), 0);
        canvas.app.stage.rotation = await -30 * (Math.PI / 180);


        await canvas.pan({
            x: Math.floor(canvas.dimensions.width / 2), y: Math.floor(canvas.dimensions.height / 2), scale: 1
        });


        switch (getValueFlag(canvas.scene, "background_image_projection_type", "true_isometric")) {
            case "topdown":
                break;
            case "true_isometric":
                await set_bg_sprite_to_iso(canvas.environment.primary.background)
                await set_bg_sprite_to_iso(canvas.environment.primary.foreground)
                break;
            case "dimetric":
                await set_bg_sprite_to_iso(canvas.environment.primary.background)
                await set_bg_sprite_to_iso(canvas.environment.primary.foreground)

                canvas.environment.primary.background.width /= DIMETRIC_CONVERSION
                canvas.environment.primary.foreground.width /= DIMETRIC_CONVERSION
                break;
            case "dungeon_builder":
                await set_bg_sprite_to_iso(canvas.environment.primary.background)
                await set_bg_sprite_to_iso(canvas.environment.primary.foreground)

                canvas.environment.primary.background.width /= DUNGEON_BUILDER_CONVERSION
                canvas.environment.primary.foreground.width /= DUNGEON_BUILDER_CONVERSION
                break;
        }

        await canvas.pan({x: saved_pan_x, y: saved_pan_y, scale: saved_pan_zoom});
    } else {
        await canvas.app.stage.skew.set(0 * (Math.PI / 180), 0);
        canvas.app.stage.rotation = await 0 * (Math.PI / 180);
    }
    //todo: this
    // await canvas.lighting.refresh();
    // await canvas.sight.refresh();
    // await canvas.perception.refresh()

    // Update IsoState
    let is = Isostate.getInstance(true);
    is.IsoTiles.update();
    hideAllTiles(is.IsoTiles.getIsoTiles());
    if (canvas.ready && (game.settings.get(MODULE_ID, 'grid_draw_below_tiles_tokens'))) {
        canvas.primary.addChildAt(canvas.interface.grid.grid, 0);
    }

    // load occlusion filters:
    canvas.tokens.placeables.forEach(x=>is.tokenOcclusionRefreshToken(x,true));
    return true;

}


async function set_bg_sprite_to_iso(bg) {
    await bg.anchor.set(0.5, 0.5);
    await bg.transform.scale.set(1, 1);

    await bg.transform.setFromMatrix(canvas.stage.transform.worldTransform.invert())

    const s = canvas.scene;
    let padding = s.padding;
    const paddingX = s.width * padding
    const paddingY = s.height * padding
    const offsetX = s.background.offsetX;
    const offsetY = s.background.offsetY;
    await bg.position.set((s.width / 2) + paddingX + offsetX, (s.height / 2) + paddingY + offsetY);
}


export function dropCanvasData(canvas, dropped_obj) {
    if (!is_viewed_scene_iso()) return;
    let {x, y} = canvas.stage.worldTransform.applyInverse({x: event.clientX, y: event.clientY})

    dropped_obj.x = Math.round(x)
    dropped_obj.y = Math.round(y);


    return true;
}


export function renderBasePlaceableHUD(hud, _cssHud, obj) {
    if (!is_viewed_scene_iso()) return;
    const {top: parentTop, left: parentLeft} = _cssHud.parent().position();
    let worldScale = canvas.stage.scale.x;

    // get object converted position
    const {x: objectNewX, y: objectNewY} = canvas.stage.worldTransform.apply({x: obj.x, y: obj.y});

    let centerY = _cssHud.height() / (ISOMETRIC_CONVERSION * 2);
    let whratio = _cssHud.width() / _cssHud.height() * ISOMETRIC_CONVERSION;

    let centerX = centerY / whratio;
    hud.object.x =(objectNewX - parentLeft)/worldScale;
    hud.object.y = (objectNewY - parentTop)/worldScale;
    hud.object.x +=centerX;
    hud.object.y -=centerY;
    hud.object.x = Math.floor(hud.object.x);
    hud.object.y = Math.floor(hud.object.y);
    return true;
}


export function GridConfigRefresh(thas, old_bg_w, old_bg_h, {background = false, grid}) {
    if (!is_viewed_scene_iso()) return;
    const bg = canvas.primary.background;
    const fg = canvas.primary.foreground;
    const d = thas.object.getDimensions();
    const s = canvas.scene;
    let padding = s.padding;
    const paddingX = s.width * padding
    const paddingY = s.height * padding

    if (background && bg) {
        bg.position.set(d.width / 2 - (d.sceneX) + paddingX, d.height / 2 - (d.sceneY) + paddingY);

        bg.width = old_bg_w;
        bg.height = old_bg_h;
    }
    if (background && fg) {
        fg.position.set(d.width / 2 - (d.sceneX) + paddingX, d.height / 2 - (d.sceneY) + paddingY);

        fg.width = old_bg_w;
        fg.height = old_bg_h;
    }

}

export async function updateScene(scene, changed) {
    if (!scene.isView) return;
    if (changed.hasOwnProperty('flags') && changed.flags[MODULE_ID] !== undefined) {

        // avoids a double redraw bug
        const redraw = ["foreground", "fogOverlay", "width", "height", "padding",     // Scene Dimensions
            "grid.type", "grid.size", "grid.distance", "grid.units",                  // Grid Configuration
            "drawings", "lights", "sounds", "templates", "tiles", "tokens", "walls",  // Placeable Objects
            "weather"                                                                 // Ambience
        ];
        const flat_changed = flattenObject(changed);
        if (redraw.some(k => flat_changed.hasOwnProperty(k))) return;


        await canvas.draw();
    }
}

export function _handleMovement(wrapped, context, layer) {
    if (!is_viewed_scene_iso() || !game.settings.get(MODULE_ID, 'isoKeyboard')) return wrapped(context, layer);

    if (!this.moveKeys.size) return;

    // Get controlled objects
    let objects = layer.placeables.filter(o => o.controlled);
    if (objects.length === 0) return;

    // Define movement offsets and get moved directions
    const directions = this.moveKeys;
    let dx = 0;
    let dy = 0;

    // Assign movement offsets
    if (directions.has(ClientKeybindings.MOVEMENT_DIRECTIONS.LEFT)) {
        dx -= 1;
        dy -= 1;
    } else if (directions.has(ClientKeybindings.MOVEMENT_DIRECTIONS.RIGHT)) {
        dx += 1;
        dy += 1;
    }
    if (directions.has(ClientKeybindings.MOVEMENT_DIRECTIONS.UP)) {
        dy -= 1;
        dx += 1;
    } else if (directions.has(ClientKeybindings.MOVEMENT_DIRECTIONS.DOWN)) {
        dy += 1;
        dx -= 1;
    }

    dy /= directions.size;
    dx /= directions.size;

    // Perform the shift or rotation
    layer.moveMany({dx, dy, rotate: context.isShift});
}

export function _handleCanvasPan(wrapped) {
    if (!is_viewed_scene_iso() || !game.settings.get(MODULE_ID, 'isoPan')) return wrapped();

    // Determine movement offsets
    let dx = 0;
    let dy = 0;
    if (this.moveKeys.has(ClientKeybindings.MOVEMENT_DIRECTIONS.LEFT)) {
        dx -= 1;
        dy -= 1;
    }
    if (this.moveKeys.has(ClientKeybindings.MOVEMENT_DIRECTIONS.UP)) {
        dy -= 1;
        dx += 1;
    }
    if (this.moveKeys.has(ClientKeybindings.MOVEMENT_DIRECTIONS.RIGHT)) {
        dx += 1;
        dy += 1;
    }
    if (this.moveKeys.has(ClientKeybindings.MOVEMENT_DIRECTIONS.DOWN)) {
        dy += 1;
        dx -= 1;
    }

    // Clear the pending set
    this.moveKeys.clear();

    // Pan by the grid size
    const s = canvas.dimensions.size;
    return canvas.animatePan({
        x: canvas.stage.pivot.x + (dx * s), y: canvas.stage.pivot.y + (dy * s), duration: 100
    });
}


export function _setPosition(wrapped, token, html, dimensions) {
    if (!is_viewed_scene_iso()) return wrapped(token, html, dimensions);

    let glob = token.toGlobal(new PIXI.Point(0));
    let point = new PIXI.Point(canvas.app.stage.localTransform.tx, canvas.app.stage.localTransform.ty);
    let ratio = canvas.app.stage.scale.x;
    let newx = (glob.x - point.x) / ratio;
    let newy = (glob.y - point.y) / ratio;


    let cls = Math.random() > 0.5 ? "left" : "right";
    html.addClass(cls);
    const pos = {
        height: dimensions.height, width: dimensions.width, top: newy - dimensions.height - 8
    };
    if (cls === "right") pos.left = newx - (dimensions.width - token.w); else pos.left = newx;
    html.css(pos);
}