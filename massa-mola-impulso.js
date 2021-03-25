const friction = 0.0,
  k = 4, // string constant
  m = 1; // mass

const incOmega = 0.1;

const omega = Math.sqrt(k / m),
  omega2 = omega - incOmega;

const period = (2 * Math.PI) / incOmega; // period of slow sine wave
const endInterval = 2 * Math.floor(period);
const interval = [0, endInterval];

let numberOfEvaluations = endInterval * 8e3;

function externalForce(t) {
  return 0.5 * Math.cos(omega2 * t);
}

const duration = 24e3;
const timeFactor = 1e3;

let inMotion = true; // to stop all animations when dragging

const board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-10, 25, endInterval, -20],
  keepaspectratio: true,
  showNavigation: false,
  showCopyright: false,
  axis: true,
  grid: false,
});
const line = board.create(
  "line",
  [
    [0, 8],
    [0, -10],
  ],
  { visible: false, straightFirst: false, straightLast: false }
);
const pointString = board.create("glider", [0, 0, line], {
  name: "<strong>Peso</strong>",
  size: 6,
  label: { autoPosition: true, offset: [20, 20] },
});

const turtle = board.create("turtle", [0, 0], {
  lastArrow: true,
  strokeWidth: 1.2,
  strokeColor: "Red",
  strokeOpacity: 1,
  name: "<strong>  U(t)  </strong>",
  withLabel: true,
});

const springHangup = board.create("point", [0, 20], {
  color: "black",
  name: "<strong>Mola</strong>",
  fixed: true,
});
const springHangup2 = board.create("point", [0, -20], {
  color: "black",
  name: "<strong>Mola 2, Força Externa</strong>",
  fixed: true,
});

let numberOfSpringRings = 14;
let springRings = [],
  springRings2 = [];

for (let i = 0; i < numberOfSpringRings; i++) {
  springRings[i] = board.create(
    "point",
    [
      0.5 - (i % 2),
      ((i) => {
        return function () {
          return (
            springHangup.Y() -
            (i + 1) *
              Math.abs(
                (springHangup.Y() - pointString.Y()) / (numberOfSpringRings + 1)
              )
          );
        };
      })(i),
    ],
    { withLabel: false, color: "black", size: 1 }
  );
  springRings2[i] = board.create(
    "point",
    [
      0.5 - (i % 2),
      ((i) => {
        return function () {
          return (
            springHangup2.Y() +
            (i + 1) *
              Math.abs(
                (springHangup2.Y() - pointString.Y()) /
                  (numberOfSpringRings + 1)
              )
          );
        };
      })(i),
    ],
    {
      withLabel: false,
      color: "blue",
      size: 2,
      fillOpacity: 0.1,
      strokeOpacity: 0.3,
    }
  );
  if (i > 0) {
    board.create("segment", [springRings[i - 1], springRings[i]], {
      color: "black",
      strokeWidth: 1,
    });
    board.create("segment", [springRings2[i - 1], springRings2[i]], {
      color: "blue",
      strokeWidth: 2,
      strokeOpacity: 0.3,
    });
  }
}

board.create("segment", [springHangup, springRings[0]], {
  color: "black",
  strokeWidth: 1,
});
board.create("segment", [springRings[numberOfSpringRings - 1], pointString], {
  color: "black",
  strokeWidth: 1,
});
board.create("segment", [springHangup2, springRings2[0]], {
  color: "black",
  strokeWidth: 2,
  strokeOpacity: 0.3,
});
board.create("segment", [springRings2[numberOfSpringRings - 1], pointString], {
  color: "black",
  strokeWidth: 1,
  strokeOpacity: 0.3,
});

function invertArray(arr) {
  return [arr[1], arr[0]];
}

function getData(posInitial) {
  // return a function that returns [vel(t), pos(t)]
  let f = function (t, x) {
    return [
      x[1],
      externalForce(t) / m + (-friction / m) * x[1] - (k / m) * x[0],
    ];
  };

  let data = JXG.Math.Numerics.rungeKutta(
    "heun",
    [posInitial, 0],
    interval,
    numberOfEvaluations,
    f
  );

  return function (t) {
    if (t >= duration) {
      turtle.clearScreen();
      pointString.setPosition(JXG.COORDS_BY_USER, [0, 0]); // set position on the Y-line
      return NaN;
    }

    let tIndex = Math.floor((t / duration) * numberOfEvaluations);

    if (inMotion && board.mode === board.BOARD_MODE_DRAG) {
      // dragging clear turtle....
      turtle.clearScreen();
    } else {
      let inc = (interval[1] - interval[0]) / numberOfEvaluations; // increment in the t-axis
      turtle.moveTo([tIndex * inc, data[tIndex][0]]); // use time to move turtle
    }

    return invertArray(data[tIndex]); // return [vel,pos] --> pos = y- coord
  };
}

function startAnimation(posInitial) {
  turtle.setPos(0, posInitial);
  pointString.moveAlong(getData(posInitial)); // the point is attached to the Y-line, therefore the velocity is discarded
  // graph = function (t) {
  //   let tPos = [t / timeFactor, pointString.Y()];
  //   turtle.moveTo(tPos); // graph will be called in .moveAlong() and so the turtle updates position
  //   return tPos;
  // };
  //pointGraph.moveAlong(graph);
}

function hook() {
  if (inMotion) {
    if (board.mode === board.BOARD_MODE_DRAG) {
      board.stopAllAnimation();
      inMotion = false;
    }
  } else {
    if (board.mode !== board.BOARD_MODE_DRAG) {
      inMotion = true;
      startAnimation(pointString.Y()); // when not dragging, start animations
    }
  }
}
turtle.hideTurtle();
board.on("update", hook);
startAnimation(0);
