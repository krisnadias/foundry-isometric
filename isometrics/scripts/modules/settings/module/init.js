import {MODULE_ID} from "../consts.js";
import MotdShim from "../../core/motd.js";

export function settingsConfigurationHook() {
    game.settings.register(MODULE_ID, 'debug', {
        name: 'Enable Debug Mode',
        hint: 'Enables debug prints',
        scope: 'client',
        config: true,
        default: false,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'isoPan', {
        name: 'Isometric canvas pan',
        hint: 'When moving a token outside of view, pans camera in diagonals (requires refresh).',
        scope: 'client',
        config: true,
        default: true,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'isoKeyboard', {
        name: 'Isometric keyboard movement',
        hint: 'When pressing arrow keys, moves in diagonals instead of sides (requires refresh).',
        scope: 'client',
        config: true,
        default: true,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'token_draw_above_ui', {
        name: 'Set Token above health bars',
        hint: 'Draw the Token above the health bar and effects',
        scope: 'client',
        config: true,
        default: true,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'token_elevation', {
        name: 'Enable Token Elevation',
        hint: 'Activate to cause the token to float and be raised off the ground depending on the token\'s elevation.',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'grid_draw_below_tiles_tokens', {
        name: 'Draw grid below tiles and tokens',
        hint: 'Makes the scene look more natural in isometric',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'enable_tile_selector', {
        name: 'Enable Pixel Perfect Tile Selector',
        hint: 'Enables selecting tile by their image, instead of square bounds (disable for low-end devices)',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, 'enable_token_occluder', {
        name: 'Enable token occlusion when token is `behind` tiles',
        hint: 'Draws a silhouette of the token\'s occluded image (disable for low-end devices)',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
        onChange: settings => window.location.reload()
    });
    game.settings.register(MODULE_ID, "popup-dont-remind-again", {
        name: '',
        default: 0,
        type: Number,
        scope: 'world',
        config: false
    });
    game.settings.registerMenu(MODULE_ID, 'pop_motd', {
        name: "Show 5-Minute tour again",
        hint: "",
        label: 'Show 5-Minute tour again',
        icon: 'fas fa-dice-d20',
        type: MotdShim,
        restricted: true,
    });
}