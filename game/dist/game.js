define("Core/Vector", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new Vector(this.x, this.y);
        }
        multiply(n) {
            this.x = this.x * n;
            this.y = this.y * n;
            return this;
        }
    }
    exports.Vector = Vector;
});
define("Util/Logger", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BrowserConsole {
        debug(str) {
            console.log("[DEBUG] " + str);
        }
        log(str) {
            console.log(str);
        }
        error(str) {
            console.error(str);
        }
    }
    exports.BrowserConsole = BrowserConsole;
    var Level;
    (function (Level) {
        Level[Level["Debug"] = 0] = "Debug";
        Level[Level["Log"] = 1] = "Log";
        Level[Level["Error"] = 2] = "Error";
    })(Level = exports.Level || (exports.Level = {}));
    class Logger {
        static debug(str) {
            this.write(this.output.debug, str, Level.Debug);
        }
        static log(str) {
            this.write(this.output.log, str, Level.Log);
        }
        static error(str) {
            this.write(this.output.error, str, Level.Error);
        }
        static write(fn, str, lvl) {
            if (this.shouldWrite(str, lvl)) {
                if (this.elapsed() >= 1) {
                    if (this._messagesSkipped > 0) {
                        this.output.debug("Skipped " + this._messagesSkipped + " messages");
                    }
                    this._messagesSent = 1;
                    this._messagesSkipped = 0;
                    this._messagesStart = new Date();
                }
                else {
                    this._messagesSent++;
                }
                fn(str);
            }
        }
        static elapsed() {
            return (new Date().getTime() - this._messagesStart.getTime()) / 1000;
        }
        static shouldWrite(str, lvl) {
            var result = (this.output != null
                && (this.filter === "" || str.indexOf(this.filter) > -1)
                && lvl >= this.level);
            if (result && this.elapsed() <= 1) {
                result = lvl === Level.Error || this._messagesSent < this.messagesPerSecond;
                if (!result) {
                    this._messagesSkipped++;
                }
            }
            return result;
        }
    }
    Logger.output = new BrowserConsole();
    Logger.filter = "";
    Logger.level = Level.Log;
    Logger.messagesPerSecond = 5;
    Logger._messagesStart = new Date();
    Logger._messagesSent = 0;
    Logger._messagesSkipped = 0;
    exports.Logger = Logger;
});
define("Shape/Point", ["require", "exports", "Core/Vector"], function (require, exports, Vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Point {
        constructor(offsetX, offsetY, parent) {
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.parent = parent;
            this.children = new Array();
            this.dirty = true;
            this.changed = true;
            this.vector = new Vector_1.Vector(0, 0);
            this.parent = parent;
            if (this.parent != null) {
                this.parent.children.push(this);
            }
        }
        x() {
            this.recalculate();
            return this.vector.x;
        }
        y() {
            this.recalculate();
            return this.vector.y;
        }
        recalculate() {
            if (!this.dirty) {
                return;
            }
            this.dirty = false;
            var x = this.calculate("x");
            var y = this.calculate("y");
            if (x === this.vector.x && y === this.vector.y) {
                return;
            }
            this.vector.x = x;
            this.vector.y = y;
            this.changed = true;
            for (var child of this.children) {
                child.dirty = true;
            }
        }
        move(offsetX, offsetY) {
            if (offsetX != null) {
                this.offsetX = offsetX;
            }
            if (offsetY != null) {
                this.offsetY = offsetY;
            }
            if (!this.changed) {
                for (var child of this.children) {
                    child.dirty = true;
                }
                this.changed = true;
            }
            this.dirty = true;
        }
        calculate(field) {
            var result = 0;
            if (this.parent != null) {
                result = this.parent[field]();
            }
            result += this["offset" + field.toUpperCase()];
            return result;
        }
    }
    exports.Point = Point;
    var DynamicDimension;
    (function (DynamicDimension) {
        DynamicDimension[DynamicDimension["x"] = 0] = "x";
        DynamicDimension[DynamicDimension["y"] = 1] = "y";
    })(DynamicDimension = exports.DynamicDimension || (exports.DynamicDimension = {}));
    class RatioPoint extends Point {
        constructor(ratio, p1, p2) {
            super(null, null);
            this.ratio = ratio;
            this.p1 = p1;
            this.p2 = p2;
            this.p1.children.push(this);
            this.p2.children.push(this);
        }
        calculate(field) {
            return (this.p2[field]() - this.p1[field]()) * this.ratio;
        }
    }
    exports.RatioPoint = RatioPoint;
    class MidPoint extends RatioPoint {
        constructor(p1, p2) {
            super(1 / 2, p1, p2);
        }
    }
    exports.MidPoint = MidPoint;
});
define("Shape/Polygon", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Position;
    (function (Position) {
        Position[Position["TopLeft"] = 0] = "TopLeft";
        Position[Position["TopCenter"] = 1] = "TopCenter";
        Position[Position["TopRight"] = 2] = "TopRight";
        Position[Position["RightCenter"] = 3] = "RightCenter";
        Position[Position["BottomRight"] = 4] = "BottomRight";
        Position[Position["BottomCenter"] = 5] = "BottomCenter";
        Position[Position["BottomLeft"] = 6] = "BottomLeft";
        Position[Position["LeftCenter"] = 7] = "LeftCenter";
        Position[Position["Center"] = 8] = "Center";
        Position[Position["Origin"] = 9] = "Origin";
    })(Position = exports.Position || (exports.Position = {}));
    class Polygon {
        constructor() {
            this.points = new Map();
        }
        getPoint(position) {
            return this.points.get(position);
        }
    }
    exports.Polygon = Polygon;
});
define("Shape/IShape", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShapeType;
    (function (ShapeType) {
        ShapeType[ShapeType["Circle"] = 0] = "Circle";
        ShapeType[ShapeType["Rectangle"] = 1] = "Rectangle";
    })(ShapeType = exports.ShapeType || (exports.ShapeType = {}));
});
define("Shape/Circle", ["require", "exports", "Shape/IShape", "Util/Collision"], function (require, exports, IShape_1, Collision_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Circle {
        constructor(origin, radius) {
            this.origin = origin;
            this.type = IShape_1.ShapeType.Circle;
            this.r = radius;
        }
        changed() {
            this.origin.recalculate();
            return this.origin.changed;
        }
        clearChanged() {
            this.origin.changed = false;
        }
        x() {
            return this.origin.x();
        }
        y() {
            return this.origin.y();
        }
        intersects(shape) {
            return Collision_1.Collision.intersects(this, shape);
        }
        render(ctx, colour) {
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.arc(this.origin.x(), this.origin.y(), this.r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    exports.Circle = Circle;
});
define("Shape/Line", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Line {
        constructor(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
    }
    exports.Line = Line;
});
define("Util/Collision", ["require", "exports", "Shape/IShape", "Shape/Point"], function (require, exports, IShape_2, Point_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Collision {
        static intersects(shape1, shape2) {
            switch (shape1.type) {
                case IShape_2.ShapeType.Rectangle:
                    switch (shape2.type) {
                        case IShape_2.ShapeType.Rectangle:
                            return Collision.rectRectIntersect(shape1, shape2);
                        case IShape_2.ShapeType.Circle:
                            return Collision.rectCircleIntersect(shape1, shape2);
                    }
                    break;
                case IShape_2.ShapeType.Circle:
                    switch (shape2.type) {
                        case IShape_2.ShapeType.Rectangle:
                            return Collision.rectCircleIntersect(shape2, shape1);
                        case IShape_2.ShapeType.Circle:
                            return Collision.circleCircleIntersect(shape1, shape2);
                    }
                    break;
            }
        }
        static getIntersectionLineAtX(line, x) {
            throw "Untested";
        }
        static getIntersectionLineAtY(line, y) {
            throw "Untested";
        }
        static getIntersectionLineLine(line1, line2) {
            throw "Untested";
        }
        static getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x() - p1.x(), 2) + Math.pow(p2.y() - p1.y(), 2));
        }
        static getIntersectionLineCircle(line, circle) {
            var len = this.getDistance(line.p1, line.p2);
            var d = new Point_1.Point((line.p2.x() - line.p1.x()) / len, (line.p2.y() - line.p1.y()) / len, null);
            var t = d.x() * (circle.origin.x() - line.p1.x()) + d.y() * (circle.origin.y() - line.p1.y());
            var e = new Point_1.Point(t * d.x() + line.p1.x(), t * d.y() + line.p1.y(), null);
            var dist = Math.sqrt(Math.pow(e.x() - circle.x(), 2) + Math.pow(e.y() - circle.y(), 2));
            if (dist < circle.r) {
                var dt = Math.sqrt(Math.pow(circle.r, 2) - Math.pow(dist, 2));
                if (t - dt >= 0 && t - dt <= len) {
                    return new Point_1.Point((t - dt) * d.x() + line.p1.x(), (t - dt) * d.y() + line.p1.y(), null);
                }
                else if (t + dt >= 0 && t - dt <= len) {
                    return new Point_1.Point((t + dt) * d.x() + line.p1.x(), (t + dt) * d.y() + line.p1.y(), null);
                }
            }
            else if (dist === circle.r) {
                return e;
            }
            return null;
        }
        static circleCircleIntersect(circle1, circle2) {
            if (circle1.x() + circle1.r + circle2.r > circle2.x()
                && circle1.x() < circle2.x() + circle1.r + circle2.r
                && circle1.y() + circle1.r + circle2.r > circle2.y()
                && circle1.y() < circle2.y() + circle1.r + circle2.r) {
                var distance = Math.sqrt((circle1.x() - circle2.x()) * (circle1.x() - circle2.x())
                    + (circle1.y() - circle2.y()) * (circle1.y() - circle2.y()));
                if (distance < circle1.r + circle2.r) {
                    return true;
                }
            }
            return false;
        }
        static rectCircleIntersect(rect, circle) {
            var distX = Math.abs(circle.x() - rect.x() - rect.width() / 2);
            var distY = Math.abs(circle.y() - rect.y() - rect.height() / 2);
            if (distX > (rect.width() / 2 + circle.r)) {
                return false;
            }
            if (distY > (rect.height() / 2 + circle.r)) {
                return false;
            }
            if (distX <= (rect.width() / 2)) {
                return true;
            }
            if (distY <= (rect.height() / 2)) {
                return true;
            }
            var dx = distX - rect.width() / 2;
            var dy = distY - rect.height() / 2;
            return (dx * dx + dy * dy <= (circle.r * circle.r));
        }
        static rectRectIntersect(rect1, rect2) {
            if (rect2.x() > rect1.x2() || rect2.x2() < rect1.x()) {
                return false;
            }
            if (rect2.y() > rect1.y2() || rect2.y2() < rect1.y()) {
                return false;
            }
            return true;
        }
    }
    exports.Collision = Collision;
});
define("Shape/Rectangle", ["require", "exports", "Shape/Polygon", "Shape/Point", "Shape/IShape", "Util/Collision"], function (require, exports, Polygon_1, Point_2, IShape_3, Collision_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Rectangle extends Polygon_1.Polygon {
        constructor(topLeft, bottomRight) {
            super();
            this.topLeft = topLeft;
            this.bottomRight = bottomRight;
            this.type = IShape_3.ShapeType.Rectangle;
            this.origin = topLeft;
        }
        changed() {
            this.topLeft.recalculate();
            this.bottomRight.recalculate();
            return this.topLeft.changed || this.bottomRight.changed;
        }
        clearChanged() {
            this.topLeft.changed = this.bottomRight.changed = false;
        }
        x() {
            return this.topLeft.x();
        }
        y() {
            return this.topLeft.y();
        }
        x2() {
            return this.bottomRight.x();
        }
        y2() {
            return this.bottomRight.y();
        }
        width() {
            return this.x2() - this.x();
        }
        height() {
            return this.y2() - this.y();
        }
        toString() {
            return "[" + this.x() + "," + this.y() + "] - [" + this.x2() + "," + this.y2() + "]";
        }
        intersects(shape) {
            return Collision_2.Collision.intersects(this, shape);
        }
        render(ctx, colour) {
            ctx.fillStyle = colour;
            ctx.fillRect(this.x(), this.y(), this.width(), this.height());
        }
    }
    exports.Rectangle = Rectangle;
    class PointRectangle extends Rectangle {
        constructor(point) {
            super(point, new Point_2.Point(1, 1, point));
        }
    }
    exports.PointRectangle = PointRectangle;
});
define("Core/Region", ["require", "exports", "Shape/Rectangle", "Shape/Point"], function (require, exports, Rectangle_1, Point_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Region {
    }
    exports.Region = Region;
    class RegionContainer {
        constructor(len, area, regionType) {
            this.len = len;
            this.area = area;
            this.regionType = regionType;
            this.regions = new Map();
            this.area = area;
            var nx = Math.ceil(this.area.width() / len);
            var ny = Math.ceil(this.area.height() / len);
            for (var x = 0; x < nx; x++) {
                var width = Math.min(this.area.width(), (x + 1) * len);
                for (var y = 0; y < ny; y++) {
                    var height = Math.min(this.area.height(), (y + 1) * len);
                    var rect = new Rectangle_1.Rectangle(new Point_3.Point(x * len, y * len, null), new Point_3.Point(width, height, null));
                    var region = new this.regionType();
                    region.area = rect;
                    this.regions.set(rect, region);
                }
            }
        }
        getRegions(area) {
            var result = new Array();
            for (var rect of this.regions.keys()) {
                if (area.intersects(rect)) {
                    result.push(this.regions.get(rect));
                }
            }
            return result;
        }
    }
    exports.RegionContainer = RegionContainer;
});
define("Util/Color", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Color {
        static getRandomColor() {
            var letters = "0123456789ABCDEF";
            var color = "#";
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        static getRandomRGB() {
            return "rgb("
                + (Math.floor(Math.random() * 256)) + ","
                + (Math.floor(Math.random() * 256)) + ","
                + (Math.floor(Math.random() * 256))
                + ")";
        }
        static makeRGBA(rgb, a) {
            return rgb.replace("rgb", "rgba").replace(/\)$/, "," + a + ")");
        }
    }
    exports.Color = Color;
});
define("Core/Viewport", ["require", "exports", "Shape/Point", "Shape/Rectangle"], function (require, exports, Point_4, Rectangle_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Viewport {
        constructor() {
            this.resizeX = null;
            this.resizeY = null;
            this.area = new Rectangle_2.Rectangle(new Point_4.Point(0, 0), new Point_4.Point(0, 0));
        }
        activate() {
            window.onresize = this.resize.bind(this);
            this.resize();
        }
        resize() {
            this.resizeX = window.innerWidth;
            this.resizeY = window.innerHeight;
        }
        postRender() {
            this.area.clearChanged();
        }
        preUpdate() {
            if (this.resizeX != null || this.resizeY != null) {
                this.area.bottomRight.move(this.resizeX, this.resizeY);
                this.resizeX = this.resizeY = null;
            }
        }
    }
    exports.Viewport = Viewport;
});
define("Core/ContextLayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ContextLayer {
        constructor(viewport, zindex) {
            this.viewport = viewport;
            this.zindex = zindex;
        }
        activate() {
            var canv = document.createElement("canvas");
            canv.style.setProperty("z-index", this.zindex.toString());
            document.body.appendChild(canv);
            this.ctx = canv.getContext("2d");
        }
        deactivate() {
            document.body.removeChild(this.ctx.canvas);
        }
        preUpdate() {
            if (this.viewport.area.changed()) {
                this.ctx.canvas.width = this.viewport.area.width();
                this.ctx.canvas.height = this.viewport.area.height();
            }
        }
    }
    exports.ContextLayer = ContextLayer;
});
define("Util/Array", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Array {
        static exists(el, arr) {
            return Array.indexOf(el, arr) > -1;
        }
        static indexOf(el, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === el) {
                    return i;
                }
            }
            return -1;
        }
    }
    exports.Array = Array;
});
define("Core/ElementContainer", ["require", "exports", "Core/Region"], function (require, exports, Region_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ElementRegion extends Region_1.Region {
        constructor() {
            super(...arguments);
            this.elements = new Array();
            this.requiresRedraw = false;
        }
    }
    exports.ElementRegion = ElementRegion;
    class ElementContainer {
        constructor(regionsize, area) {
            this.elements = new Map();
            this.elementsCache = new Array();
            this.regions = new Region_1.RegionContainer(regionsize, area, ElementRegion);
            this.regionsCache = Array.from(this.regions.regions.values());
            this.areasCache = Array.from(this.regions.regions.keys());
        }
        resize(area) {
            var elements = new Array();
            for (var i = 0; i < this.elementsCache.length; i++) {
                elements.push(this.elementsCache[i]);
                this.deregister(this.elementsCache[i]);
            }
            this.regions = new Region_1.RegionContainer(this.regions.len, area, ElementRegion);
            this.regionsCache = Array.from(this.regions.regions.values());
            this.areasCache = Array.from(this.regions.regions.keys());
            this.elementsCache = new Array();
            for (var i = 0; i < elements.length; i++) {
                this.register(elements[i]);
            }
        }
        get area() {
            return this.regions.area;
        }
        register(element) {
            if (this.elementsCache.indexOf(element) > -1) {
                throw "Dup registration";
            }
            this.elements.set(element, new Array());
            this.update(element, true);
            this.insertSorted(element, this.elementsCache);
        }
        deregister(element) {
            var regions = this.elements.get(element);
            for (var i = 0; i < regions.length; i++) {
                this.remove(element, regions[i--]);
            }
            this.elementsCache.splice(this.elementsCache.indexOf(element), 1);
            this.elements.delete(element);
        }
        add(element, region) {
            this.insertSorted(element, region.elements);
            this.elements.get(element).push(region);
            region.requiresRedraw = true;
        }
        remove(element, region) {
            region.elements.splice(region.elements.indexOf(element), 1);
            this.elements.get(element).splice(this.elements.get(element).indexOf(region), 1);
            region.requiresRedraw = true;
        }
        update(element, position) {
            var currentregions = this.regions.getRegions(element.area);
            if (position) {
                var oldregions = this.elements.get(element);
                for (var oldregion of oldregions) {
                    if (currentregions.indexOf(oldregion) === -1) {
                        this.remove(element, oldregion);
                    }
                }
                for (var currentregion of currentregions) {
                    if (oldregions.indexOf(currentregion) === -1) {
                        this.add(element, currentregion);
                    }
                    else {
                        currentregion.requiresRedraw = true;
                    }
                }
            }
            else {
                for (var i = 0; i < currentregions.length; i++) {
                    currentregions[i].requiresRedraw = true;
                }
            }
        }
        getRegions(area) {
            var result = new Array();
            for (var i = 0; i < this.areasCache.length; i++) {
                if (area.intersects(this.areasCache[i])) {
                    result.push(this.regions.regions.get(this.areasCache[i]));
                }
            }
            return result;
        }
        insertSorted(element, array) {
            array.splice(this.locationOfIndex(element.zIndex, array), 0, element);
        }
        locationOfIndex(index, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].zIndex >= index) {
                    return i;
                }
            }
            return array.length;
        }
    }
    exports.ElementContainer = ElementContainer;
});
define("Core/ElementType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElementType;
    (function (ElementType) {
        ElementType[ElementType["Any"] = 1] = "Any";
        ElementType[ElementType["None"] = 2] = "None";
        ElementType[ElementType["Thing"] = 4] = "Thing";
        ElementType[ElementType["StaticThing"] = 8] = "StaticThing";
        ElementType[ElementType["Mouse"] = 16] = "Mouse";
    })(ElementType = exports.ElementType || (exports.ElementType = {}));
});
define("Core/Element", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Element {
        constructor(container, type, area, zIndex, collisionFilter) {
            this.container = container;
            this.collisionFilter = collisionFilter;
            this.collisions = new Array();
            this.type = type;
            this.area = area;
            this.zIndex = zIndex;
        }
        onCollide(element, on) {
        }
        inc(offsetx, offsety) {
            this.move(this.area.origin.offsetX + offsetx, this.area.origin.offsetY + offsety);
        }
        move(offsetX, offsetY) {
            if (offsetX === this.area.origin.offsetX && offsetY === this.area.origin.offsetY) {
                return;
            }
            this.area.origin.move(offsetX, offsetY);
        }
        update(step) {
        }
        postUpdate() {
            if (this.area.changed()) {
                this.container.update(this, true);
            }
        }
        postRender() {
            this.area.clearChanged();
        }
    }
    exports.Element = Element;
});
define("IO/MouseHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CursorState;
    (function (CursorState) {
        CursorState[CursorState["added"] = 0] = "added";
        CursorState[CursorState["moved"] = 1] = "moved";
        CursorState[CursorState["remove"] = 2] = "remove";
        CursorState[CursorState["unchanged"] = 3] = "unchanged";
    })(CursorState = exports.CursorState || (exports.CursorState = {}));
    class Cursor {
        constructor(id, x, y, state) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.state = state;
        }
        static fromTouch(e) {
            return new Cursor(e.identifier, e.clientX, e.clientY, CursorState.added);
        }
    }
    exports.Cursor = Cursor;
    class MouseHandler {
        static init() {
            document.addEventListener("mousedown", MouseHandler.onMouseDown);
            document.addEventListener("mousemove", MouseHandler.onMouseMove);
            document.addEventListener("touchstart", MouseHandler.onTouchStart);
            document.addEventListener("touchend", MouseHandler.onTouchEnd);
            document.addEventListener("touchcancel", MouseHandler.onTouchEnd);
            document.addEventListener("touchmove", MouseHandler.onTouchMove);
            document.addEventListener("pointerlockchange", MouseHandler.lockChanged);
        }
        static inc(id, diffx, diffy) {
            var cursor = MouseHandler._cursors.get(id);
            if (cursor.state === CursorState.unchanged) {
                cursor.state = CursorState.moved;
            }
            cursor.x += diffx;
            cursor.y += diffy;
        }
        static preUpdate() {
            var keys = Array.from(MouseHandler._cursors.keys());
            for (var i = 0; i < keys.length; i++) {
                var cursor = MouseHandler._cursors.get(keys[i]);
                switch (cursor.state) {
                    case CursorState.added:
                        MouseHandler.cursors.set(keys[i], new Cursor(keys[i], cursor.x, cursor.y, CursorState.added));
                        break;
                    case CursorState.moved:
                        MouseHandler.cursors.get(keys[i]).x = cursor.x;
                        MouseHandler.cursors.get(keys[i]).y = cursor.y;
                        MouseHandler.cursors.get(keys[i]).state = CursorState.moved;
                        break;
                    case CursorState.remove:
                        MouseHandler.cursors.get(keys[i]).state = CursorState.remove;
                        break;
                }
                cursor.state = CursorState.unchanged;
            }
        }
        static preRender() {
            var keys = Array.from(MouseHandler.cursors.keys());
            for (var i = 0; i < keys.length; i++) {
                var cursor = MouseHandler.cursors.get(keys[i]);
                if (cursor.state === CursorState.remove) {
                    MouseHandler._cursors.delete(keys[i]);
                    MouseHandler.cursors.delete(keys[i]);
                }
                else {
                    cursor.state = CursorState.unchanged;
                }
            }
        }
        static onTouchStart(e) {
            e.preventDefault();
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (MouseHandler._cursors.get(e.changedTouches[i].identifier) != null) {
                    alert(e.changedTouches[i].identifier + " already exists");
                }
                MouseHandler._cursors.set(e.changedTouches[i].identifier, Cursor.fromTouch(e.changedTouches[i]));
            }
        }
        static onTouchEnd(e) {
            e.preventDefault();
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (MouseHandler.cursors.get(e.changedTouches[i].identifier) == null) {
                    MouseHandler._cursors.delete(e.changedTouches[i].identifier);
                }
                else {
                    MouseHandler._cursors.get(e.changedTouches[i].identifier).state = CursorState.remove;
                }
            }
        }
        static onTouchMove(e) {
            e.preventDefault();
            for (var i = 0; i < e.changedTouches.length; i++) {
                var cursor = MouseHandler._cursors.get(e.changedTouches[i].identifier);
                if (cursor.state === CursorState.unchanged) {
                    cursor.state = CursorState.moved;
                }
                cursor.x = e.changedTouches[i].clientX;
                cursor.y = e.changedTouches[i].clientY;
            }
        }
        static onMouseMove(e) {
            e.preventDefault();
            if (MouseHandler.locked) {
                MouseHandler.inc(0, e.movementX, e.movementY);
            }
            else {
                MouseHandler.mouseX = e.clientX;
                MouseHandler.mouseY = e.clientY;
            }
        }
        static onMouseDown(e) {
            e.preventDefault();
            if (!MouseHandler.locked) {
                document.body.requestPointerLock();
            }
        }
        static lockChanged() {
            if (document.pointerLockElement != null) {
                MouseHandler._cursors.set(0, new Cursor(0, MouseHandler.mouseX, MouseHandler.mouseY, CursorState.added));
                MouseHandler.locked = true;
            }
            else {
                MouseHandler.locked = false;
                MouseHandler._cursors.get(0).state = CursorState.remove;
            }
        }
    }
    MouseHandler.locked = false;
    MouseHandler._cursors = new Map();
    MouseHandler.mouseX = 0;
    MouseHandler.mouseY = 0;
    MouseHandler.cursors = new Map();
    exports.MouseHandler = MouseHandler;
});
define("IO/Mouse", ["require", "exports", "Core/Element", "Core/ElementType"], function (require, exports, Element_1, ElementType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mouse extends Element_1.Element {
        constructor(container, area, zindex) {
            super(container, ElementType_1.ElementType.Mouse, area, zindex, null);
        }
    }
    exports.Mouse = Mouse;
});
define("Core/EventHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventHandler {
        constructor() {
            this._mappings = new Map();
        }
        fire(name, data) {
            var values = this._mappings.get(name);
            if (values == null) {
                return;
            }
            for (var i = 0; i < values.length; i++) {
                values[i](data);
            }
        }
        listen(name, fn) {
            if (this._mappings.get(name) == null) {
                this._mappings.set(name, new Array());
            }
            this._mappings.get(name).push(fn);
        }
    }
    exports.EventHandler = EventHandler;
});
define("Core/Screen", ["require", "exports", "Core/Camera", "Util/Array", "Util/Collision", "Core/ContextLayer", "Util/Color", "Core/ElementContainer", "Core/Viewport"], function (require, exports, Camera_1, Array_1, Collision_3, ContextLayer_1, Color_1, ElementContainer_1, Viewport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Screen {
        constructor(regionsize, area) {
            this.visibleRegionCache = new Array();
            this.viewport = new Viewport_1.Viewport();
            this.layer = new ContextLayer_1.ContextLayer(this.viewport, 1);
            this.camera = new Camera_1.Camera(this.viewport);
            this.container = new ElementContainer_1.ElementContainer(regionsize, area);
        }
        activate() {
            this.viewport.activate();
            this.layer.activate();
        }
        deactivate() {
            this.layer.deactivate();
        }
        preUpdate() {
            this.viewport.preUpdate();
            this.camera.preUpdate();
            this.layer.preUpdate();
        }
        update(dt) {
            for (var i = 0; i < this.container.elementsCache.length; i++) {
                this.container.elementsCache[i].update(dt);
            }
        }
        postUpdate() {
            for (var i = 0; i < this.container.elementsCache.length; i++) {
                this.container.elementsCache[i].postUpdate();
            }
            this.checkCollisions();
        }
        preRender() {
            if (this.camera.area.changed()) {
                this.visibleRegionCache = this.container.getRegions(this.camera.area);
                for (var i = 0; i < this.visibleRegionCache.length; i++) {
                    this.visibleRegionCache[i].requiresRedraw = true;
                }
            }
        }
        postRender() {
            this.viewport.postRender();
            this.camera.postRender();
            for (var i = 0; i < this.container.elementsCache.length; i++) {
                this.container.elementsCache[i].postRender();
            }
        }
        checkCollisions() {
            for (var i = 0; i < this.container.regionsCache.length; i++) {
                var elements = this.container.regionsCache[i].elements;
                for (var j = 0; j < elements.length - 1; j++) {
                    this.checkExistingCollisions(elements[j]);
                    this.checkForNewCollisions(elements[j], elements, j);
                }
            }
        }
        checkForNewCollisions(element, elements, startindex) {
            for (var k = startindex + 1; k < elements.length; k++) {
                if ((element.area.changed()
                    || elements[k].area.changed()) && ((element.collisionFilter & elements[k].type) !== 0
                    || (elements[k].collisionFilter & element.type) !== 0)
                    && !Array_1.Array.exists(elements[k], element.collisions)
                    && Collision_3.Collision.intersects(element.area, elements[k].area)) {
                    if ((element.collisionFilter & elements[k].type) !== 0) {
                        element.collisions.push(elements[k]);
                        element.onCollide(elements[k], true);
                    }
                    if ((elements[k].collisionFilter & element.type) !== 0) {
                        elements[k].collisions.push(element);
                        elements[k].onCollide(element, true);
                    }
                }
            }
        }
        checkExistingCollisions(element) {
            for (var k = 0; k < element.collisions.length; k++) {
                if (!element.area.changed() && !element.collisions[k].area.changed()) {
                    continue;
                }
                if (!Collision_3.Collision.intersects(element.area, element.collisions[k].area)) {
                    var other = element.collisions[k];
                    var index = Array_1.Array.indexOf(element, other.collisions);
                    if (index > -1) {
                        other.collisions.splice(index, 1);
                        other.onCollide(element, false);
                    }
                    element.collisions.splice(k--, 1);
                    element.onCollide(other, false);
                }
            }
        }
        render() {
            for (var region of this.visibleRegionCache) {
                if (!region.requiresRedraw) {
                    continue;
                }
                this.layer.ctx.clearRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
                this.layer.ctx.save();
                this.layer.ctx.beginPath();
                this.layer.ctx.rect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
                this.layer.ctx.clip();
                if (Screen.debug_showRedraws) {
                    this.layer.ctx.fillStyle = Color_1.Color.getRandomColor();
                    this.layer.ctx.fillRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
                }
                for (var i = 0; i < region.elements.length; i++) {
                    region.elements[i].render(this.layer.ctx);
                }
                this.layer.ctx.restore();
                region.requiresRedraw = false;
            }
        }
    }
    Screen.debug_showRedraws = false;
    exports.Screen = Screen;
});
define("UI/Thing", ["require", "exports", "Core/Element", "Core/Vector", "Core/ElementType"], function (require, exports, Element_2, Vector_2, ElementType_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StaticThing extends Element_2.Element {
        constructor(container, color, area) {
            super(container, ElementType_2.ElementType.StaticThing, area, 4, ElementType_2.ElementType.Thing);
            this.color = color;
            this.color = this._color = color;
        }
        onCollide(element, on) {
            if (on && this.color === this._color) {
                this.color = "gray";
                this.container.update(this, false);
            }
            else if (!on && this.color !== this._color && this.collisions.length === 0) {
                this.color = this._color;
                this.container.update(this, false);
            }
        }
        render(ctx) {
            this.area.render(ctx, this.color);
        }
    }
    exports.StaticThing = StaticThing;
    class Thing extends Element_2.Element {
        constructor(container, color, area) {
            super(container, ElementType_2.ElementType.Thing, area, 5, ElementType_2.ElementType.StaticThing | ElementType_2.ElementType.Mouse);
            this.color = color;
            this._color = color;
            this.direction = new Vector_2.Vector(0, 0);
            this.minSpeed = this.speed = 0;
            this.maxSpeed = 20;
        }
        update(step) {
            this.speed -= .5;
            this.speed = Math.max(this.minSpeed, this.speed);
            var move = this.direction.clone().multiply(step * this.speed);
            this.inc(move.x, move.y);
            if (this.area.origin.x() <= 0 || this.area.origin.x() >= this.container.area.width()
                || this.area.origin.y() <= 0 || this.area.origin.y() >= this.container.area.height()) {
                this.direction.multiply(-1);
            }
            super.update(step);
        }
        onCollide(element, on) {
            if (this.color === this._color && this.collisions.length > 0) {
                this.color = "rgba(255,0,0,0.8)";
                this.container.update(this, false);
            }
            else if (this.color !== this._color && this.collisions.length === 0) {
                this.color = this._color;
                this.container.update(this, false);
            }
            if (on && (element.type === ElementType_2.ElementType.Mouse)) {
                this.direction = new Vector_2.Vector(this.area.origin.x() - element.area.origin.x(), this.area.origin.y() - element.area.origin.y());
                this.speed = Math.ceil(Math.random() * this.maxSpeed / 2) + this.maxSpeed / 2;
            }
        }
        render(ctx) {
            this.area.render(ctx, this.color);
        }
    }
    exports.Thing = Thing;
});
define("IO/BasicMouse", ["require", "exports", "Shape/Point", "Shape/Circle", "IO/Mouse"], function (require, exports, Point_5, Circle_1, Mouse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BasicMouse extends Mouse_1.Mouse {
        constructor(container, x, y) {
            super(container, new Circle_1.Circle(new Point_5.Point(x, y), 50), 10);
            this.color = this._color = "rgba(255,255,255,1)";
        }
        render(ctx) {
            this.area.render(ctx, this.color);
        }
    }
    exports.BasicMouse = BasicMouse;
});
define("Screen/PlayScreen", ["require", "exports", "Core/Screen", "Shape/Rectangle", "Shape/Point", "UI/Thing", "Util/Color", "Shape/Circle", "IO/BasicMouse", "IO/MouseHandler"], function (require, exports, Screen_1, Rectangle_3, Point_6, Thing_1, Color_2, Circle_2, BasicMouse_1, MouseHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayScreen extends Screen_1.Screen {
        constructor() {
            super(256, new Rectangle_3.Rectangle(new Point_6.Point(0, 0), new Point_6.Point(1024, 768)));
        }
        activate() {
            super.activate();
            for (var i = 0; i < 1800; i++) {
                var position = new Point_6.Point(Math.random() * this.container.area.width(), Math.random() * this.container.area.height());
                var thing = new Thing_1.Thing(this.container, Color_2.Color.makeRGBA(Color_2.Color.getRandomRGB(), 0.8), Math.floor(Math.random() * 2) === 1 ?
                    new Rectangle_3.Rectangle(position, new Point_6.Point(Math.floor(Math.random() * 10) + 5, Math.floor(Math.random() * 10) + 5, position))
                    : new Circle_2.Circle(position, Math.floor(Math.random() * 10) + 5));
                this.container.register(thing);
            }
            this.container.register(new Thing_1.StaticThing(this.container, "darkblue", new Circle_2.Circle(new Point_6.MidPoint(this.viewport.area.topLeft, this.viewport.area.bottomRight), 300)));
        }
        update(dt) {
            var cursors = Array.from(MouseHandler_1.MouseHandler.cursors.values());
            for (var i = 0; i < cursors.length; i++) {
                switch (cursors[i].state) {
                    case MouseHandler_1.CursorState.added:
                        cursors[i].data = new BasicMouse_1.BasicMouse(this.container, cursors[i].x, cursors[i].y);
                        this.container.register(cursors[i].data);
                        break;
                    case MouseHandler_1.CursorState.moved:
                        var x = Math.max(0, Math.min(this.camera.area.x2(), this.container.area.x2(), cursors[i].x));
                        var y = Math.max(0, Math.min(this.camera.area.y2(), this.container.area.y2(), cursors[i].y));
                        if (x !== cursors[i].x || y !== cursors[i].y) {
                            MouseHandler_1.MouseHandler.inc(cursors[i].id, x - cursors[i].x, y - cursors[i].y);
                        }
                        cursors[i].data.move(x, y);
                        break;
                    case MouseHandler_1.CursorState.remove:
                        this.container.deregister(cursors[i].data);
                        break;
                }
            }
            super.update(dt);
        }
    }
    exports.PlayScreen = PlayScreen;
});
define("Screen/LoadingScreen", ["require", "exports", "Core/Screen", "Shape/Rectangle", "Shape/Point"], function (require, exports, Screen_2, Rectangle_4, Point_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoadingScreen extends Screen_2.Screen {
        constructor() {
            super(256, new Rectangle_4.Rectangle(new Point_7.Point(0, 0, null), new Point_7.Point(0, 0, null)));
        }
        preUpdate() {
            super.preUpdate();
            if (this.camera.area.changed()) {
                this.container.resize(this.camera.area);
            }
        }
    }
    exports.LoadingScreen = LoadingScreen;
});
define("Game", ["require", "exports", "Core/Runtime", "Util/Logger", "Screen/PlayScreen", "Screen/LoadingScreen"], function (require, exports, Runtime_1, logger_1, PlayScreen_1, LoadingScreen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        static init(ver) {
            logger_1.Logger.level = logger_1.Level.Debug;
            logger_1.Logger.log("Game: Version " + ver);
            logger_1.Logger.log("Game: Log " + logger_1.Level[logger_1.Logger.level]);
            Runtime_1.Runtime.init();
            var playscreen = new PlayScreen_1.PlayScreen();
            var loadscreen = new LoadingScreen_1.LoadingScreen();
            Runtime_1.Runtime.nextScreen = playscreen;
        }
    }
    exports.Game = Game;
});
define("Core/Runtime", ["require", "exports", "IO/MouseHandler"], function (require, exports, MouseHandler_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Runtime {
        static init() {
            Runtime.fps = new FPSMeter(null, {
                decimals: 0,
                graph: 1,
                left: "5px"
            });
            MouseHandler_2.MouseHandler.init();
            Runtime.last = window.performance.now();
            requestAnimationFrame(Runtime.frame);
        }
        static frame(now) {
            try {
                if (Runtime.nextScreen != null) {
                    if (Runtime.currentScreen != null) {
                        Runtime.currentScreen.deactivate();
                    }
                    Runtime.currentScreen = Runtime.nextScreen;
                    Runtime.currentScreen.activate();
                    Runtime.nextScreen = null;
                }
                Runtime.fps.tickStart();
                if (Runtime.currentScreen != null) {
                    MouseHandler_2.MouseHandler.preUpdate();
                    Runtime.currentScreen.preUpdate();
                    Runtime.currentScreen.update(Math.min(1, (now - Runtime.last) / 1000));
                    Runtime.currentScreen.postUpdate();
                    Runtime.last = now;
                    MouseHandler_2.MouseHandler.preRender();
                    Runtime.currentScreen.preRender();
                    Runtime.currentScreen.render();
                    Runtime.currentScreen.postRender();
                }
                Runtime.fps.tick();
                requestAnimationFrame(Runtime.frame);
            }
            catch (e) {
                alert(e.message + "\n" + e.stack);
            }
        }
    }
    exports.Runtime = Runtime;
});
define("Core/Camera", ["require", "exports", "Shape/Point", "Shape/Rectangle"], function (require, exports, Point_8, Rectangle_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera {
        constructor(viewport) {
            this.viewport = viewport;
            var origin = new Point_8.Point(0, 0);
            this.area = new Rectangle_5.Rectangle(origin, new Point_8.Point(viewport.area.width(), viewport.area.height(), origin));
        }
        preUpdate() {
            if (this.viewport.area.changed()) {
                this.area.bottomRight.move(this.viewport.area.width(), this.viewport.area.height());
            }
        }
        postRender() {
            this.area.clearChanged();
        }
    }
    exports.Camera = Camera;
});
define("Unused/DI", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Lifespan;
    (function (Lifespan) {
        Lifespan[Lifespan["Transient"] = 0] = "Transient";
        Lifespan[Lifespan["Singleton"] = 1] = "Singleton";
    })(Lifespan = exports.Lifespan || (exports.Lifespan = {}));
    class Item {
        constructor(type, lifespan, args) {
            this.Instance = null;
            this.Type = type;
            this.Lifespan = lifespan;
            this.Args = args;
        }
        resolve() {
            switch (this.Lifespan) {
                case Lifespan.Transient:
                    return new this.Type(this.Args);
                case Lifespan.Singleton:
                    if (this.Instance == null)
                        this.Instance = new this.Type(this.Args);
                    return this.Instance;
                default:
                    throw "Unknown Lifespan " + this.Lifespan;
            }
        }
    }
    class DI {
        static register(interfacetype, instancetype, args, lifespan) {
            if (DI._map[interfacetype] == null)
                DI._map[interfacetype] = [];
            DI._map[interfacetype].push(new Item(instancetype, lifespan, args));
        }
        static first(interfacetype) {
            return DI.all(interfacetype)[0];
        }
        static all(interfacetype) {
            if (DI._map[interfacetype] == null)
                throw "Could not found " + interfacetype + " in DI";
            return DI.resolve(DI._map[interfacetype]);
        }
        static resolve(items) {
            var result = [];
            for (var item of items)
                result.push(item.resolve());
            return result;
        }
    }
    DI._map = {};
    exports.DI = DI;
});
//# sourceMappingURL=game.js.map