const incOmega = 0.1;
const period = (2 * Math.PI) / incOmega; // period of slow sine wave
const endInterval = 2 * Math.floor(period); // more or less two periods
const interval = [0, endInterval];

let friction = 0.0,
  k = 4, // string constant
  m = 1; // mass
let F0 = 1.2;

let omega2 = Math.sqrt(k / m) - incOmega;

let omega = Math.sqrt(k / m);

const input2 = document.getElementById("inputOmega2");
// input2.value = omega2.toString();

input2.onchange = function () {
  omega2 = Number(input2.value);
  console.log("changing value omega2", omega2);
  inMotion = true;
  board.stopAllAnimation();
  inMotion = false; // important set false before setAnimation()
  turtle.clearScreen();
  setAnimation(0);
};

//-------------DEFINE BOARD, SLIDERS, POINTS, STRINGS, TURTLES  ----------------------------------
const board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-10, 25, endInterval, -50],
  maxboundingbox: [-10, 25, endInterval, -50],
  keepaspectratio: true,
  showNavigation: false,
  showCopyright: false,
  axis: false,
  grid: false,
  zoom: {
    wheel: false,
    enabled: false,
  },
  pan: {
    needTwoFingers: false,
    enabled: false,
  },
});

xaxis = board.create(
  "axis",
  [
    [0, 0],
    [1, 0],
  ],
  {
    name: "<strong>TEMPO</strong>",
    withLabel: true,
    ticks: { visible: false },
    label: {
      position: "rt", // possible values are 'lft', 'rt', 'top', 'bot'
      offset: [-100, -30], // (in pixels)
    },
  }
);
// xaxis = board.create(
//   "axis",
//   [
//     [0, 0],
//     [0, 1],
//   ],
//   {
//     name: "<strong>u(t)</strong>",
//     withLabel: true,
//     ticks: { visible: false },
//     label: {
//       position: "left", // possible values are 'lft', 'rt', 'top', 'bot'
//       offset: [10, 40], // (in pixels)
//     },
//   }
// );

// JXG.Options.axis.ticks.majorHeight = 60;
// JXG.Options.axis.ticks.insertTicks = false;
// JXG.Options.axis.ticks.ticksDistance = 50;

let ySliders = -20;
let xSliders = 20;

const slidersInfo = [
  {
    name: "&gamma;",
    xpos: xSliders,
    ypos: ySliders,
    values: [0, 0.0, 0.3],
    label: "Coeficiente de atrito",
  },
  {
    name: "F_0",
    xpos: xSliders + 40,
    ypos: ySliders,
    values: [0, 1.2, 2],
    label: "Coeficiente da força externa",
  },
  // {
  //   name: " k ",
  //   xpos: xSliders + 40,
  //   ypos: ySliders,
  //   values: [0, 4, 6],
  //   label: "Coeficiente da mola",
  // },
  // {name:, xpos, ypos, values: }
];

let sliders = []; // an object that contains the sliders of gamma and F0

slidersInfo.forEach((sl, index) => {
  sliders[index] = board.create(
    "slider",
    [[sl.xpos, sl.ypos], [sl.xpos + 15, sl.ypos], sl.values],
    { name: sl.name, strokeColor: "Green", fillColor: "Green" }
  );
  board.create("text", [sl.xpos, sl.ypos - 4, sl.label], {
    strokeColor: "Green",
    fillColor: "Green",
  });
});

//--------------------------------INPUT OF OMEGA2---------------------------------

// const input = board.create(
//   "input",
//   [75, -20, omega - incOmega, "\\( \\omega =\\, \\)"],
//   {
//     cssStyle: "width: 60px",
//     useMathJax: true,
//   }
// );

// const txtOmega2 = board.create(
//   "text",
//   [75, -23, "Frequência da força externa"],
//   {
//     fixed: true,
//   }
// );

// board.create("text", [
//   95,
//   -20,
//   '<button onclick="omega2 = setAnimation(0.2)">Submeter</button>',
// ]);

//----------------------------TITULO --------------------------
// board.create("text", [0, -46, "O Sistema Massa-Mola com Impulso"], {
//   color: "blue",
//   fontsize: 20,
// });

//--------------------------END OF INPUT OMEGA 2 --------------------------------------

// board.create(
//   "text",
//   [
//     70,
//     20,
//     function () {
//       return "$$ \\color{red}{m} \\, u'' + \\color{red}{\\gamma}\\, u' + \\color{red}{k}\\, u = \\color{red}{F_0}\\, \\cos( \\color{red}{\\omega} t) $$";
//     },
//   ],
//   {
//     fontSize: 18,
//     color: "green",
//     useMathJax: true,
//   }
// );
// board.create(
//   "text",
//   [
//     70,
//     16,
//     function () {
//       return `$$ \\color{red}{\\omega_0} = \\sqrt{k / m} = ${Math.sqrt(
//         slHooke.Value() / m
//       ).toFixed(2)} $$`;
//     },
//   ],
//   {
//     fontSize: 18,
//     color: "green",
//     useMathJax: true,
//   }
// );

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
  label: { position: "bot", offset: [-15, -20] },
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

//----------------REACTIVITY----------------------------------------------------
let wrapper = document.getElementById("wrapper");

// window.addEventListener("orientationchange", handleResize);
window.onorientationchange = handleOrientationChange;

window.addEventListener("resize", handleResize, false);

let oldWidth = wrapper.getBoundingClientRect().width; // save initial values of width,height
let oldHeight = wrapper.getBoundingClientRect().height;

function handleOrientationChange() {
  wrapper.style.width = "";
  wrapper.style.height = "";
  let theWidth = wrapper.getBoundingClientRect().width;
  let theHeight = wrapper.getBoundingClientRect().height;

  if (Math.abs(theWidth - oldWidth) + Math.abs(theWidth - oldHeight) > 300) {
    // only call when big change

    inMotion = true;
    board.stopAllAnimation();

    oldWidth = theWidth;
    oldHeight = theWidth; // reset values of width, height

    let height = Math.min(0.9 * theWidth, theHeight, 400);
    let width = 0.9 * theWidth;

    theHeight = Math.min(theWidth, theWidth, 550); // theHeight  = min()
    console.log("width = ", theWidth, " Height = ", theHeight);
    console.log("oldWidth = ", oldWidth, " oldHeight =", oldHeight);
    console.log("the new Height is", height);

    board.resizeContainer(width, height);
    board.update();

    inMotion = false;
    turtle.clearScreen();
    setAnimation(0);
  }
}
function handleResize() {
  wrapper.style.width = "";
  wrapper.style.height = "";
  let theWidth = wrapper.getBoundingClientRect().width;
  let theHeight = wrapper.getBoundingClientRect().height;

  if (Math.abs(theWidth - oldWidth) + Math.abs(theWidth - oldHeight) > 300) {
    inMotion = true;
    board.stopAllAnimation();

    oldWidth = theWidth;
    oldHeight = theWidth;

    let height = Math.min(theWidth, theWidth, 400);
    let width = 0.92 * theWidth;

    console.log("width = ", theWidth, " Height = ", theHeight);
    console.log("oldWidth = ", oldWidth, " oldHeight =", oldHeight);
    console.log("the new Height is", height);

    board.resizeContainer(width, height);
    board.update();

    inMotion = false;
    turtle.clearScreen();
    setAnimation(0);
  }
}
