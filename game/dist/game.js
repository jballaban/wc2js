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
define("Shape/Point", ["require", "exports", "Core/Vector"], function (require, exports, Vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Point {
        constructor(offsetX, offsetY, parent) {
            this.offsetX = null;
            this.offsetY = null;
            this.children = new Array();
            this.parent = null;
            this.dirty = true;
            this.changed = true;
            this.vector = new Vector_1.Vector(0, 0);
            this.parent = parent;
            if (this.parent != null) {
                this.parent.children.push(this);
            }
            this.move(offsetX, offsetY);
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
    class DynamicPoint extends Point {
        constructor(parent, p2, dimension) {
            super(null, null, parent);
            this.p2 = p2;
            this.dimension = dimension;
            this.p2.children.push(this);
            this.recalculate();
        }
        recalculate() {
            if (!this.dirty) {
                return;
            }
            switch (this.dimension) {
                case DynamicDimension.x:
                    this.offsetX = this.p2.x() - this.parent.x();
                    break;
                case DynamicDimension.y:
                    this.offsetY = this.p2.y() - this.parent.y();
                    break;
            }
            super.recalculate();
        }
    }
    exports.DynamicPoint = DynamicPoint;
    class RatioPoint extends Point {
        constructor(ratio, parent, p2) {
            super(null, null, parent);
            this.p2 = p2;
            this.ratio = ratio;
            this.p2.children.push(this);
            this.recalculate();
        }
        recalculate() {
            if (!this.dirty) {
                return;
            }
            this.offsetX = Math.floor((this.p2.x() - this.parent.x()) * this.ratio);
            this.offsetY = Math.floor((this.p2.y() - this.parent.y()) * this.ratio);
            super.recalculate();
        }
    }
    exports.RatioPoint = RatioPoint;
    class MidPoint extends RatioPoint {
        constructor(parent, p2) {
            super(1 / 2, parent, p2);
        }
    }
    exports.MidPoint = MidPoint;
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
        constructor(point, radius) {
            this.type = IShape_1.ShapeType.Circle;
            this.center = point;
            this.r = radius;
        }
        changed() {
            return this.center.changed;
        }
        clearChanged() {
            this.center.changed = false;
        }
        x() {
            return this.center.x();
        }
        y() {
            return this.center.y();
        }
        intersects(shape) {
            return Collision_1.Collision.intersects(this, shape);
        }
        render(ctx, colour) {
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.arc(this.center.x(), this.center.y(), this.r, 0, 2 * Math.PI);
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
            var t = d.x() * (circle.center.x() - line.p1.x()) + d.y() * (circle.center.y() - line.p1.y());
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
        constructor(topleft, bottomright) {
            super();
            this.type = IShape_3.ShapeType.Rectangle;
            this.points.set(Polygon_1.Position.TopLeft, topleft);
            this.points.set(Polygon_1.Position.BottomRight, bottomright);
        }
        changed() {
            return this.topLeft().changed || this.bottomRight().changed;
        }
        clearChanged() {
            this.topLeft().changed = this.bottomRight().changed = false;
        }
        x() {
            return this.getPoint(Polygon_1.Position.TopLeft).x();
        }
        y() {
            return this.getPoint(Polygon_1.Position.TopLeft).y();
        }
        x2() {
            return this.getPoint(Polygon_1.Position.BottomRight).x();
        }
        y2() {
            return this.getPoint(Polygon_1.Position.BottomRight).y();
        }
        width() {
            return this.x2() - this.x();
        }
        height() {
            return this.y2() - this.y();
        }
        topLeft() {
            return this.points.get(Polygon_1.Position.TopLeft);
        }
        bottomRight() {
            return this.points.get(Polygon_1.Position.BottomRight);
        }
        getPoint(position) {
            var result = super.getPoint(position);
            if (result == null) {
                switch (position) {
                    case Polygon_1.Position.TopCenter:
                        result = new Point_2.MidPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.TopRight));
                        break;
                    case Polygon_1.Position.TopRight:
                        result = new Point_2.DynamicPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomRight), Point_2.DynamicDimension.x);
                        break;
                    case Polygon_1.Position.RightCenter:
                        result = new Point_2.MidPoint(this.getPoint(Polygon_1.Position.TopRight), this.getPoint(Polygon_1.Position.BottomRight));
                        break;
                    case Polygon_1.Position.BottomCenter:
                        result = new Point_2.MidPoint(this.getPoint(Polygon_1.Position.BottomLeft), this.getPoint(Polygon_1.Position.BottomRight));
                        break;
                    case Polygon_1.Position.BottomLeft:
                        result = new Point_2.DynamicPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomRight), Point_2.DynamicDimension.y);
                        break;
                    case Polygon_1.Position.LeftCenter:
                        result = new Point_2.MidPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomLeft));
                        break;
                    case Polygon_1.Position.Center:
                        result = new Point_2.MidPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomRight));
                        break;
                    default:
                        throw "Rectangle: Unknown position " + position;
                }
                this.points.set(position, result);
            }
            return result;
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
    }
    exports.Color = Color;
});
define("Core/ContextLayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ContextLayer {
        constructor(zindex) {
            var canv = document.createElement("canvas");
            canv.style.setProperty("z-index", zindex.toString());
            document.body.appendChild(canv);
            this.ctx = canv.getContext("2d");
            this.resize();
        }
        destroy() {
            document.body.removeChild(this.ctx.canvas);
        }
        resize() {
            this.ctx.canvas.width = window.innerWidth;
            this.ctx.canvas.height = window.innerHeight;
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
            this.regions = new Region_1.RegionContainer(regionsize, area, ElementRegion);
            this.regionsCache = Array.from(this.regions.regions.values());
            this.areasCache = Array.from(this.regions.regions.keys());
            this.elementsCache = new Array();
            this.visibleRegionCache = new Array();
        }
        recalculateVisibleRegions(area) {
            this.visibleRegionCache = this.getRegions(area);
            for (var i = 0; i < this.visibleRegionCache.length; i++) {
                this.visibleRegionCache[i].requiresRedraw = true;
            }
        }
        get area() {
            return this.regions.area;
        }
        register(element) {
            this.elements.set(element, new Array());
            this.update(element, true);
            this.insertSorted(element, this.elementsCache);
        }
        deregister(element) {
            for (var region of this.elements.get(element)) {
                this.remove(element, region);
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
        ElementType[ElementType["Thing"] = 0] = "Thing";
        ElementType[ElementType["StaticThing"] = 1] = "StaticThing";
        ElementType[ElementType["Mouse"] = 2] = "Mouse";
    })(ElementType = exports.ElementType || (exports.ElementType = {}));
});
define("Core/Element", ["require", "exports", "Core/Runtime"], function (require, exports, Runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Element {
        constructor(type, origin, area, zIndex) {
            this.collisions = new Array();
            this.type = type;
            this.origin = origin;
            this.area = area;
            this.zIndex = zIndex;
        }
        onCollide(element, on) {
        }
        inc(offsetx, offsety) {
            this.move(this.origin.offsetX + offsetx, this.origin.offsetY + offsety);
        }
        move(offsetX, offsetY) {
            if (offsetX === this.origin.offsetX && offsetY === this.origin.offsetY) {
                return;
            }
            this.origin.move(offsetX, offsetY);
            if (this.origin.x() < 0) {
                this.origin.move(0, null);
            }
            else if (this.origin.x() > Runtime_1.Runtime.screen.container.area.x2()) {
                this.origin.move(Runtime_1.Runtime.screen.container.area.x2(), null);
            }
            if (this.origin.y() < 0) {
                this.origin.move(null, 0);
            }
            else if (this.origin.y() > Runtime_1.Runtime.screen.container.area.y2()) {
                this.origin.move(null, Runtime_1.Runtime.screen.container.area.y2());
            }
        }
        update(step) {
        }
        onPreRender() {
            if (this.area.changed()) {
                Runtime_1.Runtime.screen.container.update(this, true);
                this.area.clearChanged();
            }
        }
    }
    exports.Element = Element;
});
define("UI/Thing", ["require", "exports", "Core/Element", "Shape/Rectangle", "Shape/Point", "Core/Vector", "Shape/Circle", "Core/Runtime", "Core/ElementType"], function (require, exports, Element_1, Rectangle_2, Point_4, Vector_2, Circle_1, Runtime_2, ElementType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StaticThing extends Element_1.Element {
        constructor(color, rect) {
            super(ElementType_1.ElementType.StaticThing, rect.topLeft(), rect, 4);
            this.color = this._color = color;
        }
        canCollide(element) {
            return element.type === ElementType_1.ElementType.Mouse;
        }
        onCollide(element, on) {
            if (on && this.color === this._color) {
                this.color = "gray";
                Runtime_2.Runtime.screen.container.update(this, false);
            }
            else if (!on && this.color !== this._color && this.collisions.length === 0) {
                this.color = this._color;
                Runtime_2.Runtime.screen.container.update(this, false);
            }
        }
        render(ctx) {
            this.area.render(ctx, this.color);
        }
    }
    exports.StaticThing = StaticThing;
    class Thing extends Element_1.Element {
        constructor(color) {
            var origin = new Point_4.Point(Math.random() * 1024, Math.random() * 768, null);
            var shape = Math.floor(Math.random() * 2) == 1 ?
                new Rectangle_2.Rectangle(origin, new Point_4.Point(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20), origin))
                : new Circle_1.Circle(origin, Math.floor(Math.random() * 20));
            super(ElementType_1.ElementType.Thing, origin, shape, 5);
            this._color = color;
            this.color = color;
            this.direction = new Vector_2.Vector(0, 0);
        }
        canCollide(element) {
            return element.type === ElementType_1.ElementType.Thing || element.type === ElementType_1.ElementType.Mouse;
        }
        update(step) {
            if (Math.random() * 2 === 1) {
                return;
            }
            var move = this.direction.clone().multiply(step);
            this.inc(move.x, move.y);
            if (this.origin.x() <= 0 || this.origin.x() >= Runtime_2.Runtime.screen.container.area.width()
                || this.origin.y() <= 0 || this.origin.y() >= Runtime_2.Runtime.screen.container.area.height()) {
                this.direction.multiply(-1);
            }
            super.update(step);
        }
        onCollide(element, on) {
            if (this.color === this._color && this.collisions.length > 0) {
                this.color = "red";
                Runtime_2.Runtime.screen.container.update(this, false);
            }
            else if (this.color !== this._color && this.collisions.length === 0) {
                this.color = this._color;
                Runtime_2.Runtime.screen.container.update(this, false);
            }
            if (on && element.type === ElementType_1.ElementType.Thing) {
                element.direction = new Vector_2.Vector(element.origin.x() - this.origin.x(), element.origin.y() - this.origin.y());
            }
        }
        render(ctx) {
            this.area.render(ctx, this.color);
        }
    }
    exports.Thing = Thing;
});
define("UI/Light", ["require", "exports", "Shape/Point", "Core/Runtime", "Shape/IShape", "Util/Collision", "Shape/Line"], function (require, exports, Point_5, Runtime_3, IShape_4, Collision_3, Line_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Light {
        constructor(area, spread, color) {
            this.area = area;
            this.spread = spread;
            this.color = color;
        }
        update() {
            this.paths = new Array();
            var ray = new Line_1.Line(this.area.center, new Point_5.Point(0, 0, this.area.center));
            for (var angle = 0; angle < 360; angle += 5) {
                var p = new Point_5.Point(this.spread * Math.cos(Math.PI * angle / 180.0), this.spread * Math.sin(Math.PI * angle / 180.0), ray.p1);
                for (var i = 0; i < Runtime_3.Runtime.screen.mouse.collisions.length; i++) {
                    if (Runtime_3.Runtime.screen.mouse.collisions[i].area.type === IShape_4.ShapeType.Circle) {
                        var point = Collision_3.Collision.getIntersectionLineCircle(new Line_1.Line(ray.p1, p), Runtime_3.Runtime.screen.mouse.collisions[i].area);
                        if (point != null) {
                            p = point;
                        }
                    }
                }
                this.paths.push(p);
            }
            Runtime_3.Runtime.screen.container.update(Runtime_3.Runtime.screen.mouse, false);
        }
        draw(ctx) {
            var gr = ctx.createRadialGradient(this.area.center.x(), this.area.center.y(), 5, this.area.center.x(), this.area.center.y(), this.area.r);
            gr.addColorStop(0, 'rgba(255,255,255,0.5)');
            gr.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.moveTo(this.paths[0].x(), this.paths[0].y());
            for (var i = 1; i < this.paths.length; i++) {
                ctx.lineTo(this.paths[i].x(), this.paths[i].y());
            }
            ctx.fill();
        }
    }
    exports.Light = Light;
});
define("IO/Mouse", ["require", "exports", "Core/Element", "Shape/Point", "Shape/Circle", "Core/Runtime", "Core/ElementType"], function (require, exports, Element_2, Point_6, Circle_2, Runtime_4, ElementType_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mouse extends Element_2.Element {
        constructor() {
            var origin = new Point_6.Point(0, 0, null);
            super(ElementType_2.ElementType.Mouse, origin, new Circle_2.Circle(origin, 4), 10);
            this.color = this._color = "rgba(255,255,255,0.5)";
            this.moveX = null;
            this.moveY = null;
        }
        canCollide(element) {
            return true;
        }
        onMove(offsetX, offsetY) {
            this.moveX += offsetX;
            this.moveY += offsetY;
        }
        update(step) {
            super.update(step);
            if (this.moveX !== 0 || this.moveY !== 0) {
                this.move(this.origin.x() + this.moveX, this.origin.y() + this.moveY);
                if (this.origin.x() > Runtime_4.Runtime.screen.camera.area.width()) {
                    this.move(Runtime_4.Runtime.screen.camera.area.width(), null);
                }
                if (this.origin.y() > Runtime_4.Runtime.screen.camera.area.height()) {
                    this.move(null, Runtime_4.Runtime.screen.camera.area.height());
                }
                this.moveX = 0;
                this.moveY = 0;
            }
        }
        render(ctx) {
            this.area.render(ctx, this.color);
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
define("UI/Screen", ["require", "exports", "Core/Camera", "IO/Mouse", "Util/Array", "Util/Collision", "Core/Runtime", "Core/ElementContainer"], function (require, exports, Camera_1, Mouse_1, Array_1, Collision_4, Runtime_5, ElementContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Screen {
        constructor(regionsize, area) {
            this.camera = new Camera_1.Camera();
            this.container = new ElementContainer_1.ElementContainer(regionsize, area);
            this.mouse = new Mouse_1.Mouse();
            this.container.register(this.mouse);
        }
        moveCamera(offsetX, offsetY) {
            if (this.camera.area.width() + offsetX > this.container.area.x2()) {
                offsetX = this.container.area.x2() - this.camera.area.width();
            }
            if (this.camera.area.height() + offsetY > this.container.area.y2()) {
                offsetY = this.container.area.y2() - this.camera.area.height();
            }
            this.camera.move(offsetX, offsetY);
            this.container.recalculateVisibleRegions(this.camera.area);
        }
        onResize() {
            this.camera.resize();
            this.container.recalculateVisibleRegions(this.camera.area);
        }
        onActivate() {
            this.onResize();
        }
        update(dt) {
            this.moveCamera(this.camera.area.topLeft().x() + 1, null);
            this.doUpdates(dt);
            this.preRender();
            this.checkCollisions();
        }
        doUpdates(dt) {
            for (var i = 0; i < this.container.elementsCache.length; i++) {
                this.container.elementsCache[i].update(dt);
            }
        }
        preRender() {
            for (var i = 0; i < this.container.elementsCache.length; i++) {
                this.container.elementsCache[i].onPreRender();
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
                if (!element.area.changed && !elements[k].area.changed) {
                    continue;
                }
                if (Array_1.Array.exists(elements[k], element.collisions)) {
                    continue;
                }
                if (element.canCollide(elements[k])
                    && elements[k].canCollide(element)
                    && Collision_4.Collision.intersects(element.area, elements[k].area)) {
                    element.collisions.push(elements[k]);
                    elements[k].collisions.push(element);
                    element.onCollide(elements[k], true);
                    elements[k].onCollide(element, true);
                }
            }
        }
        checkExistingCollisions(element) {
            for (var k = 0; k < element.collisions.length; k++) {
                if (!element.area.changed && !element.collisions[k].area.changed) {
                    continue;
                }
                if (!element.canCollide(element.collisions[k])
                    || !element.collisions[k].canCollide(element)
                    || !Collision_4.Collision.intersects(element.area, element.collisions[k].area)) {
                    var other = element.collisions[k];
                    other.collisions.splice(Array_1.Array.indexOf(element, other.collisions), 1);
                    other.onCollide(element, false);
                    element.collisions.splice(k--, 1);
                    element.onCollide(other, false);
                }
            }
        }
        render() {
            for (var region of Runtime_5.Runtime.screen.container.visibleRegionCache) {
                if (!region.requiresRedraw) {
                    continue;
                }
                Runtime_5.Runtime.ctx.ctx.clearRect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
                Runtime_5.Runtime.ctx.ctx.save();
                Runtime_5.Runtime.ctx.ctx.beginPath();
                Runtime_5.Runtime.ctx.ctx.rect(region.area.x(), region.area.y(), region.area.width(), region.area.height());
                Runtime_5.Runtime.ctx.ctx.clip();
                for (var i = 0; i < region.elements.length; i++) {
                    region.elements[i].render(Runtime_5.Runtime.ctx.ctx);
                }
                Runtime_5.Runtime.ctx.ctx.restore();
                region.requiresRedraw = false;
            }
        }
    }
    exports.Screen = Screen;
});
define("Play/Loading/LoadingScreen", ["require", "exports", "UI/Screen", "Shape/Rectangle", "Shape/Point", "UI/Thing", "Util/Color", "Core/Vector"], function (require, exports, Screen_1, Rectangle_3, Point_7, Thing_1, Color_1, Vector_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoadingScreen extends Screen_1.Screen {
        constructor() {
            super(256, new Rectangle_3.Rectangle(new Point_7.Point(0, 0, null), new Point_7.Point(1024, 768, null)));
            for (var i = 0; i < 600; i++) {
                var thing = new Thing_1.Thing(Color_1.Color.getRandomColor());
                thing.direction = new Vector_3.Vector(Math.random() * 40 - 20, Math.random() * 40 - 20);
                this.container.register(thing);
            }
        }
    }
    exports.LoadingScreen = LoadingScreen;
});
define("Game", ["require", "exports", "Core/Runtime", "Util/Logger", "Play/Loading/LoadingScreen"], function (require, exports, Runtime_6, logger_1, LoadingScreen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        static init(ver) {
            logger_1.Logger.level = logger_1.Level.Debug;
            logger_1.Logger.log("Game: Version " + ver);
            logger_1.Logger.log("Game: Log " + logger_1.Level[logger_1.Logger.level]);
            Runtime_6.Runtime.init();
            var startscreen = new LoadingScreen_1.LoadingScreen();
            Runtime_6.Runtime.start(startscreen);
        }
    }
    exports.Game = Game;
});
define("IO/MouseHandler", ["require", "exports", "Core/Runtime"], function (require, exports, Runtime_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MouseHandler {
        static init() {
            document.addEventListener("mousemove", MouseHandler.mouseMove);
            document.addEventListener("touchmove", MouseHandler.mouseMove, false);
            document.addEventListener("pointerlockchange", MouseHandler.lockChanged);
            document.body.onclick = document.body.requestPointerLock;
        }
        static mouseMove(e) {
            if (MouseHandler.locked) {
                Runtime_7.Runtime.screen.mouse.onMove(e.movementX, e.movementY);
            }
        }
        static lockChanged() {
            MouseHandler.locked = document.pointerLockElement != null;
        }
    }
    MouseHandler.x = 0;
    MouseHandler.y = 0;
    MouseHandler.locked = false;
    exports.MouseHandler = MouseHandler;
});
define("Core/Runtime", ["require", "exports", "Core/ContextLayer", "IO/MouseHandler"], function (require, exports, ContextLayer_1, MouseHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Runtime {
        static init() {
            Runtime.ctx = new ContextLayer_1.ContextLayer(1);
            window.onresize = Runtime.onWindowResize;
            Runtime.fps = new FPSMeter(null, {
                decimals: 0,
                graph: 1,
                left: "5px"
            });
            MouseHandler_1.MouseHandler.init();
            Runtime.play = false;
        }
        static onWindowResize() {
            Runtime.screen.onResize();
            Runtime.ctx.resize();
        }
        static start(startscreen) {
            while (Runtime.screen != null) {
                Runtime.play = false;
            }
            Runtime.screen = startscreen;
            Runtime.screen.onActivate();
            Runtime.last = window.performance.now();
            Runtime.play = true;
            requestAnimationFrame(Runtime.frame);
        }
        static update(step) {
            Runtime.screen.update(step);
        }
        static render() {
            Runtime.screen.render();
        }
        static frame(now) {
            if (!Runtime.play) {
                Runtime.screen = null;
                return;
            }
            Runtime.fps.tickStart();
            Runtime.update(Math.min(1, (now - Runtime.last) / 1000));
            Runtime.render();
            Runtime.last = now;
            Runtime.fps.tick();
            requestAnimationFrame(Runtime.frame);
        }
    }
    exports.Runtime = Runtime;
});
define("Core/Camera", ["require", "exports", "Shape/Point", "Shape/Rectangle"], function (require, exports, Point_8, Rectangle_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera {
        constructor() {
            var origin = new Point_8.Point(0, 0, null);
            this.area = new Rectangle_4.Rectangle(origin, new Point_8.Point(0, 0, origin));
        }
        move(offsetX, offsetY) {
            this.area.topLeft().move(offsetX, offsetY);
        }
        resize() {
            this.area.bottomRight().move(window.innerWidth, window.innerHeight);
        }
        render() {
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