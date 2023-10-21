import {MODULE_ID} from "./modules/settings/consts.js";
import Sha512 from "./external/sha-512.js";

export function name_spam() {
    console.log(`%c🍇%c
     ██████╗ ██████╗  █████╗ ██████╗ ███████╗             ██╗██╗   ██╗██╗ ██████╗███████╗
    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔════╝             ██║██║   ██║██║██╔════╝██╔════╝
    ██║  ███╗██████╔╝███████║██████╔╝█████╗               ██║██║   ██║██║██║     █████╗  
    ██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══╝          ██   ██║██║   ██║██║██║     ██╔══╝  
    ╚██████╔╝██║  ██║██║  ██║██║     ███████╗███████╗╚█████╔╝╚██████╔╝██║╚██████╗███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝ ╚════╝  ╚═════╝ ╚═╝ ╚═════╝╚══════╝
`, "font-size: 102px;", "color: purple;");

    console.log(String.raw`%c🍇Isometric🍇%c

    `, 'font-size: 72px; color: #b87ee8; font-family: "Arial Black", Gadget, sans-serif; text-shadow: 0px 0px 0 rgb(179,121,227),1px 1px 0 rgb(174,116,222),2px 2px 0 rgb(169,111,217),3px 3px 0 rgb(164,106,212),4px 4px 0 rgb(159,101,207),5px 5px 0 rgb(154,96,202),6px 6px 0 rgb(149,91,197),7px 7px 0 rgb(144,86,192),8px 8px 0 rgb(139,81,187),9px 9px 0 rgb(133,75,181),10px 10px 0 rgb(128,70,176),11px 11px 0 rgb(123,65,171),12px 12px 0 rgb(118,60,166),13px 13px 0 rgb(113,55,161),14px 14px 0 rgb(108,50,156),15px 15px 0 rgb(103,45,151),16px 16px 0 rgb(98,40,146),17px 17px 0 rgb(93,35,141),18px 18px  0 rgb(88,30,136),19px 19px 18px rgba(0,0,0,0.6),19px 19px 1px rgba(0,0,0,0.5),0px 0px 18px rgba(0,0,0,.2);', "");


}

export function gil(scope, str) {
    return game.i18n.localize(MODULE_ID +"."+scope + "." + str);
}

export function generateTooltip() {

}

let PRO_ENABLED = null;
export function pro_enabled(enabled = null) {
    if (enabled == null){
        PRO_ENABLED = enabled;
    }
    if (PRO_ENABLED == null) {
            PRO_ENABLED = false;
    }
    return PRO_ENABLED;
}


let GLOBAL_DEBUG = 1

export function isDebug() {
    if (GLOBAL_DEBUG == null) {
        try {
            GLOBAL_DEBUG = game.settings.get(MODULE_ID, 'debug');
        } catch {
            GLOBAL_DEBUG = false;
        }
    }
    return GLOBAL_DEBUG;
}

export function getBoolFlag(obj, flag, _default = false, update = true) {
    const val = obj.getFlag(
        MODULE_ID,
        flag,
    );
    if (val === undefined) {
        if (update) obj.setFlag(MODULE_ID, flag, _default);
        return _default;
    } else {
        return val;
    }
}
export function getValueFlag(obj, flag, _default = null) {
    const val = obj.getFlag(
        MODULE_ID,
        flag,
    );
    if (val === undefined) {
        // obj.setFlag(MODULE_ID, flag, _default);
        return _default;
    } else {
        return val;
    }
}

export function is_viewed_scene_iso() {
    return game.scenes.viewed?.getFlag(MODULE_ID, "is_isometric") === true;
}


export function getHash(str) {
    return Sha512.hash(str);
}

