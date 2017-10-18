define("lib/Logger", ["require", "exports"], function (require, exports) {
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
define("lib/Dimension", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Point {
        constructor(offsetX, offsetY, parent) {
            this.x = 0;
            this.y = 0;
            this.dirty = true;
            this.parent = null;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.parent = parent;
            if (this.parent != null) {
                this.parent.children.push(this);
            }
        }
        reposition(offsetX, offsetY) {
            if (offsetX === this.offsetX && offsetY === this.offsetY) {
                return;
            }
            this.dirty = true;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
        }
        update() {
            if (!this.dirty) {
                return;
            }
            this.dirty = false;
            var x = this.calculate("x");
            var y = this.calculate("y");
            if (x === this.x && y === this.y) {
                return;
            }
            this.x = x;
            this.y = y;
            for (var child of this.children) {
                child.dirty = true;
            }
        }
        calculate(field) {
            var result = 0;
            if (parent != null) {
                result = parent[field];
            }
            result += this["offset" + field.toUpperCase()];
            return result;
        }
    }
    exports.Point = Point;
    class Shape {
        constructor(origin) {
            this.points = new Map();
            this.dirty = false;
            this.origin = origin;
            this.points.set(Position.Origin, this.origin);
        }
        addPoint(position, offsetX, offsetY) {
            this.points.set(position, new Point(offsetX, offsetY, this.origin));
        }
        update() {
            if (!this.dirty) {
                return;
            }
            this.dirty = false;
            for (var position of this.points.keys()) {
                this.points[position].update();
            }
        }
    }
    exports.Shape = Shape;
    var Position;
    (function (Position) {
        Position[Position["Top"] = 1] = "Top";
        Position[Position["Left"] = 2] = "Left";
        Position[Position["Right"] = 4] = "Right";
        Position[Position["Bottom"] = 8] = "Bottom";
        Position[Position["Middle"] = 16] = "Middle";
        Position[Position["Origin"] = 32] = "Origin";
    })(Position = exports.Position || (exports.Position = {}));
    class Screen2 extends Shape {
        constructor() {
            super(new Point(0, 0, null));
            this.points.set(Position.Top | Position.Left, new Point(0, 0, null));
            this.points.set(Position.Top | Position.Right, new Point(0, 0, null));
            this.points.set(Position.Bottom | Position.Right, new Point(0, 0, null));
            this.points.set(Position.Bottom | Position.Left, new Point(0, 0, null));
            this.resize();
        }
        resize() {
            var midX = Math.floor(window.innerWidth / 2);
            var midY = Math.floor(window.innerHeight / 2);
            this.origin.reposition(midX, midY);
            this.points[Position.Top | Position.Right].reposition(window.innerWidth, 0, null);
            this.points[Position.Bottom | Position.Right].reposition(window.innerWidth, window.innerHeight, null);
            this.points[Position.Left | Position.Right].reposition(0, window.innerHeight, null);
        }
    }
    exports.Screen2 = Screen2;
    var Relative;
    (function (Relative) {
        Relative[Relative["ToParent"] = 0] = "ToParent";
        Relative[Relative["ToWindow"] = 1] = "ToWindow";
    })(Relative = exports.Relative || (exports.Relative = {}));
    var Direction;
    (function (Direction) {
        Direction[Direction["Left"] = 1] = "Left";
        Direction[Direction["Top"] = 2] = "Top";
        Direction[Direction["Bottom"] = 4] = "Bottom";
        Direction[Direction["Right"] = 8] = "Right";
        Direction[Direction["Centered"] = 16] = "Centered";
    })(Direction = exports.Direction || (exports.Direction = {}));
    var Size;
    (function (Size) {
        Size[Size["Fixed"] = 0] = "Fixed";
        Size[Size["Percent"] = 1] = "Percent";
    })(Size = exports.Size || (exports.Size = {}));
    class Dimension {
        constructor(x, y, w, h, r, s, d) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.relative = r;
            this.size = s;
            this.direction = d;
        }
        getLeft(parent) {
            return this.getPoint("x", parent, this.relative);
        }
        getTop(parent) {
            return this.getPoint("y", parent, this.relative);
        }
        getRight(parent) {
            return this.getPoint("w", parent, Relative.ToParent);
        }
        getBottom(parent) {
            return this.getPoint("h", parent, Relative.ToParent);
        }
        getPoint(point, parent, relative) {
            var r = this[point];
            switch (relative) {
                case Relative.ToParent:
                    if (parent == null) {
                        throw "Relative to parent cannot have null parent";
                    }
                    break;
                case Relative.ToWindow:
                    break;
                default:
                    throw "Not implemented";
            }
            return r;
        }
    }
    exports.Dimension = Dimension;
});
define("lib/Element", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Element {
        constructor(dimension, parent) {
            this.children = [];
            this.dimensionDirty = false;
            this.dimension = dimension;
            this.parent = parent;
        }
    }
    exports.Element = Element;
});
define("lib/Screen", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Screen {
        constructor() {
            this.resized = false;
        }
        update() {
            if (this.resized) {
            }
        }
        render() {
        }
    }
    exports.Screen = Screen;
});
define("lib/Runtime", ["require", "exports", "lib/Logger", "Game"], function (require, exports, Logger_1, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Runtime {
        static init() {
            var canv = document.createElement("canvas");
            document.body.appendChild(canv);
            this.ctx = canv.getContext("2d");
        }
        static start(startscreen) {
            window.onresize = Runtime.resize;
            this.screen = startscreen;
            this.resize();
            requestAnimationFrame(Runtime.frame);
        }
        static update(step) {
            Runtime.screen.update();
        }
        static render(step) {
            Runtime.screen.render();
        }
        static frame() {
            Game_1.Game.FPS.tickStart();
            Runtime.now = window.performance.now();
            Runtime.dt += Math.min(1, (Runtime.now - Runtime.last) / 1000);
            while (Runtime.dt > Runtime.step) {
                Runtime.dt = Runtime.dt - Runtime.step;
                Runtime.update(Runtime.step);
            }
            Runtime.render(Runtime.step);
            Game_1.Game.FPS.tick();
            requestAnimationFrame(Runtime.frame);
        }
        static resize() {
            Runtime.width = Runtime.ctx.canvas.width = window.innerWidth;
            Runtime.height = Runtime.ctx.canvas.height = window.innerHeight;
            Runtime.ctx.clearRect(0, 0, Runtime.ctx.canvas.width, Runtime.ctx.canvas.height);
            Logger_1.Logger.debug("Runtime: Screen resized: " + Runtime.width + ", " + Runtime.height);
        }
    }
    Runtime.dt = 0;
    Runtime.last = window.performance.now();
    Runtime.step = 1 / 60;
    exports.Runtime = Runtime;
});
define("Game", ["require", "exports", "lib/Runtime", "lib/Logger", "lib/Screen"], function (require, exports, Runtime_1, logger_1, Screen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        static init(ver) {
            logger_1.Logger.level = logger_1.Level.Debug;
            logger_1.Logger.log("Game: Version: " + ver);
            logger_1.Logger.log("Log: " + logger_1.Level[logger_1.Logger.level]);
            var startscreen = new Screen_1.Screen();
            Runtime_1.Runtime.init();
            Runtime_1.Runtime.start(startscreen);
            this.FPS = new FPSMeter(null, {
                decimals: 0,
                graph: 1,
                left: "5px"
            });
        }
    }
    exports.Game = Game;
});
define("lib/DI", ["require", "exports"], function (require, exports) {
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
define("lib/Video", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Video {
        constructor(src, dimension) {
            this.ready = false;
            var video = document.createElement("video");
            video.src = src;
            video.addEventListener("loadeddata", (() => {
                this.ready = true;
                console.log("ready");
            }).bind(this));
        }
        resize() {
        }
    }
    exports.Video = Video;
});
//# sourceMappingURL=game.js.map