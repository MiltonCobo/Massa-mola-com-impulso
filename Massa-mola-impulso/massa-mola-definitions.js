const incOmega = 0.1;
const period = (2 * Math.PI) / incOmega; // period of slow sine wave
const endInterval = 2.5 * Math.floor(period); // more or less two periods
const interval = [0, endInterval];

let friction = 0.0,
  k = 4, // string constant
  m = 1; // mass
let F0 = 1.2;

let omega2 = Math.sqrt(k / m) - incOmega;

let omega = Math.sqrt(k / m);

//------------------CHECK INPUT -----------------------------------------------------------
const inputOmega2 = document.getElementById("inputOmega2");

inputOmega2.onchange = function () {
  omega2 = Number(inputOmega2.value);
  if (isNaN(omega2)) {
    // inMotion = true;
    // board.suspendUpdate();
    alert("DIGITE UM NÚMERO REAL!\nPonto indica separação de decimais");
    // turtle.clearScreen();
    // board.unsuspendUpdate();
    // inMotion = false;
    // return;
    omega2 = 1.9;
    inputOmega2.value = "1.9";
  }

  inMotion = true;
  board.stopAllAnimation();
  inMotion = false; // important set false before setAnimation()
  turtle.clearScreen();
  setAnimation(0);
};

//-------------DEFINE BOARD, SLIDERS, POINTS, STRINGS, TURTLES  ----------------------------------
const board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-10, 40, endInterval, -50],
  maxboundingbox: [-10, 40, endInterval, -50],
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
//     color: "olive",
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
//     color: "olive",
//     useMathJax: true,
//   }
// );

//----------------------------SLIDERS and TEXTS------------------------------------------------------

const line = board.create(
  "line",
  [
    [0, 10],
    [0, -12],
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
  strokeColor: "olive",
  strokeOpacity: 1,
  name: "<strong>  u(t)  </strong>",
  withLabel: true,
});

const springHangup = board.create("point", [0, 25], {
  color: "black",
  name: "<strong>Mola</strong>",
  fixed: true,
});
const springHangup2 = board.create("point", [0, -30], {
  color: "black",
  name: "<strong>Mola 2, Força Externa</strong>",
  // label: { position: "bot", offset: [-15, -20] },
  fixed: true,
});

const numberOfSpringRings = 16;

let spring1 = [];

spring1 = createSpringPoints(
  springHangup,
  pointString,
  numberOfSpringRings,
  "black",
  0.8
); //----------------------create points of first string

for (let i = 0; i < spring1.length - 1; i++) {
  board.create("segment", [spring1[i], spring1[i + 1]], {
    color: "black",
    strokeWidth: 1,
  });
}

let spring2 = [];

spring2 = createSpringPoints(
  springHangup2,
  pointString,
  numberOfSpringRings,
  "blue",
  0.1
); //----------------create points of second string

for (let i = 0; i < spring2.length - 1; i++) {
  board.create("segment", [spring2[i], spring2[i + 1]], {
    color: "blue",
    strokeWidth: 1,
    strokeOpacity: 0.2, // -----make the chain
  });
}

//-------------END DEFINING OBJECTS ----------------------------------

// -----------------------------------CREATE SLIDERS -----------------------------------

let ySliders = -45; // positions of sliders depending on wrapper width
let xSliders = 0;
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
    xpos: xSliders + 60,
    ypos: ySliders,
    values: [0, 2.5, 4],
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
    [[sl.xpos, sl.ypos], [sl.xpos + 30, sl.ypos], sl.values],
    { name: sl.name, strokeColor: "olive", fillColor: "olive" }
  );
  board.create("text", [sl.xpos, sl.ypos - 6, sl.label], {
    strokeColor: "olive",
    fillColor: "olive",
    fixed: true,
  });
});

// ---------------------------END SLIDERS -------------------------------------------
//----------------REACTIVITY----------------------------------------------------
let wrapper = document.getElementById("wrapper");

// window.addEventListener("orientationchange", handleResize);
// window.onorientationchange = handleOrientationChange;

window.addEventListener("resize", handleResize, false);

let oldWidth = wrapper.getBoundingClientRect().width; // save initial values of width,height
let oldHeight = wrapper.getBoundingClientRect().height;

function handleResize() {
  wrapper.style.width = "";
  wrapper.style.height = "";
  let theWidth = wrapper.getBoundingClientRect().width;
  let theHeight = wrapper.getBoundingClientRect().height;

  if (Math.abs(theWidth - oldWidth) + Math.abs(theWidth - oldHeight) > 300) {
    oldWidth = theWidth;
    oldHeight = theWidth; // KEEP OLD VALUES

    // let height = Math.min(theWidth, theHeight, 400);
    // let width = Math.min(theWidth, 800); /* maximum width is 800 */

    board.resizeContainer(theWidth, theHeight);
    // board.clearTraces();
    board.fullUpdate();
  }
}

//---------------------------------END REACTIVITY ----------------------------------------------

// ----------------------FUNCTION THAT CREATES STRING POINTS

function createSpringPoints(p1, p2, n, color, opacity) {
  let p = [];
  let length = n;
  p[0] = p1;
  p[length - 1] = p2;
  let direction = Math.sign(p2.Y() - p1.Y());

  for (let i = 1; i < length - 1; i++) {
    p[i] = board.create(
      "point",
      [
        0.5 + direction * (i % 2),
        ((i) => {
          return function () {
            return (
              p[0].Y() +
              direction *
                (i + 1) *
                Math.abs((p[0].Y() - p[length - 1].Y()) / (length + 1))
            );
          };
        })(i),
      ],
      { withLabel: false, color: color, size: 1, opacity }
    );
  }

  return p;
}
