import {MODULE_ID} from "../settings/consts.js";
import {cloneTileSprite, updateTileSprite} from "../core/sight.js";
import {getBoolFlag, pro_enabled} from "../../utils.js";

class TwoWayIndexMapSet {
    constructor() {
        this.index = new Map();
        this.items = null;
    }

    init(items) {
        this.items = items;
    }

    add(idList, id) {
        idList.forEach(reverse_id => {
                if (this.index.has(reverse_id) === false) {
                    this.index.set(reverse_id, new Set());
                }
                this.index.get(reverse_id).add(id);
            }
        );
    }

    set(id, list) {
        let setList = new Set(list);
        this.index.set(id, setList);
        this.items.add(setList, id);
    }

    reset() {
        this.index = new Map();
    }

    has(id) {
        return this.index.has(id);
    }

    get(id) {
        return this.index.get(id);
    }
}

class TwoWayIndex {
    init() {
        let a = new TwoWayIndexMapSet();
        let b = new TwoWayIndexMapSet();
        a.init(b);
        b.init(a);
        return [a, b];
    }
}

class IsoTiles {
    constructor() {
        [this.WallsToTile, this.TileToWalls] = new TwoWayIndex().init();

        [this.DoortoTile, this.TiletoDoor] = new TwoWayIndex().init();

        this.GhostTiles = new Map();
        this.update();
    }

    #reset() {
        this.WallsToTile.reset();
        this.TileToWalls.reset();

        this.DoortoTile.reset();
        this.TiletoDoor.reset();

        this.GhostTiles = new Map();
    }


    update() {
        this.#reset();

        canvas.tiles.objects?.children.filter(x => x.document.flags.hasOwnProperty(MODULE_ID) && x.document.flags[MODULE_ID] != null)
            .forEach(tile => { //iso_tiles
                    //get tile's walls
                    if (tile.document.flags[MODULE_ID].hasOwnProperty('attach_wall_id')) {
                        let walls = (tile.document.flags[MODULE_ID].attach_wall_id + '').split(',').filter(e => e);
                        if (walls.length > 0) {
                            this.TileToWalls.set(tile.document._id, walls);
                        }
                    }

                    //get tile's door
                    if (tile.document.flags[MODULE_ID].hasOwnProperty('hook_door_id')) {
                        let door = (tile.document.flags[MODULE_ID].hook_door_id + '').split(',').filter(e => e);
                        if (door.length > 0) {
                            this.TiletoDoor.set(tile.document._id, door)
                        }
                    }
                }
            );
    }

    isIsoTile(tile_id) {
        return this.TileToWalls.has(tile_id) || this.TiletoDoor.has(tile_id);
    }

    getIsoTiles() {
        return new Set([...this.TileToWalls.index.keys(), ...this.TiletoDoor.index.keys()]);
    }

    hasWall(wall_id) {
        return this.WallsToTile.has(wall_id);
    }

    hasTile(tile_id) {
        return this.TileToWalls.has(tile_id); //.length>1;
    }

    /* returns all tiles linked to the wall */
    getTiles(wall_id) {
        return this.WallsToTile.get(wall_id);
    }

    getDoor(tile_id) {
        return this.TiletoDoor.get(tile_id);
    }

    getOpenDoorsTiles() {
        return canvas.walls.objects.children.filter(x => this.DoortoTile.has(x.document.id) &&
            x.document.door === 1 && x.document.ds === 1).map(wall => this.DoortoTile.get(wall.document.id))
    }

    /*returns true if closed, false if open, undefined if no door is attached
    * ds 1 is open */
    isTileDoorOpen(tile_id) {
        let wall = canvas.walls.objects.children.filter(x => x.document.id === this.getDoor(tile_id))[0];
        if (wall === undefined || wall.document.door !== 1) return undefined;
        return (wall.document.ds === 1);
    }

}


export class Isostate {
    constructor() {
        this.tileMasks = new Map();
        this.visibleTiles = new Set();
        this.ghostTiles = new Set();
        this.IsoTiles = new IsoTiles();
        this.tokenMasks = new Map();
        this.tileSelector = pro_enabled() && game.user.isGM && (game.settings.get(MODULE_ID, 'enable_tile_selector')) ? IsometricPro.getTileSelector() : undefined;
        this.tokenOccluder = pro_enabled() && (game.settings.get(MODULE_ID, 'enable_token_occluder')) ? IsometricPro.getTokenOccluder() : undefined;
    }

