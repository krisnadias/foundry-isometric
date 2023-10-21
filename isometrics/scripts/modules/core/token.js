import {getBoolFlag, getValueFlag, is_viewed_scene_iso} from "../../utils.js";
import {Isostate} from "../pro/isostate.js";
import {ISOMETRIC_CONVERSION, MODULE_ID} from "../settings/consts.js";

export function refreshToken(token, _something) {
    if (!is_viewed_scene_iso()) return;
    if (getBoolFlag(token.document, 'disable_isometric_token', false, false)) return;
    let mesh = token.mesh;
    mesh.angle = 45
    const x= token.getData(scale);
    //mesh.scale.set(x * 1.4, x * 1.4);
    mesh.height =x*1.4
    mesh.width =x*1.4

    const elevation = game.settings.get(MODULE_ID, 'token_elevation') ? ((canvas.scene.grid.distance / token.document.elevation) * (token.document.height * token.document.texture.scaleY)) : Infinity;

    switch (getValueFlag(token.document, "original_image_projection_type", "true_isometric")) {
        case "topdown":
            break;
        case "true_isometric":
            mesh.height *= (ISOMETRIC_CONVERSION);
            mesh.anchor.set(0.5, 0.69 + (0.63 / elevation))
            break;
        case "dimetric":
            mesh.height *= 2
            mesh.anchor.set(0.5, 0.75 + (0.505 / elevation))
            break;
    }

    Isostate.getInstance().tokenOcclusionRefreshToken(token);
}


export function drawToken(token) {
    if (canvas.ready && (game.settings.get(MODULE_ID, 'token_draw_above_ui'))) {
        draw_token_above_ui(token);
    }

}

export function targetToken(_user, token) {
    if (canvas.ready && (game.settings.get(MODULE_ID, 'token_draw_above_ui'))) {
        draw_token_above_ui(token);
    }
}


export function createToken(token) {
    if (!is_viewed_scene_iso()) return;

    // ugly hack since foundry calls hooks before loading meshes and stuff
    setTimeout(() => {
        Isostate.getInstance().tokenOcclusionRefreshToken(token, true)
    }, 2 << 5);



}


export function deleteToken(token) {
    if (!is_viewed_scene_iso()) return;

    let m = Isostate.getInstance().getTokenMask(token.id);
    if (m) canvas.masks.vision.removeChild(m);
}


export function activateTokenLayer(tokenLayer) {
    if (canvas.ready && (game.settings.get(MODULE_ID, 'token_draw_above_ui'))) {
        tokenLayer.objects.children.forEach(token => draw_token_above_ui)
    }
}

function draw_token_above_ui(token) {
    if (!token || !token.bars || !token.effects || !token.target) return;
    token.bars.filters = [canvas.interface.reverseMaskfilter];
    token.effects.filters = [canvas.interface.reverseMaskfilter];
    token.target.filters = [canvas.interface.reverseMaskfilter];
}
