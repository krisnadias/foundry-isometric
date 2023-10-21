import {name_spam, pro_enabled} from "../../utils.js";
import {hooks_register} from "./hooks.js";
import {should_show_motd} from "./motd.js";
import WebMMuxer from "../../external/webm-muxer.js";
import {Isostate} from "../pro/isostate.js";

name_spam();

// init es module:

function pro_init(stage) {
    let pro = game.modules.get('grape_juice-isometrics-pro');
    if (pro !== undefined) { // module exists
        if (pro.active !== true) {
            if (stage === 'ready') {
                if (game.user.isGM) {
                    ui.notifications.info("Thanks for supporting the Isometric module, please enable the Pro module from 'Manage Modules` in the settings.", {permanent: true});
                }
            }
        } else // exists and activate, so load it
        {

            if (stage === 'init') {
                pro_enabled(IsometricPro.loadMe);
            } else if (stage === 'ready') {
                if (game.user.isGM) {
                    // IsometricPro.loadNotification
                }
            }
        }
    }
}


Hooks.once('init', () => {
    pro_init('init');
    register_static_exports();

});
Hooks.once('ready', () => {
    pro_init('ready');
    should_show_motd();

});

//recorder
// Hooks.on('deactivateTokenLayer', async () => {
//
//     const mcanvas = canvas.app.renderer.view;
//
//     let fileHandle = await window.showSaveFilePicker({
//         suggestedName: `video.webm`,
//         types: [{
//             description: 'Video File',
//             accept: { 'video/webm': ['.webm'] }
//         }],
//     });
//     let fileWritableStream = await fileHandle.createWritable();
//     let muxer = new WebMMuxer({
//         target: fileWritableStream,
//         video: {
//             codec: 'V_VP9',
//             width: mcanvas.width,
//             height: mcanvas.height,
//             frameRate: 10
//         },
//         audio: {
//             codec: 'A_OPUS',
//             numberOfChannels: 2,
//             sampleRate: 48000
//         }
//     });
//     let videoEncoder = new VideoEncoder({
//         output: (chunk, meta) => {
//             muxer.addVideoChunk(chunk, meta); console.log(chunk,meta)},
//         error: e => console.error(e)
//     });
//     videoEncoder.configure({
//         codec: 'vp09.00.10.08',
//         width: mcanvas.width,
//         height: mcanvas.height,
//         // bitrate: 1e6,
//         latencyMode: 'realtime'
//     });
//
//     // const stream = mcanvas.captureStream(0);
//     // const [videoTrack] = stream.getVideoTracks();
//
//     function sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
//     setTimeout(async () => {
//         for (let i =0;i<60;i++) {
//             let frame = await new VideoFrame(mcanvas, {
//                 timestamp: i*10000,
//                 alpha: 'keep',
//                 // duration: 1000
//             });
//             // let a = videoTrack.requestFrame();
//             // debugger;
//             // let frame = await new VideoFrame( videoTrack.requestFrame(), {
//             //         timestamp: i*100,
//             //         alpha: 'discard',
//             //         duration: 100
//             //     });
//             await new Promise(requestAnimationFrame);
//             await videoEncoder.encode(frame)//, { keyFrame: true })
//             await frame.close();
//             // await sleep(10);
//         }
//         await videoEncoder.flush();
//         await videoEncoder.close();
//         await muxer.finalize();
//         await fileWritableStream.close();
//     }, 1*1000);
//
//
//
//
//
// });




//run migrations

await hooks_register();


 function register_static_exports() {
    game.isometric = {
        getPoint: (target, pointType = "center") => {
            return canvas.toLocal(target.toGlobal({x:target.mesh.width * target.mesh.anchor.x,y:target.mesh.height * target.mesh.anchor.y}))
        }
    }

}
