define("Shape/Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Point {
        constructor(offsetX, offsetY, parent) {
            this.x = 0;
            this.y = 0;
            this.offsetX = null;
            this.offsetY = null;
            this.children = new Array();
            this.parent = null;
            this.parent = parent;
            if (this.parent != null) {
                this.parent.children.push(this);
            }
            this.move(offsetX, offsetY);
        }
        recalculate() {
            var x = this.calculate("x");
            var y = this.calculate("y");
            if (x === this.x && y === this.y) {
                return;
            }
            this.x = x;
            this.y = y;
            for (var child of this.children) {
                child.recalculate();
            }
        }
        move(offsetX, offsetY) {
            if ((offsetX == null || offsetX === this.offsetX)
                && (offsetY == null || offsetY === this.offsetY)) {
                return;
            }
            if (offsetX != null) {
                this.offsetX = offsetX;
            }
            if (offsetY != null) {
                this.offsetY = offsetY;
            }
            this.recalculate();
        }
        calculate(field) {
            var result = 0;
            if (this.parent != null) {
                result = this.parent[field];
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
            switch (this.dimension) {
                case DynamicDimension.x:
                    this.offsetX = this.p2.x - this.parent.x;
                    break;
                case DynamicDimension.y:
                    this.offsetY = this.p2.y - this.parent.y;
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
            this.offsetX = Math.floor((this.p2.x - this.parent.x) * this.ratio);
            this.offsetY = Math.floor((this.p2.y - this.parent.y) * this.ratio);
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
});
define("Shape/Circle", ["require", "exports", "Shape/Point", "Util/Collision"], function (require, exports, Point_1, Collision_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Circle extends Point_1.Point {
        constructor(point, radius) {
            super(0, 0, point);
            this.r = radius;
        }
        intersects(shape) {
            return Collision_1.Collision.intersects(this, shape);
        }
        render(ctx, colour) {
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    exports.Circle = Circle;
});
define("Util/Collision", ["require", "exports", "Shape/Rectangle", "Shape/Circle"], function (require, exports, Rectangle_1, Circle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Collision {
        static intersects(shape1, shape2) {
            if (shape1 instanceof Rectangle_1.Rectangle && shape2 instanceof Rectangle_1.Rectangle) {
                return Collision.rectRectIntersect(shape1, shape2);
            }
            else if (shape1 instanceof Circle_1.Circle && shape2 instanceof Rectangle_1.Rectangle) {
                return Collision.rectCircleIntersect(shape2, shape1);
            }
            else if (shape1 instanceof Rectangle_1.Rectangle && shape2 instanceof Circle_1.Circle) {
                return Collision.rectCircleIntersect(shape1, shape2);
            }
            else if (shape1 instanceof Circle_1.Circle && shape2 instanceof Circle_1.Circle) {
                return Collision.circleCircleIntersect(shape1, shape2);
            }
            throw "Unknown";
        }
        static circleCircleIntersect(circle1, circle2) {
            if (circle1.x + circle1.r + circle2.r > circle2.x
                && circle1.x < circle2.x + circle1.r + circle2.r
                && circle1.y + circle1.r + circle2.r > circle2.y
                && circle1.y < circle2.y + circle1.r + circle2.r) {
                var distance = Math.sqrt((circle1.x - circle2.x) * (circle1.x - circle2.x)
                    + ((circle1.y - circle2.y) * (circle1.y - circle2.y)));
                if (distance < circle1.r + circle2.r) {
                    return true;
                }
            }
            return false;
        }
        static rectCircleIntersect(rect, circle) {
            var distX = Math.abs(circle.x - rect.x() - rect.width() / 2);
            var distY = Math.abs(circle.y - rect.y() - rect.height() / 2);
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
define("Shape/Rectangle", ["require", "exports", "Shape/Polygon", "Shape/Point", "Util/Collision"], function (require, exports, Polygon_1, Point_2, Collision_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Rectangle extends Polygon_1.Polygon {
        constructor(topleft, bottomright) {
            super();
            this.points.set(Polygon_1.Position.TopLeft, topleft);
            this.points.set(Polygon_1.Position.BottomRight, bottomright);
        }
        x() {
            return this.getPoint(Polygon_1.Position.TopLeft).x;
        }
        y() {
            return this.getPoint(Polygon_1.Position.TopLeft).y;
        }
        x2() {
            return this.getPoint(Polygon_1.Position.BottomRight).x;
        }
        y2() {
            return this.getPoint(Polygon_1.Position.BottomRight).y;
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
define("Core/Region", ["require", "exports", "Shape/Rectangle", "Shape/Point"], function (require, exports, Rectangle_2, Point_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Region {
    }
    exports.Region = Region;
    class BooleanRegion extends Region {
        constructor() {
            super(...arguments);
            this.value = false;
        }
    }
    exports.BooleanRegion = BooleanRegion;
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
                    this.regions.set(new Rectangle_2.Rectangle(new Point_3.Point(x * len, y * len, null), new Point_3.Point(width, height, null)), new this.regionType());
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
define("Core/Element", ["require", "exports", "Core/Region"], function (require, exports, Region_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events;
    (function (Events) {
        Events[Events["drawDirty"] = 0] = "drawDirty";
        Events[Events["registerCollision"] = 1] = "registerCollision";
        Events[Events["deregisterCollision"] = 2] = "deregisterCollision";
    })(Events = exports.Events || (exports.Events = {}));
    class Element {
        constructor(origin, area, layer) {
            this.collisions = new Array();
            this.requiresRedraw = true;
            this.origin = origin;
            this.area = area;
            this.layer = layer;
        }
        collides(element) {
            return this.area.intersects(element.area);
        }
        inc(offsetx, offsety) {
            this.move(this.origin.offsetX + offsetx, this.origin.offsetY + offsety);
        }
        move(offsetX, offsetY) {
            this.layer.markForRedraw(this.area);
            this.origin.move(offsetX, offsetY);
            this.layer.markForRedraw(this.area);
            this.requiresRedraw = true;
        }
        update(step) {
            return;
        }
        render() {
            var result = this.requiresRedraw || this.layer.shouldRedraw(this.area);
            this.requiresRedraw = false;
            return result;
        }
    }
    exports.Element = Element;
    class ElementRegion extends Region_1.Region {
        constructor() {
            super(...arguments);
            this.elements = new Array();
        }
    }
    exports.ElementRegion = ElementRegion;
    class ElementContainer {
        constructor(regionsize, area) {
            this.elements = new Array();
            this.regions = new Region_1.RegionContainer(regionsize, area, ElementRegion);
        }
        add(element) {
            this.elements.push(element);
            for (var region of this.regions.getRegions(element.area)) {
                region.elements.push(element);
            }
            return element;
        }
        getElements(area) {
            if (area == null) {
                return this.elements;
            }
            var result = [];
            for (var region of this.regions.getRegions(area)) {
                result.concat(region.elements);
            }
            return Array.from(new Set(result));
        }
    }
    exports.ElementContainer = ElementContainer;
});
define("IO/Mouse", ["require", "exports", "Core/Element", "Shape/Point", "Shape/Circle"], function (require, exports, Element_1, Point_4, Circle_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mouse extends Element_1.Element {
        constructor(layer) {
            var origin = new Point_4.Point(0, 0, null);
            super(origin, new Circle_2.Circle(origin, 10), layer);
        }
        render() {
            if (!super.render()) {
                return false;
            }
            var color = this.collisions.length === 0 ? "#000000" : "#FF0000";
            this.area.render(this.layer.ctx, color);
            return true;
        }
    }
    exports.Mouse = Mouse;
});
define("UI/Screen", ["require", "exports", "Core/Viewport"], function (require, exports, Viewport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Screen {
        constructor() {
            this.elements = new Array();
        }
        update(step) {
            for (var element of this.elements) {
                element.update(step);
            }
            for (var el of this.elements) {
                for (var i = 0; i < el.collisions.length; i++) {
                    if (!el.collides(el.collisions[i])) {
                        el.collisions[i].collisions.splice(el.collisions[i].collisions.indexOf(el, 0), 1);
                        el.collisions.splice(i--, 1);
                    }
                }
            }
            for (var i = 0; i < this.elements.length - 1; i++) {
                for (var j = i + 1; j < this.elements.length; j++) {
                    if (this.elements[i].collisions.indexOf(this.elements[j]) > -1) {
                        continue;
                    }
                    if (this.elements[i].collides(this.elements[j])) {
                        this.elements[i].collisions.push(this.elements[j]);
                        this.elements[j].collisions.push(this.elements[i]);
                    }
                }
            }
        }
        render() {
            for (var layer of Viewport_1.Viewport.layers.values()) {
                layer.renderStart();
            }
            for (var el of this.elements) {
                el.render();
            }
            for (var layer of Viewport_1.Viewport.layers.values()) {
                layer.renderComplete();
            }
        }
    }
    exports.Screen = Screen;
});
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
define("UI/Thing", ["require", "exports", "IO/Mouse", "Core/Element", "Core/Viewport", "Shape/Rectangle", "Shape/Point", "Core/Vector", "Shape/Circle"], function (require, exports, Mouse_1, Element_2, Viewport_2, Rectangle_3, Point_5, Vector_1, Circle_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StaticThing extends Element_2.Element {
        constructor(layer, color, rect) {
            super(null, rect, layer);
            this._color = color;
        }
        update(step) {
            super.update(step);
            if (this.color === this._color && this.collisions.length > 0) {
                this.color = "red";
                this.requiresRedraw = true;
            }
            else if (this.color !== this._color && this.collisions.length === 0) {
                this.color = this._color;
                this.requiresRedraw = true;
            }
        }
        render() {
            if (!super.render()) {
                return false;
            }
            console.log("reder");
            this.area.render(this.layer.ctx, this.color);
            return true;
        }
    }
    exports.StaticThing = StaticThing;
    class Thing extends Element_2.Element {
        constructor(layer, color) {
            var origin = new Point_5.Point(0, 0, null);
            var shape = Math.floor(Math.random() * 2) === 0 ?
                new Rectangle_3.Rectangle(origin, new Point_5.Point(Math.floor(Math.random() * 50), Math.floor(Math.random() * 25), origin))
                : new Circle_3.Circle(origin, Math.floor(Math.random() * 25));
            super(origin, shape, layer);
            this._color = color;
            this.color = color;
            this.direction = new Vector_1.Vector(Math.random() * 40 - 20, Math.random() * 40 - 20);
        }
        collides(element) {
            if (element instanceof Thing || element instanceof Mouse_1.Mouse) {
                return super.collides(element);
            }
            return false;
        }
        update(step) {
            super.update(step);
            var move = this.direction.clone().multiply(step);
            this.inc(move.x, move.y);
            if (this.origin.x > Viewport_2.Viewport.area.x2()) {
                this.move(0, null);
            }
            if (this.origin.x < 0) {
                this.move(Viewport_2.Viewport.area.x2(), null);
            }
            if (this.origin.y > Viewport_2.Viewport.area.y2()) {
                this.move(null, 0);
            }
            if (this.origin.y < 0) {
                this.move(null, Viewport_2.Viewport.area.y2());
            }
            if (this.color === this._color && this.collisions.length > 0) {
                this.color = "red";
                this.requiresRedraw = true;
            }
            else if (this.color !== this._color && this.collisions.length === 0) {
                this.color = this._color;
                this.requiresRedraw = true;
            }
        }
        render() {
            if (!super.render()) {
                return false;
            }
            this.area.render(this.layer.ctx, this.color);
            return true;
        }
    }
    exports.Thing = Thing;
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
define("Play/Loading/LoadingScreen", ["require", "exports", "UI/Screen", "Shape/Rectangle", "Core/Viewport", "Shape/Polygon", "Shape/Point", "UI/Thing", "Core/ContextLayer", "IO/Mouse", "Util/Color"], function (require, exports, Screen_1, Rectangle_4, Viewport_3, Polygon_2, Point_6, Thing_1, ContextLayer_1, Mouse_2, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoadingScreen extends Screen_1.Screen {
        constructor() {
            super();
            Viewport_3.Viewport.reset();
            Viewport_3.Viewport.layers.set("items", new ContextLayer_1.ContextLayer(1 / 8, 2));
            for (var i = 0; i < 1; i++) {
                this.elements.push(new Thing_1.Thing(Viewport_3.Viewport.layers.get("items"), Color_1.Color.getRandomColor()));
            }
            Viewport_3.Viewport.layers.set("background", new ContextLayer_1.ContextLayer(1 / 2, 1));
            this.elements.push(new Thing_1.StaticThing(Viewport_3.Viewport.layers.get("background"), "darkblue", new Rectangle_4.Rectangle(new Point_6.MidPoint(Viewport_3.Viewport.area.topLeft(), Viewport_3.Viewport.area.getPoint(Polygon_2.Position.Center)), new Point_6.MidPoint(Viewport_3.Viewport.area.getPoint(Polygon_2.Position.Center), Viewport_3.Viewport.area.bottomRight()))));
            Viewport_3.Viewport.layers.set("mouse", new ContextLayer_1.ContextLayer(1 / 8, 10));
            this.mouse = new Mouse_2.Mouse(Viewport_3.Viewport.layers.get("mouse"));
            this.elements.push(this.mouse);
        }
    }
    exports.LoadingScreen = LoadingScreen;
});
define("Game", ["require", "exports", "Core/Runtime", "Util/Logger", "Play/Loading/LoadingScreen"], function (require, exports, Runtime_1, logger_1, LoadingScreen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        static init(ver) {
            logger_1.Logger.level = logger_1.Level.Debug;
            logger_1.Logger.log("Game: Version " + ver);
            logger_1.Logger.log("Game: Log " + logger_1.Level[logger_1.Logger.level]);
            Runtime_1.Runtime.init();
            var startscreen = new LoadingScreen_1.LoadingScreen();
            Runtime_1.Runtime.start(startscreen);
        }
    }
    exports.Game = Game;
});
define("IO/MouseHandler", ["require", "exports", "Core/Runtime"], function (require, exports, Runtime_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MouseHandler {
        static init() {
            document.addEventListener('mousemove', MouseHandler.mouseMove);
            document.addEventListener('pointerlockchange', MouseHandler.lockChanged);
            document.body.onclick = function () {
                document.body.requestPointerLock();
            };
        }
        static mouseMove(e) {
            if (MouseHandler.locked) {
                MouseHandler.x = Math.min(window.innerWidth, Math.max(0, MouseHandler.x + e.movementX));
                MouseHandler.y = Math.min(window.innerHeight, Math.max(0, MouseHandler.y + e.movementY));
                Runtime_2.Runtime.screen.mouse.move(MouseHandler.x, MouseHandler.y);
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
define("Core/Runtime", ["require", "exports", "Core/Viewport", "IO/MouseHandler"], function (require, exports, Viewport_4, MouseHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Runtime {
        static init() {
            Viewport_4.Viewport.init();
            Runtime.fps = new FPSMeter(null, {
                decimals: 0,
                graph: 1,
                left: "5px"
            });
            MouseHandler_1.MouseHandler.init();
        }
        static start(startscreen) {
            Runtime.screen = startscreen;
            Runtime.last = window.performance.now();
            requestAnimationFrame(Runtime.frame);
        }
        static update(step) {
            Runtime.screen.update(step);
        }
        static render() {
            Runtime.screen.render();
        }
        static frame(now) {
            Runtime.fps.tickStart();
            Runtime.dt += Math.min(1, (now - Runtime.last) / 1000);
            while (Runtime.dt > Runtime.step) {
                Runtime.dt = Runtime.dt - Runtime.step;
                Runtime.update(Runtime.step);
            }
            Runtime.render();
            Runtime.last = now;
            Runtime.fps.tick();
            requestAnimationFrame(Runtime.frame);
        }
    }
    Runtime.dt = 0;
    Runtime.step = 1 / 60;
    exports.Runtime = Runtime;
});
define("Core/Viewport", ["require", "exports", "Shape/Point", "Shape/Rectangle"], function (require, exports, Point_7, Rectangle_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Viewport {
        static init() {
            Viewport.area = new Rectangle_5.Rectangle(new Point_7.Point(0, 0, null), new Point_7.Point(0, 0, null));
            Viewport.resize();
            window.onresize = Viewport.resize;
        }
        static reset() {
            for (var layer of Viewport.layers.values()) {
                layer.destroy();
            }
            Viewport.layers = new Map();
        }
        static resize() {
            for (var layer of Viewport.layers.values()) {
                layer.resize();
            }
            Viewport.area.bottomRight().move(window.innerWidth, window.innerHeight);
        }
    }
    Viewport.layers = new Map();
    exports.Viewport = Viewport;
});
define("Core/ContextLayer", ["require", "exports", "Core/Viewport", "Core/Region"], function (require, exports, Viewport_5, Region_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ContextLayer {
        constructor(ratio, zindex) {
            this.ratio = ratio;
            var canv = document.createElement("canvas");
            canv.style.setProperty("z-index", zindex.toString());
            document.body.appendChild(canv);
            this.ctx = canv.getContext("2d");
            this.resize();
        }
        destroy() {
            document.body.removeChild(this.ctx.canvas);
        }
        renderStart() {
            for (var rect of this.regions.regions.keys()) {
                if (this.regions.regions.get(rect).value) {
                    this.ctx.clearRect(rect.x(), rect.y(), rect.width(), rect.height());
                }
            }
        }
        renderComplete() {
            for (var region of this.regions.regions.values()) {
                region.value = false;
            }
        }
        markForRedraw(area) {
            for (var region of this.regions.getRegions(area)) {
                region.value = true;
            }
        }
        shouldRedraw(shape) {
            for (var region of this.regions.getRegions(shape)) {
                if (region.value) {
                    return true;
                }
            }
            return false;
        }
        resize() {
            this.ctx.canvas.width = window.innerWidth;
            this.ctx.canvas.height = window.innerHeight;
            this.regions = new Region_2.RegionContainer(Math.ceil(Viewport_5.Viewport.area.width() * this.ratio), Viewport_5.Viewport.area, Region_2.BooleanRegion);
        }
    }
    exports.ContextLayer = ContextLayer;
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