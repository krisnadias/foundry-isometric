import {Isostate} from "../pro/isostate.js";
import {getValueFlag, is_viewed_scene_iso} from "../../utils.js";
import {MODULE_ID} from "../settings/consts.js";

export async function preCreateTile(tileDocument) {
    if (!is_viewed_scene_iso()) return;
    // also if iso flip enabled
    let {x, y} = canvas.primary.background.transform.scale
    await tileDocument.updateSource({rotation: 45, texture: {scaleX: x, scaleY: y}})
}
export async function createTile(tile) {
    if (!is_viewed_scene_iso()) return;

    //fix for a bug where tile is created but the texture is not yet loaded
    await tile.object.draw();
    //fix for a bug where tile is drawn and the handler is calculated wrong
    await tile.object.draw();
    Isostate.getInstance().rebuildTileIndex();
}
export function deleteTile(tileDocument) {
    if (!is_viewed_scene_iso()) return;

    let m = Isostate.getInstance().getTileMask(tileDocument._id);
    if (m) canvas.masks.vision.removeChild(m);


    Isostate.getInstance().deleteTileFromIndex(tileDocument._id);
}
export function updateTile(tile, changed) {
    if (!is_viewed_scene_iso()) return;

    if (changed.hasOwnProperty('flags') && changed.flags[MODULE_ID] !== undefined) {
        Isostate.getInstance().IsoTiles.update();
    }
    Isostate.getInstance().updateTileInIndex(tile._id);
}

// todo! lancer uses vision without fog,
//  the only solution i found is using
//  a global light that provides vision,
//  maybe it's somehhow helpful to do this.
export function refreshTile(tile) {

    // regular test and if not controlled(for working handler) graphicindex test
    Isostate.getInstance().pixelPerfectTileContains(tile);

    if (!is_viewed_scene_iso()) return;

    if (canvas.tokens.controlled.length === 0 || Isostate.getInstance().IsoTiles.isIsoTile(tile.document.id)===false) return;
    if (Isostate.getInstance().getVisible().has(tile.document.id) === false) {
        let tile_above_alpha_value = getValueFlag(tile.document, 'tile_alpha')
        if (tile_above_alpha_value !== null) {
            tile.mesh.alpha = tile_above_alpha_value;
        }
    }
    // if (changed.hasOwnProperty('flags') && changed.flags[MODULE_ID] !== undefined) {
    //     Isostate.getInstance().IsoTiles.
    // }
}

export function hoverTile(tile, hovered) {
    Isostate.getInstance().pixelPerfectHoverTile(tile, hovered)
}


// export async function activateTilesLayer(layer) {
//     layer.objects.children.forEach(c => {
//         console.error(c.hitArea.contains.toString())
//         c.hitArea.contains = function (x, y) {
//             const tempPoint = {x: 0, y: 0}
//             let glob = c.toGlobal(new PIXI.Point(x,y));
//             canvas.stage.worldTransform.applyInverse(glob, tempPoint);
//             return (c.document._id === Isostate.getInstance().testTilePixel(tempPoint.x, tempPoint.y))
//         }
//     });
// }


export async function activateTilesLayer(layer) {
    // let is = Isostate.getInstance();
    //
    // is.tokenOcclusionUpdateTiles();
    // layer.objects.children.forEach(c => {
    //     c.hitArea = undefined;
    //     c.containsPoint = function (point) {
    //         const tempPoint = {x: 0, y: 0}
    //
    //         canvas.stage.worldTransform.applyInverse(point, tempPoint);
    //
    //         return (this.document._id === Isostate.getInstance().testTilePixel(tempPoint.x, tempPoint.y))
    //
    //     }
    // });
}

