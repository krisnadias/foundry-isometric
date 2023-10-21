import {MODULE_ID} from "../settings/consts.js";
import WebMMuxer from '../../external/webm-muxer.js';
function show_motd(){
    const version = game.modules.get(MODULE_ID).version;

    const MODULE_TITLE = game.modules.get(MODULE_ID).title;
    const FALLBACK_MESSAGE_TITLE = MODULE_TITLE;
    const FALLBACK_MESSAGE = `<large>
                <p><b>🍇${MODULE_TITLE}🍇</b></p>
                <p><strong>This is an advanced module, it has a slight learning curve, please be sure to stop by my <a href="https://discord.gg/467HAfZ">discord for discussions, feedback and support.</a> and watch the video below:</p>
                <p>5 minute module tour: 
                <iframe width="385"  src="https://www.youtube-nocookie.com/embed/vud6a7cDyEk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </p>

                <p>If you want to grab the Pro features and support further versions and updates,
                 please visit my patreon 🍇Grape_Juice🍇: <a href="https://patreon.com/foundry_grape_juice">Patreon</a> </p></large>
            `;

    new Dialog({
        title: FALLBACK_MESSAGE_TITLE,
        content: FALLBACK_MESSAGE, buttons: {
            ok: { icon: '<i class="fas fa-check"></i>', label: 'Understood' },
            dont_remind: { icon: '<i class="fas fa-times"></i>', label: "Don't remind me again", callback: () => game.settings.set(MODULE_ID, "popup-dont-remind-again", version) }
        }
    }).render(true);

}
export function should_show_motd(){
    const saved_version = get_version()
    const version = game.modules.get(MODULE_ID).version;
    const is_saved_old = version.localeCompare(saved_version, undefined, { numeric: true, sensitivity: 'base' })>0;

    if(game.user.isGM && is_saved_old ) {
        show_motd()
    }
}

function get_version(){
    let saved_version = 0;
    try {
        saved_version = game.settings.get("grape_juice-isometrics", "popup-dont-remind-again");
    }
    catch {}
    return saved_version;
}

export default class MotdShim extends FormApplication
{
    /**
     * @inheritDoc
     */
    constructor(options = {})
    {
        super({}, options);

        show_motd();
    }

    async _updateObject(event, formData) {}
    render() { this.close(); }
}