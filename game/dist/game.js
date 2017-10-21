define("UI/Point", ["require", "exports"], function (require, exports) {
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
        inc(offsetX, offsetY) {
            this.move(this.offsetX + offsetX, this.offsetY + offsetY);
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
    class MidPoint extends Point {
        constructor(parent, p2) {
            super(null, null, parent);
            this.p2 = p2;
            this.p2.children.push(this);
            this.recalculate();
        }
        recalculate() {
            this.offsetX = (this.p2.x - this.parent.x) / 2;
            this.offsetY = (this.p2.y - this.parent.y) / 2;
            super.recalculate();
        }
    }
    exports.MidPoint = MidPoint;
});
define("UI/Polygon", ["require", "exports"], function (require, exports) {
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
define("UI/Rectangle", ["require", "exports", "UI/Polygon", "UI/Point"], function (require, exports, Polygon_1, Point_1) {
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
                        result = new Point_1.MidPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.TopRight));
                        break;
                    case Polygon_1.Position.TopRight:
                        result = new Point_1.DynamicPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomRight), Point_1.DynamicDimension.x);
                        break;
                    case Polygon_1.Position.RightCenter:
                        result = new Point_1.MidPoint(this.getPoint(Polygon_1.Position.TopRight), this.getPoint(Polygon_1.Position.BottomRight));
                        break;
                    case Polygon_1.Position.BottomCenter:
                        result = new Point_1.MidPoint(this.getPoint(Polygon_1.Position.BottomLeft), this.getPoint(Polygon_1.Position.BottomRight));
                        break;
                    case Polygon_1.Position.BottomLeft:
                        result = new Point_1.DynamicPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomRight), Point_1.DynamicDimension.y);
                        break;
                    case Polygon_1.Position.LeftCenter:
                        result = new Point_1.MidPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomLeft));
                        break;
                    case Polygon_1.Position.Center:
                        result = new Point_1.MidPoint(this.getPoint(Polygon_1.Position.TopLeft), this.getPoint(Polygon_1.Position.BottomRight));
                        break;
                    default:
                        throw "Rectangle: Unknown position " + position;
                }
                this.points.set(position, result);
            }
            return result;
        }
        intersects(rect) {
            if (rect.x() > this.x2() || rect.x2() < this.x())
                return false;
            if (rect.y() > this.y2() || rect.y2() < this.y())
                return false;
            return true;
        }
    }
    exports.Rectangle = Rectangle;
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
define("UI/Screen", ["require", "exports", "UI/Viewport"], function (require, exports, Viewport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Screen {
        constructor() {
            this.elements = new Array();
        }
        update(step) {
            for (var element of this.elements) {
                Viewport_1.Viewport.layer("foreground").markForRedraw(element);
                element.topLeft().inc(Math.floor(Math.random() * 2), Math.floor(Math.random() * 2));
                if (element.x() > Viewport_1.Viewport.area.x2())
                    element.topLeft().move(0, null);
                if (element.y() > Viewport_1.Viewport.area.y2())
                    element.topLeft().move(null, 0);
                Viewport_1.Viewport.layer("foreground").markForRedraw(element);
            }
        }
        render() {
            var foreground = Viewport_1.Viewport.layer("foreground");
            foreground.renderStart();
            for (var element of this.elements) {
                if (!foreground.shouldRedraw(element)) {
                    continue;
                }
                foreground.ctx.fillStyle = "#FF0000";
                foreground.ctx.fillRect(element.x(), element.y(), element.width(), element.height());
            }
            foreground.renderComplete();
        }
    }
    exports.Screen = Screen;
});
define("Play/Loading/LoadingScreen", ["require", "exports", "UI/Screen", "UI/Rectangle", "UI/Point"], function (require, exports, Screen_1, Rectangle_1, Point_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoadingScreen extends Screen_1.Screen {
        constructor() {
            super();
            var origin = new Point_2.Point(0, 0, null);
            this.elements.push(new Rectangle_1.Rectangle(origin, new Point_2.Point(100, 50, origin)));
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
define("Core/Runtime", ["require", "exports", "UI/Viewport"], function (require, exports, Viewport_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Runtime {
        static init() {
            Viewport_2.Viewport.init();
            Runtime.fps = new FPSMeter(null, {
                decimals: 0,
                graph: 1,
                left: "5px"
            });
        }
        static start(startscreen) {
            Runtime.screen = startscreen;
            Runtime.last = window.performance.now();
            window.onresize = Viewport_2.Viewport.resize;
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
define("UI/PrimitiveRectangle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PrimitiveRectangle {
        constructor(x, y, x2, y2) {
            this.x = x;
            this.y = y;
            this.x2 = x2;
            this.y2 = y2;
        }
    }
    exports.PrimitiveRectangle = PrimitiveRectangle;
});
define("UI/Viewport", ["require", "exports", "UI/Point", "UI/Rectangle", "Core/ContextLayer"], function (require, exports, Point_3, Rectangle_2, ContextLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Viewport {
        static init() {
            Viewport.area = new Rectangle_2.Rectangle(new Point_3.Point(0, 0, null), new Point_3.Point(0, 0, null));
            Viewport.resize();
        }
        static layer(name) {
            var ctx = Viewport.layers.get(name);
            if (ctx == null) {
                ctx = new ContextLayer_1.QuarteredContextLayer();
                Viewport.layers.set(name, ctx);
            }
            return ctx;
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
define("Core/ContextLayer", ["require", "exports", "UI/Rectangle", "UI/Viewport", "UI/Polygon"], function (require, exports, Rectangle_3, Viewport_3, Polygon_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ContextLayer {
        constructor() {
            this.redrawAreas = new Map();
            var canv = document.createElement("canvas");
            document.body.appendChild(canv);
            this.ctx = canv.getContext("2d");
            this.resize();
        }
        renderStart() {
            for (var region of this.redrawAreas.keys()) {
                if (this.redrawAreas.get(region)) {
                    this.ctx.clearRect(region.x(), region.y(), region.width(), region.height());
                }
            }
        }
        renderComplete() {
            for (var region of this.redrawAreas.keys()) {
                if (this.redrawAreas.get(region)) {
                    this.redrawAreas.set(region, false);
                }
            }
        }
        markForRedraw(area) {
            for (var region of this.redrawAreas.keys()) {
                if (!this.redrawAreas.get(region) && area.intersects(region)) {
                    this.redrawAreas.set(region, true);
                }
            }
        }
        shouldRedraw(area) {
            for (var region of this.redrawAreas.keys()) {
                if (this.redrawAreas.get(region) && area.intersects(region)) {
                    return true;
                }
            }
            return false;
        }
        resize() {
            this.ctx.canvas.width = window.innerWidth;
            this.ctx.canvas.height = window.innerHeight;
            this.redrawAreas.clear();
        }
    }
    exports.ContextLayer = ContextLayer;
    class QuarteredContextLayer extends ContextLayer {
        resize() {
            super.resize();
            this.redrawAreas.set(new Rectangle_3.Rectangle(Viewport_3.Viewport.area.topLeft(), Viewport_3.Viewport.area.getPoint(Polygon_2.Position.Center)), true);
            this.redrawAreas.set(new Rectangle_3.Rectangle(Viewport_3.Viewport.area.getPoint(Polygon_2.Position.TopCenter), Viewport_3.Viewport.area.getPoint(Polygon_2.Position.RightCenter)), true);
            this.redrawAreas.set(new Rectangle_3.Rectangle(Viewport_3.Viewport.area.getPoint(Polygon_2.Position.LeftCenter), Viewport_3.Viewport.area.getPoint(Polygon_2.Position.BottomCenter)), true);
            this.redrawAreas.set(new Rectangle_3.Rectangle(Viewport_3.Viewport.area.getPoint(Polygon_2.Position.Center), Viewport_3.Viewport.area.bottomRight()), true);
        }
    }
    exports.QuarteredContextLayer = QuarteredContextLayer;
});
define("Core/Element", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Element {
    }
    exports.Element = Element;
});
define("Core/RedrawManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RedrawManager {
        static init(quadrants) {
        }
    }
    RedrawManager.areas = new Array();
    exports.RedrawManager = RedrawManager;
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