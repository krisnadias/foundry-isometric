import {Isostate} from "../pro/isostate.js";
import {getValueFlag, is_viewed_scene_iso} from "../../utils.js";
import {lineInRectangle, pointInRectangle, shortenLineByPixels} from "../geometry/lineIntersection.js";
import {lineInPolygon} from "../geometry/polygon.js";

export function testSightWallToCircle(A1, A2, B1, B2, C1, C2, r) {
    // https://stackoverflow.com/questions/26725842/how-to-pick-up-line-segments-which-is-inside-or-intersect-a-circle

    //First, let's express each vector as a complex number.
    //This simplifies the rest of the code because we can then subtract them
    //from each other in one statement, or find their length with one statement.
    //(Downside: it does not allow us to generalize the code to spheres in 3D.)
    let OA = Complex(A1, A2)
    let OB = Complex(B1, B2)
    let OC = Complex(C1, C2)

    //Now let's translate into a coordinate system where A is the origin
    let AB = OB.sub(OA)
    let AC = OC.sub(OA)

    //Before we go further let's cover one special case:  if either A or B is actually in
    //the circle,  then mark it as a detection
    let BC = OC.sub(OB)
    if (BC.abs() < r || AC.abs() < r) return true;

    //Project C onto the line to find P, the point on the line that is closest to the circle centre
    let AB_normalized = AB.div(AB.abs())
    let AP_distance = AC.re * AB_normalized.re + AC.im * AB_normalized.im    //dot product (scalar result)
    let AP = AB_normalized.mul(AP_distance)   //actual position of P relative to A (vector result)

    //If AB intersects the circle, and neither A nor B itself is in the circle,
    //then P, the point on the extended line that is closest to the circle centre, must be...

    //(1) ...within the segment AB:
    let AP_proportion = Complex(AP_distance).div(AB.abs()).re   //scalar value: how far along AB is P?
    let in_segment = (0 <= AP_proportion) && (AP_proportion <= 1)

    //...and (2) within the circle:
    let CP = AP.sub(AC)
    let in_circle = CP.abs() < r

    let detected = in_circle && in_segment

    return detected
}

export function topDownPointToIsoXY(_x, _y) {
    let {x = x, y = y} = canvas.stage.toGlobal({x: _x, y: _y}); // wall
    return {x: x, y: y}
}

function getIsoWallCoords(coo) {
    let [x1, y1, x2, y2] = coo;
    let ret = [0, 0, 0, 0];

    var {x = x, y = y} = canvas.stage.toGlobal({x: x1, y: y1}); // wall
    ret[0] = x;
    ret[1] = y;

    var {x = x, y = y} = canvas.stage.toGlobal({x: x2, y: y2}); // wall
    ret[2] = x;
    ret[3] = y;

    return ret;
}

export function isWallAbovePoint(coords, sightSource) {
    let [wX1, wY1, wX2, wY2] = getIsoWallCoords(coords);
    let tCoords = topDownPointToIsoXY(sightSource.x, sightSource.y);

    let slope = wX1 == wX2 ? wY2 - wY1 : (wY2 - wY1) / (wX2 - wX1);
    return (tCoords.y - wY1 > slope * (tCoords.x - wX1));

}


export function cloneTileSprite(_tile) {
    let tileImg = _tile
    if (!tileImg || !tileImg.texture.baseTexture) return
    let sprite = new PIXI.Sprite.from(tileImg.texture);
    let tile = _tile.mesh;
    sprite.tint = 16777215;
    sprite.isSprite = true;
    sprite.blendMode = 0;
    sprite.name = tile.id;
    sprite.drawMode = 4;

    sprite.anchor = tile.anchor;
    sprite.width = tile.width;
    sprite.height = tile.height;
    sprite.position = tile.position;
    sprite.scale = tile.scale;
    sprite.angle = tile.angle;

    sprite.filters = [WHITE_MASK_SHADER]

    return sprite;
}

export function updateTileSprite(sprite, _tile) {
    if (!_tile || !_tile.texture.baseTexture) return false
    let tile = _tile.mesh;

    sprite.anchor = tile.anchor;
    sprite.width = tile.width;
    sprite.height = tile.height;
    sprite.position = tile.position;
    sprite.scale = tile.scale;
    sprite.angle = tile.angle;
    return true;
}


