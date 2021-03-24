const c = 0.07,
  k = 0.8,
  m = 1;

const duration = 10 * 1e3;
const timeFactor = 1000;

let inMotion = true; // to stop all animations when dragging

const board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-10, 10, 30, -10],
  keepaspectratio: true,
  showNavigation: false,
  showCopyright: false,
  axis: false,
  grid: false,
});
const line = board.create(
  "line",
  [
    [0, 8],
    [0, -20],
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
    return [x[1], (-c / m) * x[1] - (k / m) * x[0]];
  };
  let area = [0, 200];
  let numberOfEvaluations = (area[1] - area[0]) * 100;
  let data = JXG.Math.Numerics.rungeKutta(
    "heun",
    [posInitial, 0],
    area,
    numberOfEvaluations,
    f
  );

  return function (t) {
    if (t >= duration) return NaN;

    let tIndex = Math.floor((t / duration) * numberOfEvaluations);

    turtle.moveTo([t / timeFactor, data[tIndex][0]]); // use time to move turtle
    return invertArray(data[tIndex]); // return [vel,pos] -- pos = y- coord
  };
}

function startAnimation(posInitial) {
  turtle.clearScreen();

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
      inMotion = false;
      // turtle.clean();

      board.stopAllAnimation();

      // turtle.init(0, 0, "up");
      // console.log(turtle.Y());
    }
  } else {
    if (board.mode !== board.BOARD_MODE_DRAG) {
      board.suspendUpdate();

      turtle.clearScreen();

      //board.removeObject([turtle]);
      console.log(board.objects);
      inMotion = true;
      startAnimation(pointString.Y()); // when not dragging start animations
      board.unsuspendUpdate();
    }
  }
}
turtle.hideTurtle();
turtle.clearScreen();
board.on("update", hook);
//startAnimation(-5);
