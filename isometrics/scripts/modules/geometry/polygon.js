function shortenLine(x1, y1, x2, y2, amount) {
    // Calculate the midpoint
    let midX = (x1 + x2) / 2;
    let midY = (y1 + y2) / 2;

    // Calculate the vector from the midpoint to each endpoint
    let vec1 = { x: x1 - midX, y: y1 - midY };
    let vec2 = { x: x2 - midX, y: y2 - midY };

    // Calculate the length of each vector
    let len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    let len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);

    // Calculate the new length after shortening
    let newLen1 = Math.max(0, len1 - amount);
    let newLen2 = Math.max(0, len2 - amount);

    // Calculate the unit vectors
    let unitVec1 = { x: vec1.x / len1, y: vec1.y / len1 };
    let unitVec2 = { x: vec2.x / len2, y: vec2.y / len2 };

    // Calculate the new shortened endpoints
    let newP1 = { x: midX + unitVec1.x * newLen1, y: midY + unitVec1.y * newLen1 };
    let newP2 = { x: midX + unitVec2.x * newLen2, y: midY + unitVec2.y * newLen2 };

    return [newP1.x,newP1.y, newP2.x,newP2.y];
}

export function lineInPolygon(line, polygon) {
    const [x1, y1, x2, y2] = line;

    // Helper function to check if a point is on a line segment
    function isPointOnLineSegment(p, a, b) {
        const crossProduct = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
        if (crossProduct !== 0) return false;

        const dotProduct = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
        if (dotProduct < 0) return false;

        const squaredLength = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        return dotProduct <= squaredLength;
    }

    // Helper function to check if a point is inside the polygon using the crossing number algorithm
    function isPointInPolygon(point, polygon) {
        let wn = 0; // Winding number

        for (let i = 0, j = polygon.length - 2; i < polygon.length; j = i, i += 2) {
            const vertex1 = { x: polygon[i], y: polygon[i + 1] };
            const vertex2 = { x: polygon[j], y: polygon[j + 1] };

            if (vertex1.y <= point.y) {
                if (vertex2.y > point.y) {
                    const isLeftValue = ((vertex2.x - vertex1.x) * (point.y - vertex1.y) - (point.x - vertex1.x) * (vertex2.y - vertex1.y));
                    if (isLeftValue > 0) {
                        wn++;
                    }
                }
            } else {
                if (vertex2.y <= point.y) {
                    const isLeftValue = ((vertex2.x - vertex1.x) * (point.y - vertex1.y) - (point.x - vertex1.x) * (vertex2.y - vertex1.y));
                    if (isLeftValue < 0) {
                        wn--;
                    }
                }
            }
        }

        return wn !== 0;
    }

    function doLineSegmentsIntersect(a1, a2, b1, b2) {
        function orientation(p, q, r) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
            if (val === 0) return 0; // colinear
            return (val > 0) ? 1 : 2; // clock or counterclockwise
        }

        const o1 = orientation(a1, a2, b1);
        const o2 = orientation(a1, a2, b2);
        const o3 = orientation(b1, b2, a1);
        const o4 = orientation(b1, b2, a2);

        // General case
        if (o1 !== o2 && o3 !== o4) return true;

        // Special cases
        if (o1 === 0 && isPointOnLineSegment(b1, a1, a2)) return true;
        if (o2 === 0 && isPointOnLineSegment(b2, a1, a2)) return true;
        if (o3 === 0 && isPointOnLineSegment(a1, b1, b2)) return true;
        if (o4 === 0 && isPointOnLineSegment(a2, b1, b2)) return true;

        return false; // Doesn't fall in any of the above cases
    }

    const pointA = { x: x1, y: y1 };
    const pointB = { x: x2, y: y2 };

    // Check if any point of the line is inside the polygon
    if (isPointInPolygon(pointA, polygon) || isPointInPolygon(pointB, polygon)) return true;

    // Check if any part of the line intersects the polygon
    for (let i = 0, j = polygon.length - 2; i < polygon.length; j = i, i += 2) {
        const vertex1 = { x: polygon[i], y: polygon[i + 1] };
        const vertex2 = { x: polygon[j], y: polygon[j + 1] };

        if (isPointOnLineSegment(pointA, vertex1, vertex2)) return true;
        if (isPointOnLineSegment(pointB, vertex1, vertex2)) return true;
        if (doLineSegmentsIntersect(pointA, pointB, vertex1, vertex2)) return true;
    }

    return false;
}