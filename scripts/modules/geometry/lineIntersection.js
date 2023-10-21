export function shortenLineByPixels(point1, point2, amount=2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const newLength = Math.max(length - amount, 0);
    const ratio = newLength / length;

    const deltaX = Math.round(dx * ratio);
    const deltaY = Math.round(dy * ratio);

    const newPoint1 = { x: point1.x + deltaX, y: point1.y + deltaY };
    const newPoint2 = { x: point2.x - deltaX, y: point2.y - deltaY };
    return [newPoint1.x,newPoint1.y,newPoint2.x,newPoint2.y];

    // return { newPoint1, newPoint2 };
}

export function pointInRectangle(point, rectangle) {
    const {x, y, width, height} = rectangle;

    return (
        point[0] >= x &&
        point[0] <= x + width &&
        point[1] >= y &&
        point[1] <= y + height
    );

}

export function lineInRectangle(line, rectangle) {
    let [x1, y1, x2, y2] = line;
    let a = [x1, y1];
    let b = [x2, y2];

    const {x, y, width, height} = rectangle;

    const minX = x;
    const minY = y;
    const maxX = x + width;
    const maxY = y + height;

    if (pointInRectangle(a, rectangle) || pointInRectangle(b, rectangle)) {
        return true;
    }

    let edges = [
        [[minX, minY], [maxX, minY]],
        [[maxX, minY], [maxX, maxY]],
        [[maxX, maxY], [minX, maxY]],
        [[minX, maxY], [minX, minY]],
    ];

    for (let edge of edges) {
        let [c, d] = edge;
        if (lineSegmentsIntersect(a, b, c, d)) {
            return true;
        }
    }

    return false;
}

export function lineInPolygon(line, polygon) {
    let [x1, y1, x2, y2] = line;
    let a = [x1, y1];
    let b = [x2, y2];

    if (pointInPolygon(a, polygon) || pointInPolygon(b, polygon)) {
        return true;
    }
    const length = polygon.length / 2;

    // Check if the line intersects any of the polygon's edges
    for (let i = 0, j = length - 1; i < length; j = i++)
    {
        const xi = polygon[i * 2];
        const yi = polygon[(i * 2) + 1];
        const xj = polygon[j * 2];
        const yj = polygon[(j * 2) + 1];

        if (lineIntersect(x1, y1, x2, y2, xi, yi, xj, yj)) {
            return true;
        }
    }

    return false;
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (det === 0) {
        const onSegment1 = pointOnSegment(x1, y1, x2, y2, x3, y3) || pointOnSegment(x1, y1, x2, y2, x4, y4);
        const onSegment2 = pointOnSegment(x3, y3, x4, y4, x1, y1) || pointOnSegment(x3, y3, x4, y4, x2, y2);
        return onSegment1 || onSegment2;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
    const u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / det;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}


// export function isLeft(a, b, c) {
//     return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
// }

export function pointOnSegments(p, a, b) {
    return Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) &&
        Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
}
export function lineSegmentsIntersect(a, b, c, d) {

    let det1 = isLeft(a, b, c);
    let det2 = isLeft(a, b, d);
    let det3 = isLeft(c, d, a);
    let det4 = isLeft(c, d, b);

    if (det1 * det2 < 0 && det3 * det4 < 0) return true; // General case
    if (det1 === 0 && det2 === 0 && det3 === 0 && det4 === 0) return true; // Collinear segments
    if (det1 === 0 && pointOnSegments(c, a, b)) return true;
    if (det2 === 0 && pointOnSegments(d, a, b)) return true;
    if (det3 === 0 && pointOnSegments(a, c, d)) return true;
    if (det4 === 0 && pointOnSegments(b, c, d)) return true;

    return false;
}

function pointOnSegment(x1, y1, x2, y2, x, y)
{
    const dotProduct = ((x - x1) * (x2 - x1)) + ((y - y1) * (y2 - y1));
    if (dotProduct < 0) {
        return false;
    }

    const squaredLength = ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));
    if (dotProduct > squaredLength) {
        return false;
    }

    return true;
}

