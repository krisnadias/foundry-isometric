import {
    flagToName, formatBoolDiv, formatButton, formatDivGroup, formatInput, formatNewTab, formatOptionDiv, formatRangeDiv
} from "../helper.js";
import {getValueFlag, pro_enabled} from "../../../utils.js";

const SCOPE = "settings.tile"

export function tile_config_hooks() {

    Hooks.on("renderTileConfig", ({object}, html, data) => {
        let htmlLabel = '<p class="notes" style="color: purple;">Requires <b>Scene</b> and <b>Tokens</b> to have vision enabled!</p>'
        let htmlAttachWallButtonData = formatInput(SCOPE, object, "attach_wall_id", "", true) +
            formatButton(SCOPE, "AttachTileToWall", "fa-university", "attach_wall_id", true) +
            formatButton(SCOPE, "ClearAttachTileToWall", "fa-snowplow", "attach_wall_id", true);
        let htmlAttachWallDivData = formatDivGroup(SCOPE, object, "AttachTileToWall", "AttachTileToWallNote", htmlAttachWallButtonData, null, null, true)


        let htmlAttachDoorButtonData = formatInput(SCOPE, object, "hook_door_id", "", true) +
            formatButton(SCOPE, "AttachTileToDoor", "fa-door-open", "hook_door_id", true) +
            formatButton(SCOPE, "ClearAttachTileToDoor", "fa-snowplow", "hook_door_id", true);
        let htmlAttachDoorDivData = formatDivGroup(SCOPE, object, "AttachTileToDoor", "AttachTileToDoorNote", htmlAttachDoorButtonData, null, null, true)

        let htmlAttachTileData = formatInput(SCOPE, object, "attach_tile_id", "", true) +
            formatButton(SCOPE, "AttachTileToTile", "fa-cubes", "attach_tile_id", true) +
            formatButton(SCOPE, "ClearAttachTileToTile", "fa-snowplow", "attach_tile_id", true);
        // let htmlAttachTileDivData = formatDivGroup(SCOPE, object, "AttachTileToTile", "AttachTileToTileNote", htmlAttachTileData, null, null, true)

        let htmlAboveAlphaDivData = formatRangeDiv(SCOPE, object, "AboveAlpha", "AboveAlphaNote", "tile_alpha", 0, 1, 0.05, 0,null, null, true);

        let htmlTileIsOccluderBoolData = formatBoolDiv(SCOPE, object, "EnableTileOccluder", "EnableTileOccluderNote", "is_tile_occluder", false,null, null, true);

        let htmlData =htmlLabel+ htmlAttachWallDivData + htmlAttachDoorDivData +
            // htmlAttachTileDivData +
            htmlAboveAlphaDivData + htmlTileIsOccluderBoolData;

        formatNewTab(html, "animation", htmlData)

        //Hooks functions to buttons
        if (!pro_enabled()) return true;

        let tile_settings = IsometricPro.getTileSettings()

        Hooks.on("closeTileConfig", ({object}, html, data) => {
            tile_settings.set_iso_walls_glowing(false);

        });
        html.find("button.AttachTileToWall").click(tile_settings._attachTileToWall.bind(this, "attach_wall_id", "Please click on the wall you want to attach", true));
        html.find("button.ClearAttachTileToWall").click(tile_settings._clearAttachTileToWall.bind(this, "attach_wall_id"));

        html.find("button.AttachTileToDoor").click(tile_settings._attachTileToWall.bind(this, "hook_door_id", "Please click on the door you want to attach", false));
        html.find("button.ClearAttachTileToDoor").click(tile_settings._clearAttachTileToWall.bind(this, "hook_door_id"));

        let walls = getValueFlag(object, "attach_wall_id", "") + "," + getValueFlag(object, "hook_door_id", "");
        tile_settings.set_iso_walls_glowing(true, walls)

        return true;
    });

}
