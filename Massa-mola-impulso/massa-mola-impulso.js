let numberOfEvaluations = endInterval * 5e3;

const duration = 24e3;
// const timeFactor = 1e3;

let inMotion = true; // to stop all animations when dragging

// ------------------GET DATA USING DIFFERENTIAL EQUATIONS -------------------
function invertArray(arr) {
  return [arr[1], arr[0]];
}

function run(posInitial, data) {
  // return a function that runs animation with pointString.moveAlong(run(...))

  return function (t) {
    if (t >= duration) {
      turtle.clearScreen();
      pointString.setPosition(JXG.COORDS_BY_USER, [0, 0]); // set position on the Y-line
      return NaN;
    }

    let tIndex = Math.floor((t / duration) * numberOfEvaluations);

    if (inMotion && board.mode === board.BOARD_MODE_DRAG) {
      // if dragging then clear turtle....
      turtle.clearScreen();
    } else {
      let inc = (interval[1] - interval[0]) / numberOfEvaluations; // increment in the t-axis
      turtle.moveTo([tIndex * inc, data[tIndex][0]]); // use time to move turtle
    }

    return invertArray(data[tIndex]); // return [vel,pos] --> pos = y- coord
  };
}

//-------------------ANIMATION -------------------------------------------------
function setAnimation(posInitial) {
  // omega2 = Number(omega2);
  // omega2 = Number(omega2);

  // if (isNaN(omega2)) {
  //   alert("DIGITE UM NÚMERO REAL!\nPonto indica separação de decimais");
  //   return;
  // }

  turtle.setPos(0, posInitial);

  function externalForce(t) {
    return F0 * Math.cos(omega2 * t);
  }

  friction = sliders[0].Value(); // sliders is an array that contains the sliders objects created......
  F0 = sliders[1].Value();
  // k = slHooke.Value();
  // m = slMassa.Value();

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

  pointString.moveAlong(run(posInitial, data)); // the point is attached to the Y-line, therefore the velocity is discarded
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
      setAnimation(pointString.Y()); // when not dragging, start animations
    }
  }
}
turtle.hideTurtle();
board.on("update", hook);
setAnimation(0);