export const WHITE_MASK_SHADER = new PIXI.Filter(`
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            uniform mat3 projectionMatrix;
            varying vec2 vTextureCoord;
            void main(void)
            {
                gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                vTextureCoord = aTextureCoord;
            }
`, `
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform float delta;
                void main(void)
                {
                    vec4 color = texture2D(uSampler, vTextureCoord);
                    if (color.a != 0.0){
                        color.r = 1.0;
                        color.g = 1.0;
                        color.b = 1.0;
                    }
                    gl_FragColor = color;
                }
`);

export function hideAllTiles(tile_collection, ghost_collection = new Set(), gm_test = true) {
    let is = Isostate.getInstance();

    if (gm_test && game.user.isGM && canvas.tokens.controlled.length === 0) {
        return;
    }
    //ghosting - here
    canvas.tiles.documentCollection.forEach(x => {
        if (tile_collection.has(x.id) || ghost_collection.has(x.id)) {
            x.object.visible = false;
            is.tokenOcclusionUpdateTileVisibility(x.id, false);
        }
    });
}

export function lightingRefresh(data) {
    if (!is_viewed_scene_iso()) return;

    let is = Isostate.getInstance();

    hideAllTiles(is.getVisible(), is.getVisibleGhost());
    is.clearVisible();
    is.clearVisibleGhost();

    // if token has a preview, use just the preview
    let vision_source_names = [...data.visionSources.keys()].filter(key => !data.visionSources.has(`${key}.preview`))

    let light_visible_walls = new Set(data.lightSources.filter(tt => tt.active).flatMap(sightSource => {
        return sightSource.los.rays?.flat().flatMap(ray => ray.result.collisions)
            .flatMap(tt => Array.from(tt.edges)).filter(ff => is.IsoTiles.hasWall(ff.wall.document._id))
            .map(vv => vv.wall.document._id) || null
    }));


    vision_source_names.forEach(vs => {
        let sightSource = data.visionSources.get(vs);
        let current_visible_walls = []
        // if (sightSource.los.rays != null) {
        //     current_visible_walls = [...sightSource.los.rays
        //         .flat().flatMap(ray => ray.result.collisions)
        //         .flatMap(tt => Array.from(tt.edges)).filter(ff => is.IsoTiles.hasWall(ff.wall.document._id))
        //         .map(vv => ({'id': vv.wall.document._id, 'c': vv.wall.document.c}))
        //         .reduce((a, c) => {
        //             a.set(c.id, c);
        //             return a;
        //         }, new Map()).values()];
        // }

        // // probably ok for no global illumination since we cull on radius, good for lancer, always showing..... maybe.
        // let current_visible_walls = [...Array.from(sightSource.los.edges).filter(ff => is.IsoTiles.hasWall(ff.wall.document._id))
        //     .map(vv => ({'id': vv.wall.document._id, 'c': vv.wall.document.c}))
        //     .reduce((a, c) => {
        //         a.set(c.id, c);
        //         return a;
        //     }, new Map()).values()]


        // let current_visible_walls = [...Array.from(sightSource.los.edges).filter(ff => {
        //     is.IsoTiles.hasWall(ff.wall.document._id) && sightSource.containsPoint({
        //         x: ff.wall.document.c[0], y: ff.wall.document.c[1]
        //     }) || sightSource.containsPoint({x: ff.wall.document.c[2], y: ff.wall.document.c[3]})
        // })
        //     .map(vv => ({'id': vv.wall.document._id, 'c': vv.wall.document.c}))
        //     .reduce((a, c) => {
        //         a.set(c.id, c);
        //         return a;
        //     }, new Map()).values()]
        //

        // // un-optimized, also rework this to not look at edges but at 1 px closer to middle on perfect axis walls maybe, slope 0 walls
        // let cur_walls_id = new Set(current_visible_walls.flatMap(x => x.id));
        for (let [k, v] of is.IsoTiles.WallsToTile.index) {
            // console.log(k)
            let org_coords = canvas.walls.documentCollection.get(k)?.c;
            if (!org_coords) continue;
            const coords = [...org_coords]

            // let shorten = shortenLineByPixels({x: coords[0], y: coords[1]}, {x: coords[2], y: coords[3]})
            // if (lineInRectangle(shorten,sightSource.los.bounds) && PolygonContainsLine(coords, sightSource.los.points))
            // const shorter = shortenLineByOne(coords);
            if (lineInRectangle(coords,sightSource.los.bounds) && lineInPolygon(coords, sightSource.los.points))
           {
                current_visible_walls.push({id: k, c: org_coords});
            }

        }

        current_visible_walls.forEach(({id: wall_id, c: wall_coords}) => {
            //(maybe i should remove culling for distance if global illumination is enabled)
            let is_wall_range_visible = (canvas.scene.globalLight || light_visible_walls.has(wall_id) || testSightWallToCircle(...wall_coords, sightSource.x, sightSource.y, sightSource.radius));
            let is_wall_above = isWallAbovePoint(wall_coords, sightSource);

            let is_wall_visible = is_wall_range_visible && is_wall_above;
            // add:
            // + above below,
            // + sight angle

            // - ghost,
            // + alpha.
            // - tile links
            let tiles = is.IsoTiles.getTiles(wall_id);
            // bug, i think it loops all tiles into the tile index so that makes those errors
            tiles.forEach(tile_id => {
                if (is.IsoTiles.hasTile(tile_id) === true && is.isVisible(tile_id) === false) {
                    let cur_tile = canvas.tiles.get(tile_id)
                    let tile_above_alpha_value = getValueFlag(cur_tile.document, 'tile_alpha', 0)
                    cur_tile.visible = is_wall_visible;
                    is.tokenOcclusionUpdateTileVisibility(tile_id, is_wall_visible);
                    //todo: figure out gm view
                    cur_tile.original_alpha = cur_tile.document.alpha

                    if (is_wall_range_visible && !is_wall_above && tile_above_alpha_value !== 0) {
                        cur_tile.mesh.alpha = tile_above_alpha_value;
                        cur_tile.visible = true;
                        is.addVisibleGhost(tile_id);
                        is.tokenOcclusionUpdateTileVisibility(tile_id, true);

                    } else {
                        cur_tile.mesh.alpha = cur_tile.original_alpha;
                    }

                    if (is_wall_visible) {
                        is.addVisible(tile_id)
                        is.tokenOcclusionUpdateTileVisibility(tile_id, true);
                    }
                }
            });

            is.IsoTiles.getOpenDoorsTiles().forEach(door_tiles => {
                door_tiles.forEach(tile_id => {
                    is.delVisible(tile_id);
                    canvas.tiles.get(tile_id).visible = false
                    is.tokenOcclusionUpdateTileVisibility(tile_id, false);
                })
            });

            //
            // if (res === true) {
            //     tiles.forEach(t => is.addVisible(t))
            //
            // } else {
            //     tiles.forEach(t => is.delVisible(t))
            // }
            // canvas.tiles.objects.children.filter(x => tiles.has(x.document._id)).forEach(t => t.visible = res);


        });


    })
}

export function sightRefresh() {
    if (!is_viewed_scene_iso()) return;

    let is = Isostate.getInstance();
    // punch all visible tiles through fog
    is.getVisible().forEach(tile_id => {
        canvas.masks.vision.addChild(is.getTileMask(tile_id));
    });

    is.getVisibleGhost().forEach(tile_id => {
        canvas.masks.vision.addChild(is.getTileMask(tile_id));
    });

    // go through all visible tokens, and those with the center out of fog.
    // punch them through.
    canvas.tokens.objects.children
        .filter(t => t.visible && (canvas.tokens.preview.children.some(ta => ta.document.id === t.document.id) === false) && (canvas.tokens.controlledObjects.has(t.document.id) || canvas.effects.visibility.testVisibility({
            x: t.x, y: t.y
        }, {tolerance: 30}))).forEach(token => {
        let m = is.getTokenMask(token.document.id);
        if (m) canvas.masks.vision.addChild(m);
    })

    //todo: this is probably the issue, it should just hide invisible tiles and gen sprite probably
    is.tokenOcclusionUpdateTiles();

}



