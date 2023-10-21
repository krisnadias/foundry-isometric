import {settingsConfigurationHook} from "../settings/module/init.js";
import {getHash, isDebug} from "../../utils.js";
import {
    _handleCanvasPan,
    _handleMovement,
    _setPosition,
    canvasReady,
    dropCanvasData,
    GridConfigRefresh,
    renderBasePlaceableHUD,
    updateScene,
} from "./canvas.js";
import {scene_config_hooks} from "../settings/scene/init.js";
import {token_config_hooks} from "../settings/token/init.js";
import {tile_config_hooks} from "../settings/tile/init.js";
import {activateTokenLayer, createToken, deleteToken, drawToken, refreshToken, targetToken} from "./token.js";
import {lightingRefresh, sightRefresh} from "./sight.js";
import {
    activateTilesLayer,
    createTile,
    deleteTile,
    hoverTile,
    preCreateTile,
    refreshTile,
    updateTile,
} from "./tile.js";
import {MODULE_ID} from "../settings/consts.js";
import {Isostate} from "../pro/isostate.js";
import {should_show_motd} from "./motd.js";


export async function hooks_register() {
    Hooks.once('init', function () {
        settingsConfigurationHook();
        if (isDebug()) {
            CONFIG.debug.hooks = true;
        }
    });
    Hooks.once('ready', () => {
        libwrapper_setup();
    });

    // Canvas
    Hooks.on("canvasReady", canvasReady);
    Hooks.on("updateScene", updateScene);
    Hooks.on("dropCanvasData", dropCanvasData);

    // Tile
    Hooks.on('preCreateTile', preCreateTile);
    Hooks.on('updateTile', updateTile);
    Hooks.on('refreshTile', refreshTile);
    Hooks.on('hoverTile', hoverTile);
    Hooks.on('activateTilesLayer', activateTilesLayer);
    Hooks.on('createTile', createTile);
    Hooks.on('deleteTile', deleteTile);


    // Wall
    // Hooks.on('updateWall', updateWall);

    // Configs
    scene_config_hooks();
    token_config_hooks();
    tile_config_hooks();

    // Huds
    Hooks.on("renderBasePlaceableHUD", renderBasePlaceableHUD);

    // Token
    Hooks.on('refreshToken', refreshToken);
    Hooks.on('drawToken', drawToken);
    Hooks.on('preDeleteToken', deleteToken);
    Hooks.on('createToken', createToken);
    Hooks.on('targetToken', targetToken);
    Hooks.on('activateTokenLayer', activateTokenLayer);

    // Sight
    Hooks.on('lightingRefresh', lightingRefresh)
    Hooks.on('sightRefresh', sightRefresh);




}

function libwrapper_setup() {
    if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
        ui.notifications.error("Isometric Module requires the 'libWrapper' module. Please install and activate it.");
    } else {
        wrap_and_verify("GridConfig.prototype._refresh", function (wrapped, ...args) {
            let {width, height} = canvas.primary.background;
            wrapped(...args);
            GridConfigRefresh(this, width, height, ...args);
        }, 'WRAPPER', "b5e606378411f8afbe4b589b0361b1e4b1fd61d12d8b4136ab3158e74cb9b2f8baba81244f78ac96b722310dea57446cfc1f9efd4717a47ec4617e0a832abc08");

        wrap_and_verify("ClientKeybindings.prototype._handleCanvasPan", _handleCanvasPan,
            "MIXED", "1bb7bf3600e91b7b84130216f33f93d047e03857d06234eba2945c90533aaec3acdef992f9d8b81f2432f3db06e529a41da45d68062c8f673ad9c996d9b461ab")

        wrap_and_verify("ClientKeybindings.prototype._handleMovement", _handleMovement,
            "MIXED", "e6dfca693772c3c993a7d43a34267be0e8100a3433ca6dfcaf5f5d71073ec5cac00496f99048859e0da0efca6e917fae33406b5a36edaf1f5599955d16ef5b03")

        wrap_and_verify("ChatBubbles.prototype._setPosition", _setPosition,
            "MIXED", "13ae723304ae006b9980e92b13fd09903f5deb37491451dd08f6b3daee787947369f4546ff862aa08d168aaac0c83d6f60144d1cf12ecb7a17193668847d845d")

    }
}



function wrap_and_verify(hooked_function_name, hook_function, hook_type, hash_str) {
    const function_str = eval(`${hooked_function_name}.toString().replaceAll('\\r\\n', '\\n')`);
    const function_str_hash = getHash(function_str);
    if (function_str_hash !== hash_str) {
        console.warn(hooked_function_name, function_str_hash);
        ui.notifications.warn(`Isometric Module encountered a _possibly_ unsupported ${hooked_function_name}, please notify grape_juice`);
    }
    libWrapper.register(MODULE_ID, hooked_function_name, hook_function, hook_type)

}