const c = 0.0, // resistence
  k = 0.8, // string constant
  m = 1; // mass

const incOmega = 0.2;

const omega = Math.sqrt(k / m),
  omega2 = omega - incOmega;

const period = (2 * Math.PI) / incOmega; // period of slow sine wave
const endArea = Math.floor(2 * period);
let numberOfEvaluations = endArea * 1000;

function externalForce(t) {
  // return 0;
  return 0.01 * Math.cos(omega2 * t);
}

const duration = endArea * 1e3;
const timeFactor = 1e3;

let inMotion = true; // to stop all animations when dragging

const board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-10, 10, endArea, -20],
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
    [0, -15],
  ],
  { visible: false, straightFirst: false, straightLast: false }
);
const pointString = board.create("glider", [0, 0, line], {
  name: "<strong>Peso</strong>",
  size: 6,
  label: { autoPosition: true, offset: [20, 20] },
});
// const pointGraph = board.create("point", [0, 0], {
//   name: "U(t)",
//   strokeColor: "green",
//   size: 0,
// });

// pointGraph.isDraggable = false;

const turtle = board.create("turtle", [0, -5], {
  lastArrow: true,
  strokeWidth: 1.2,
  strokeColor: "green",
  strokeOpacity: 1,
  name: "<strong>  U(t)  </strong>",
  withLabel: true,
});

const springHangup = board.create("point", [0, 9], {
  color: "black",
  name: "Spring",
  fixed: true,
});
let numberOfSpringRings = 10;
let springRings = [];

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
  if (i > 0)
    board.create("segment", [springRings[i - 1], springRings[i]], {
      color: "black",
      strokeWidth: 1,
    });
}
board.create("segment", [springHangup, springRings[0]], {
  color: "black",
  strokeWidth: 1,
});
board.create("segment", [springRings[numberOfSpringRings - 1], pointString], {
  color: "black",
  strokeWidth: 1,
});

function invertArray(arr) {
  return [arr[1], arr[0]];
}

function getData(posInitial) {
  // return a function that returns [vel(t), pos(t)]
  let f = function (t, x) {
    return [x[1], externalForce(t) / m + (-c / m) * x[1] - (k / m) * x[0]];
  };
  let area = [0, endArea];
  //numberOfEvaluations = (area[1] - area[0]) * 200;
  let data = JXG.Math.Numerics.rungeKutta(
    "heun",
    [posInitial, 0],
    area,
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
      let inc = endArea / numberOfEvaluations;
      turtle.moveTo([tIndex * inc, data[tIndex][0]]); // use time to move turtle
    }

    return invertArray(data[tIndex]); // return [vel,pos] --> pos = y- coord
  };
}

function startAnimation(posInitial) {
  pointString.setPosition(0, posInitial);
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
//startAnimation(-5);
