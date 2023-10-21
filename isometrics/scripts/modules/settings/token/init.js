import {formatBoolDiv, formatColorDiv, formatNewTab, formatOptionDiv, formatRangeDiv} from "../helper.js";
import {PROJECTION_TYPES} from "../consts.js";

const SCOPE = "settings.token"

export function token_config_hooks() {
    Hooks.on("renderTokenConfig", ({object}, html, data) => {

        let htmlData = formatBoolDiv(SCOPE, object, "DisableIsometricToken", "DisableIsometricTokenNote", "disable_isometric_token")
            + formatOptionDiv(SCOPE, object, "OriginalImageProjection", "OriginalImageProjectionNote",
                "original_image_projection_type", PROJECTION_TYPES, "true_isometric");

        htmlData +=
            formatBoolDiv(SCOPE, object, "EnableTokenOccluderOutline", "EnableTokenOccluderOutlineNote", "enable_token_occluder_outline", true,null, null, true) +
            formatColorDiv(SCOPE, object, "TokenOccluderOutlineColor", "TokenOccluderOutlineColorNote", "token_occluder_outline_color","#c3fe20",null, null, true) +
            formatBoolDiv(SCOPE, object, "EnableTokenOccluderFill", "EnableTokenOccluderFillNote", "enable_token_occluder_fill", true,null, null, true) +
            formatRangeDiv(SCOPE, object, "TokenOccluderFillAlpha", "TokenOccluderFillAlphaNote", "token_occluder_fill_alpha",
                0, 1, 0.05, 1, null, null, true) +
            formatColorDiv(SCOPE, object, "TokenOccluderFillColor", "TokenOccluderFillColorNote", "token_occluder_fill_color", "#6a5858",null, null, true);

        formatNewTab(html, "resources", htmlData)

        return true;
    });
}
