import {formatBoolDiv, formatNewTab, formatOptionDiv} from "../helper.js";
import {PROJECTION_TYPES} from "../consts.js";

const SCOPE = "settings.scene"

export function scene_config_hooks() {
    Hooks.on("renderSceneConfig", ({object}, html, data) => {

        const isoHtml =
            formatBoolDiv(SCOPE, object, "EnableIsometricMode", "EnableIsometricModeNote", "is_isometric") +
            formatBoolDiv(SCOPE, object, "EnableAttachedTilesOcclusion", "EnableAttachedTilesOcclusionNote",
                "is_linked_tiles_auto_occlude", true,null, null, true) +
            // formatBoolDiv(SCOPE, object, "EnableTileFogGhosting", "EnableTileFogGhostingNote",
            //     "is_isometric_tile_ghosting", false,"tile_ghosting", "tile_ghosting", true) +
            // `
            //     <div class="form-group">
            //         <label>🍇Auto-Crop Scene Size</label>
            //         <div class="form-fields">
            //           <button disabled type="button" class="auto-crop" data-target="auto_crop" title="Auto Crop" tabindex="-1">
            //               <i class="fas fa-crop-alt"></i>
            //           </button>
            //
            //         </div>
            //         <p class="notes" style="color: red"><strong>Extremely Recommended</strong></p>
            //
            //     </div>
            // ` +
            formatOptionDiv(SCOPE, object, "BackgroundImageProjection", "BackgroundImageProjectionNote",
                "background_image_projection_type", PROJECTION_TYPES, "true_isometric")

        formatNewTab(html, "ambience", isoHtml)

        // todo: settings are now clean,
        //  however we lost autocrop and missing a refresh on iso enabled


        // html.find($('button[name="submit"]')).click(app.object, saveSceneConfig)
        // html.find("button.auto-crop").click(this._autoCrop.bind(this));
    });


    // async function saveSceneConfig(event) {
    //     let html = this.parentElement
    //     let prevIsIsoSetting = event.data.getFlag(
    //         "grape_juice-isometrics",
    //         "is_isometric")
    //     let newIsIsosetting = html.querySelectorAll("input[name ='grape_juice-isometricsIsIsometric']")[0].checked
    //     await event.data.setFlag(
    //         "grape_juice-isometrics",
    //         "is_isometric",
    //         html.querySelectorAll("input[name ='grape_juice-isometricsIsIsometric']")[0].checked
    //     );
    //     await event.data.setFlag(
    //         "grape_juice-isometrics",
    //         "is_isometric_tile_ghosting",
    //         html.querySelectorAll("input[name ='grape_juice-isometricsIsIsometricSceneGhosting']")[0].checked
    //     );
    //     await event.data.setFlag(
    //         "grape_juice-isometrics",
    //         "is_automasking",
    //         html.querySelectorAll("input[name ='grape_juice-isometricsIsIsometricAutoMasking']")[0].checked
    //     );
    //     canvas.scene.getFlag("grape_juice-isometrics", "is_automasking")////////////////////
    //     if (((!prevIsIsoSetting && newIsIsosetting) || (prevIsIsoSetting != newIsIsosetting && prevIsIsoSetting != undefined)) && event.data.isView) {
    //         if (Array.from(game.scenes)[0].id != event.data.id) {
    //             await Array.from(game.scenes)[0].view()
    //         } else {
    //             await Array.from(game.scenes)[1].view()
    //         }
    //
    //         await event.data.view()
    //     }
    // }
}