    static getInstance(reset = false) {
        if (reset || !this.instance) {
            if (reset && this.instance && pro_enabled()) {
                this.instance.tileSelector?.destructor();
                this.instance.tokenOccluder?.destructor();
            }
            this.instance = new Isostate();
        }

        return this.instance;
    }

    getTileMask(tile_id) {
        let mask = this.tileMasks.get(tile_id);
        if (mask === undefined) {
            mask = cloneTileSprite(Isostate.#getTileFromId(tile_id));
            // mask.height*=1.005;// use this for high shadow quality due to feathering edges
            // mask.width*=1.1;// canvas.blend.something is the cause.
            this.tileMasks.set(tile_id, mask);
        }
        return mask;
    }

    static #getTileFromId(tile_id) {
        return canvas.tiles.objects.children.filter(x => x.document._id === tile_id)[0];
    }

    getTokenMask(token_id) {
        let mask = this.tokenMasks.get(token_id);
        let token_sprite = Isostate.#getTokenFromId(token_id);
        if (mask === undefined || mask.anchor == null) {
            mask = cloneTileSprite(token_sprite);
            // mask.height*=1.005; //use this for high shadow quality due to feathering edges
            // mask.width*=1.1; //canvas.blend.something is the cause.
            this.tokenMasks.set(token_id, mask);
        } else {
             if (!updateTileSprite(mask, token_sprite)) return null;
        }
        return mask;
    }

    static #getTokenFromId(token_id) {
        return canvas.tokens.objects.children.filter(x => x.document._id === token_id)[0];
    }

    clearVisible() {
        this.visibleTiles = new Set();
    }

    addVisible(tile_id) {
        this.visibleTiles.add(tile_id);
    }

    delVisible(tile_id) {
        this.visibleTiles.delete(tile_id);
    }

    getVisible() {
        return this.visibleTiles;
    }

    isVisible(tile_id) {
        return this.visibleTiles.has(tile_id);
    }

    testTilePixel(x, y) {
        this.tileSelector?.testPixel(x, y);
    }

    updateTileInIndex(tile_id) {
        this.tileSelector?.reindexTile(tile_id);
        this.tokenOccluder?.reindexTile(tile_id);
    }

    deleteTileFromIndex(tile_id) {
        this.tileSelector?.deleteTileFromIndex(tile_id);
        this.tokenOccluder?.deleteTileFromIndex(tile_id);
    }

    rebuildTileIndex() {
        this.tileSelector?.generateAlphaMaskIndex();
        this.tokenOccluder?.generateAlphaMaskIndex();
    }

    pixelPerfectTileContains(tile) {
        return this.tileSelector?.tileContains(tile);
    }

    pixelPerfectHoverTile(tile, hovered) {
        return this.tileSelector?.tileHover(tile, hovered);
    }

    tokenOcclusionRefreshToken(token, skip_visible = false) {
        return this.tokenOccluder?.refreshToken(token, skip_visible);
    }

    getMaskTexture() {
        return this.tokenOccluder?.getSpriteMask();
    }

    tokenOcclusionUpdateTiles() {
        this.tokenOccluder?.generateAlphaMaskIndex()
    }

    tokenOcclusionVisibleTiles() {
        debugger; //fix the ghost thing and stop using this, we need to update visibility on each tile from the sight hook or something
        return getBoolFlag(game.scenes.viewed, "is_linked_tiles_auto_occlude") ? new Set([...this.visibleTiles,...this.ghostTiles]) : new Set();
    }

    tokenOcclusionUpdateTileVisibility(tile_id,visible){
        if (getBoolFlag(game.scenes.viewed, "is_linked_tiles_auto_occlude")) this.tokenOccluder?.updateTileVisibility(tile_id, visible);
    }


    clearVisibleGhost() {
        this.ghostTiles = new Set();
    }

    addVisibleGhost(tile_id) {
        this.ghostTiles.add(tile_id);
    }

    delVisibleGhost(tile_id) {
        this.ghostTiles.delete(tile_id);
    }

    getVisibleGhost() {
        return this.ghostTiles;
    }

    isVisibleGhost(tile_id) {
        return this.ghostTiles.has(tile_id);
    }

}