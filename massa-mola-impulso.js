var board = JXG.JSXGraph.initBoard("jxgbox", {
    boundingbox: [-5, 10, 40, -10],
    keepaspectratio: true,
    axis: false,
    grid: false,
    showNavigation: false,
    showCopyright: false,
  }),
  line = board.create(
    "line",
    [
      [0, 8],
      [0, -10],
    ],
    { visible: false, straightFirst: false, straightLast: false }
  ),
  point = board.create("glider", [0, -5, line], { name: "Peso" }),
  pointGraph = board.create("point", [0, -5], {
    name: `<strong>  U(t)  </strong>`,
    trace: true,
    size: 0,
    isDraggable: false,
  }),
  pointFlow = board.create("point", [0, -5], {
    name: `(U, U')`,
    withLabel: false,
    trace: true,
    size: 0.1,
    isDraggable: false,
    color: "green",
  }),
  isInDragMode = false,
  springHangup = board.create("point", [0, 9], {
    color: "black",
    name: "Mola",
    fixed: true,
  }),
  numberOfSpringRings = 10,
  springRings = [],
  turtle = board.create("turtle", [0, -5], {
    lastArrow: false,
    strokeWidth: 1,
    strokeColor: "green",
  });

for (let i = 0; i < numberOfSpringRings; i++) {
  springRings[i] = board.create(
    "point",
    [
      0.5 - (i % 2),
      (function (i) {
        return function () {
          return (
            springHangup.Y() -
            (i + 1) *
              Math.abs(
                (springHangup.Y() - point.Y()) / (numberOfSpringRings + 1)
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
board.create("segment", [springRings[numberOfSpringRings - 1], point], {
  color: "black",
  strokeWidth: 1,
});

var axisCenter = [30, 0]; // new Axis center
var c = 0,
  k = 0.4, // constants of the system
  m = 1,
  omega2 = Math.sqrt(k / m) + 0.05; // frequency of external force

var timeFactor = 1000;

var yInitial = -5;

xAxis = board.create(
  "axis",
  [
    [0, axisCenter[1]],
    [1, axisCenter[1]],
  ],
  {
    name: `<strong>U'</strong>`,
    withLabel: true,
    color: "blue",
    label: { position: "rt", offset: [-34, 5] },
  }
);
yAxis = board.create(
  "axis",
  [
    [axisCenter[0], 0],
    [axisCenter[0], 1],
  ],
  {
    name: `<strong> U</strong>`,
    withLabel: true,
    color: "blue",
    label: { position: "rt", offset: [10, 0] },
  }
);

getData = function (startY) {
  var f = function (t, x) {
      return [
        x[1],
        (0.12 * Math.cos(omega2 * t)) / m + (-c / m) * x[1] - (k / m) * x[0],
      ];
    },
    area = [0, 200],
    numberOfEvaluations = (area[1] - area[0]) * 100,
    data = JXG.Math.Numerics.rungeKutta(
      "heun",
      [yInitial, 0],
      area,
      numberOfEvaluations,
      f
    ),
    duration = 20 * 1e3;
  //timeFactor = 100 * duration / numberOfEvaluations;

  return function (t) {
    // returns a function depending on t for animation....
    if (t >= duration) return NaN;

    let springPos = data[Math.floor((t / duration) * numberOfEvaluations)][0];
    let springVel = data[Math.floor((t / duration) * numberOfEvaluations)][1];

    // if (isInDragMode && board.mode === board.BOARD_MODE_DRAG) {
    //   data = [];
    //   springPos = point.Y();
    //   springVel = 0;
    //   turtle.clean();
    //   turtle.hideTurtle();
    //   turtle.setPos([0, point.Y()]);
    // } else {
    //   turtle.moveTo([t / timeFactor, springPos]);
    // }

    let position = [springPos, springVel];

    return position;
  };
};

function startAnimation(startY) {
  uData = getData(startY);
  point.moveAlong((t) => {
    return [0, uData(t)[0]]; // point moves according with u coordinate
  });

  plotFunction = function (t) {
    return [t / timeFactor, uData(t)[0]];
  }; // add first coordinate
  pointGraph.moveAlong(plotFunction, { effect: "<>" });

  plotFlow = function (t) {
    // add center and u(t), u'(t)
    return [axisCenter[0] + uData(t)[0], axisCenter[1] + uData(t)[1]];
  };
  pointFlow.moveAlong(plotFlow, { effect: "<>", size: 1 });
}

function hook() {
  if (isInDragMode) {
    if (board.mode === board.BOARD_MODE_DRAG) {
      board.stopAllAnimation();
      pointGraph.moveTo(0, point.Y());
      pointFlow.moveTo(0, point.Y());
      board.removeObject([pointFlow]);
      turtle.hideTurtle();
      turtle.clean();
      turtle.setPos(0, point.Y());

      isInDragMode = false;
    }
  } else {
    // if (board.mode !== board.BOARD_MODE_DRAG) {
    turtle.clean();
    // pointGraph.moveTo(0, point.Y());
    // pointFlow.moveTo(0, point.Y());
    // turtle.setAttribute({ firstArrow: true, strokeColor: "green" });
    turtle.showTurtle();

    startAnimation(point.Y());

    isInDragMode = true;
    // }
  }
}

board.on(hook);
//startAnimation(yInitial);
turtle.hideTurtle();
// moveForward();