// export function pointOnSegment(p, a, b) {
//     return Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) &&
//         Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
// }

// export function pointInPolygon(point, polygon) {
//     return (windingNumber(point, polygon) !== 0);
// //     let windingNumber = 0;
// //     let n = polygon.length;
// //
// //     for (let i = 0; i < n; i++) {
// //         let next = (i + 1) % n;
// //         if (polygon[i][1] <= point[1]) {
// //             if (polygon[next][1] > point[1] && isLeft(polygon[i], polygon[next], point) > 0) {
// //                 windingNumber++;
// //             }
// //         } else {
// //             if (polygon[next][1] <= point[1] && isLeft(polygon[i], polygon[next], point) < 0) {
// //                 windingNumber--;
// //             }
// //         }
// //     }
// //
// //     return windingNumber !== 0;
// }

// export function isLeft(P0, P1, P2) {
//     return (P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y);
// }

export function pointInPolygon(point, points) {
    const x = point[0];
    const y = point[1];
    let windingNumber = 0;
    const length = points.length / 2;

    for (let i = 0, j = length - 1; i < length; j = i++)
    {
        const xi = points[i * 2];
        const yi = points[(i * 2) + 1];
        const xj = points[j * 2];
        const yj = points[(j * 2) + 1];

        const position = isLeft(xi, yi, xj, yj, x, y);

        if (position === 0) {
            return true;
        }

        if (yi <= y) {
            if (yj > y) {
                if (position > 0) {
                    windingNumber++;
                }
            }
        } else {
            if (yj <= y) {
                if (position < 0) {
                    windingNumber--;
                }
            }
        }
    }

    return windingNumber !== 0;
}

function pointInPolygon3(point, vertices) {
    const n = vertices.length - 1;
    const [px, py] = point;
    let winding_number = 0;
    let bx = vertices[0][0] - px, by = vertices[0][1] - py;
    let b_below_p = by <= 0;
    for (let i = 1; i <= n; i++) {                    // loop through each edge a -> b in the polygon
        const ax = bx, ay = by, a_below_p = b_below_p;  // re-use from previous iteration
        bx = vertices[i][0] - px, by = vertices[i][1] - py;
        b_below_p = by <= 0;
        const axby = ax*by, aybx = ay*bx;
        const p_left_of_ab = axby > aybx;
        winding_number += (  // +1 if upward edge, -1 if downward edge
            (a_below_p ^ b_below_p) * (b_below_p ^ p_left_of_ab)
            * (p_left_of_ab - (axby < aybx)));
    }
    return winding_number !== 0;
}

function isLeft(x1, y1, x2, y2, x, y)
{
    const det = ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1));

    // Check if the point is on the line segment
    if (det === 0) {
        const dotProduct = ((x - x1) * (x2 - x1)) + ((y - y1) * (y2 - y1));
        const squaredLength = ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));

        if (dotProduct >= 0 && dotProduct <= squaredLength) {
            return 0;
        }
    }

    return det;
}

// export function isLeft(p0, p1, p2) {
//     return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
// }
export function windingNumber(_point, polygon) {
    let point = {x:_point[0],y:_point[1]};

    let wn = 0;
    const n = polygon.length / 2;

    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const xi = polygon[i * 2], yi = polygon[i * 2 + 1];
        const xj = polygon[j * 2], yj = polygon[j * 2 + 1];

        if (yi <= point.y) {
            if (yj > point.y) {
                if (isLeft({x: xi, y: yi}, {x: xj, y: yj}, point) > 0) {
                    wn++;
                }
            }
        } else {
            if (yj <= point.y) {
                if (isLeft({x: xi, y: yi}, {x: xj, y: yj}, point) < 0) {
                    wn--;
                }
            }
        }
    }

    return wn;
}