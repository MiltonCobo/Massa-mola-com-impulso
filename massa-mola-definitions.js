const incOmega = 0.1;
const period = (2 * Math.PI) / incOmega; // period of slow sine wave
const endInterval = 2 * Math.floor(period);
const interval = [0, endInterval];

let friction = 0.0,
  k = 4, // string constant
  m = 1; // mass
let F0 = 0.5;

let omega2 = Math.sqrt(k / m) - incOmega;

let omega = Math.sqrt(k / m);

//-------------DEFINE BOARD, SLIDERS, POINTS, STRINGS, TURTLES  ----------------------------------
const board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-10, 25, endInterval, -40],
  keepaspectratio: true,
  showNavigation: false,
  showCopyright: false,
  axis: true,
  grid: false,
});

const slFrict = board.create(
  "slider",
  [
    [30, -20],
    [40, -20],
    [0, 0.0, 0.3],
  ],
  { name: "&gamma;", strokeColor: "Green", fillColor: "Green" }
);
const txtFrict = board.create("text", [30, -23, "Coeficiente de atrito"], {
  fixed: true,
  // fontsize: 16,
});

const slF0 = board.create(
  "slider",
  [
    [30, -30],
    [40, -30],
    [0, 0.8, 1],
  ],
  { name: "F0", strokeColor: "Green", fillColor: "Green" }
);

const txtF0 = board.create("text", [30, -33, "Coeficiente da força externa"], {
  fixed: true,
  // fontsize: 16,
});

const slHooke = board.create(
  "slider",
  [
    [60, -20],
    [70, -20],
    [0, 4, 6],
  ],
  { name: "k", strokeColor: "Green", fillColor: "Green" }
);
const txtHooke = board.create("text", [60, -23, "Coeficiente da mola"], {
  fixed: true,
  // fontsize: 16,
});

const slMassa = board.create(
  "slider",
  [
    [60, -30],
    [70, -30],
    [0, 1, 3],
  ],
  {
    name: "m",
    strokeColor: "Green",
    fillColor: "Green",
    withTicks: true,
  }
);

const txtMassa = board.create("text", [60, -33, "Massa"], {
  fixed: true,
});

//--------------------------------INPUT OF OMEGA2---------------------------------

const input = board.create(
  "input",
  [85, -20, omega - incOmega, "\\( \\omega = \\)"],
  {
    cssStyle: "width: 100px",
    useMathJax: true,
  }
);

const txtOmega2 = board.create(
  "text",
  [85, -23, "Frequência da força externa"],
  {
    fixed: true,
  }
);

board.create("text", [
  90,
  -28,
  '<button onclick="omega2 = Number(input.Value())">Submeter</button>',
]);

//--------------------------END OF INPUT OMEGA 2 --------------------------------------

board.create(
  "text",
  [
    30,
    15,
    function () {
      return "$$ \\color{red}{m} \\, u'' + \\color{red}{\\gamma}\\, u' + \\color{red}{k}\\, u = \\color{red}{F_0}\\, \\cos( \\color{red}{\\omega} t) $$";
    },
  ],
  {
    fontSize: 18,
    color: "green",
    useMathJax: true,
  }
);
board.create(
  "text",
  [
    75,
    16,
    function () {
      return "$$ \\color{red}{\\omega_0} = \\sqrt{k / m} = $$";
    },
  ],
  {
    fontSize: 18,
    color: "green",
    useMathJax: true,
  }
);
board.create(
  "text",
  [
    92,
    12,
    function () {
      return JXG.toFixed(Math.sqrt(slHooke.Value() / slMassa.Value()), 2);
    },
  ],
  {
    fontSize: 18,
    color: "green",
    useMathJax: true,
  }
);

//----------------------------SLIDERS and TEXTS------------------------------------------------------

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
  strokeColor: "Green",
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

//-------------END DEFINING OBJECTS ----------------------------------
