import {getBoolFlag, getValueFlag, gil, pro_enabled} from "../../utils.js";
import {ISO_WIKI, MODULE_ID, PRO_TAG} from "./consts.js";

export function formatBoolDiv(scope, ob, label, notes, flag, _default = false,  tooltipVid = null, tooltipHref = null, pro = false) {
    let current_value = getBoolFlag(ob, flag, _default);
    let data = `
        <input ${pro_formatter(pro)} type="checkbox" name="${flagToName(flag)}" data-dtype="Boolean" ${current_value ? "checked" : ""} >
        `;
    return formatDivGroup(scope, ob, label, notes, data, tooltipVid, tooltipHref, pro);
}


export function formatColorDiv(scope, ob, label, notes, flag, _default, tooltipVid = null, tooltipHref = null, pro = false) {
    let current_value = getValueFlag(ob, flag, _default);
    let data = `
            <div class="form-fields">
                <input ${pro_formatter(pro)} class="color" type="text" name="${flagToName(flag)}"  value="${current_value}">
                <input ${pro_formatter(pro)} type="color" value="${current_value}" data-edit="${flagToName(flag)}">
            </div>`

    return formatDivGroup(scope, ob, label, notes, data, tooltipVid, tooltipHref, pro);
}

export function formatOptionDiv(scope, ob, label, notes, flag, options, _default = null, tooltipVid = null, tooltipHref = null, pro = false) {

    let current_value = getValueFlag(ob, flag, _default);

    let options_html = Object.entries(options).map(([k, v]) => [`<option ${k === current_value ? "selected" : ""} value="${k}">${v}</option>`]);
    let data = `<select ${pro_formatter(pro)} name="${flagToName(flag)}">
                    ${options_html}
                </select>`;

    return formatDivGroup(scope, ob, label, notes, data, tooltipVid, tooltipHref, pro);
}

export function formatNewTab(html, selector, data) {
    html.find(`a[data-tab = "${selector}"]`).parent().append('<a class="item" data-tab="isometric"><i class="fas">🍇</i> Isometric</a>');

    html.find(`div[data-tab = "${selector}"]`).after(`
                <div class="tab" data-tab="isometric">
                    ${data}
                </div>
        `);
}


export function formatButton(scope, button_id, icon, flag = null, pro = false) {
    let _target = flag ? `data-target="flags.${MODULE_ID}.${flag}"` : "";

    return `<button ${pro_formatter(pro)} class="${button_id}" type="button" ${_target} title="${gil(scope, button_id)}" tabIndex="-1">
                <i class="fas ${icon} fa-fw"></i>
            </button>`;
}

export function formatInput(scope, ob, flag, _default, pro = false) {
    let val = getValueFlag(ob, flag, _default);

    return `<input ${pro_formatter(pro)} type="text" name="${flagToName(flag)}" placeholder=""  value="${val}">`;
}

export function formatRangeDiv(scope, ob, label, notes, flag, min, max, step, _default, tooltipVid = null, tooltipHref = null, pro = false) {
    let current_value = getValueFlag(ob, flag, _default);
    let view_name = `${flagToName(flag)}_view`;
    let data = `<input ${pro_formatter(pro)} type="range" name="${flagToName(flag)}" value="${current_value}" min="${min}" max="${max}" step="${step}">
                <span class="range-value" name="${view_name}" >${current_value}</span>`;
    return formatDivGroup(scope, ob, label, notes, data, tooltipVid, tooltipHref, pro);
}

export function formatDivGroup(scope, ob, label, notes, data, tooltipVid = null, tooltipHref = null, pro = false) {
    return `<div class="form-group">
        ${label_formatter(scope, label, tooltipVid, tooltipHref, pro)}
        <div class="form-fields">
            ${data}
        </div>
        <p class="notes">${gil(scope, notes)}</p>
    </div>`
}


function label_formatter(scope, label, tooltipVid = null, tooltipHref = null, pro = false) {
    let tooltip = formatToolTip("settings", tooltipVid, tooltipHref);
    let _pro_tag = pro ? PRO_TAG : "";

    return ` <label ${tooltip != null ? 'class="gjitooltip"' : ""}>${gil(scope, label)}${tooltip}${_pro_tag}</label>`

}

function pro_formatter(pro) {
    let _pro_enabled = pro ? (pro_enabled() ? "" : "disabled") : "";
    return _pro_enabled;

}

export function flagToName(flag) {
    return `flags.${MODULE_ID}.${flag}`
}

function formatToolTip(scope, vidFile, url) {
    let _vidHtml = ""
    if (vidFile != null && vidFile !== undefined) {
        _vidHtml = `<video width="256" loop autoplay 
                        <source src='modules/${MODULE_ID}/assets/${scope}/tooltips/${vidFile}.webm' type="video/webm">
                    </video>`;
    }

    let _urlHtml = ""
    if (url !== null && url !== undefined) {
        _urlHtml = `<a href="${ISO_WIKI}/${scope}#${url}">Open in Wiki</a>`;
    }

    return (_vidHtml + _urlHtml !== "" ? `<span class="gjitooltiptext">${_urlHtml}<br></bt>${_vidHtml}</span>` : "");
}

