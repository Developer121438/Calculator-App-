const buttonBtn = document.getElementById("button-btn");
const linkContainer = document.querySelector(".link-container");

buttonBtn.addEventListener("click", function (event) {
  event.stopPropagation();

  linkContainer.classList.toggle("active");
  buttonBtn.classList.toggle("active");
});

document.addEventListener("click", function (event) {
  if (
    !linkContainer.contains(event.target) &&
    !buttonBtn.contains(event.target)
  ) {
    linkContainer.classList.remove("active");
    buttonBtn.classList.remove("active");
  }
});
const display = document.getElementById("display");
const angleButton = document.getElementById("angle-mode");

let angleMode = "DEG";
let justCalculated = false;

// Create an isolated math.js environment
const scientificMath = math.create(math.all);

// Convert trigonometric inputs and outputs
const trigFunctions = {
  sin: (x) => Math.sin(toRadians(x)),
  cos: (x) => Math.cos(toRadians(x)),
  tan: (x) => Math.tan(toRadians(x)),

  asin: (x) => fromRadians(Math.asin(x)),
  acos: (x) => fromRadians(Math.acos(x)),
  atan: (x) => fromRadians(Math.atan(x)),

  sec: (x) => {
    const result = Math.cos(toRadians(x));

    if (Math.abs(result) < 1e-12) {
      throw new Error("Undefined secant");
    }

    return 1 / result;
  },

  cosec: (x) => {
    const result = Math.sin(toRadians(x));

    if (Math.abs(result) < 1e-12) {
      throw new Error("Undefined cosecant");
    }

    return 1 / result;
  },

  cot: (x) => {
    const result = Math.tan(toRadians(x));

    if (!Number.isFinite(result) || Math.abs(result) < 1e-12) {
      throw new Error("Undefined cotangent");
    }

    return 1 / result;
  },
};
function toRadians(value) {
  return angleMode === "DEG" ? (value * Math.PI) / 180 : value;
}

function fromRadians(value) {
  return angleMode === "DEG" ? (value * 180) / Math.PI : value;
}

function toggleAngleMode() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  angleButton.value = angleMode;
}

// Format results to reduce floating-point artifacts
function formatResult(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Invalid result");
  }

  if (Math.abs(value) < 1e-12) {
    return "0";
  }

  return String(Number(value.toPrecision(12)));
}

// Reset the display
function clearDisplay() {
  display.value = "0";
  justCalculated = false;
}

// Add digits
function appendNumber(number) {
  if (display.value === "Error" || justCalculated) {
    clearDisplay();
  }

  if (display.value === "0") {
    if (number === "00") return;
    display.value = number;
  } else {
    display.value += number;
  }
}

// Add arithmetic operators
function appendOperator(operator) {
  if (display.value === "Error") return;

  const lastChar = display.value.slice(-1);

  if ("+-*/^".includes(lastChar)) {
    display.value = display.value.slice(0, -1) + operator;
  } else if (lastChar !== ".") {
    display.value += operator;
  }

  justCalculated = false;
}

// Add decimal point
function appendDecimal() {
  if (display.value === "Error" || justCalculated) {
    clearDisplay();
  }

  const currentNumber = display.value.split(/[+\-*/^()]/).pop();

  if (!currentNumber.includes(".")) {
    display.value += currentNumber === "" ? "0." : ".";
  }
}

// Add parentheses
function appendParenthesis(parenthesis) {
  if (display.value === "Error" || justCalculated) {
    clearDisplay();
  }

  if (display.value === "0" && parenthesis === "(") {
    display.value = "(";
  } else {
    display.value += parenthesis;
  }
}

// Insert mathematical constants
function appendConstant(constant) {
  if (display.value === "Error" || justCalculated) {
    clearDisplay();
  }

  const value = constant === "pi" ? "pi" : "e";

  if (display.value === "0") {
    display.value = value;
  } else {
    display.value += value;
  }
}

// Delete the last character
function deleteLast() {
  if (display.value === "Error" || justCalculated) {
    clearDisplay();
    return;
  }

  display.value = display.value.slice(0, -1) || "0";
}

// Evaluate the expression
function evaluateExpression(expression) {
  const scope = {
    sin: trigFunctions.sin,
    cos: trigFunctions.cos,
    tan: trigFunctions.tan,

    asin: trigFunctions.asin,
    acos: trigFunctions.acos,
    atan: trigFunctions.atan,

    sec: trigFunctions.sec,
    cosec: trigFunctions.cosec,
    cot: trigFunctions.cot,

    sqrt: Math.sqrt,
    cbrt: Math.cbrt,

    log10: Math.log10,
    log: Math.log,
  };

  return scientificMath.evaluate(expression, scope);
}
// Calculate
function calculate() {
  try {
    const result = evaluateExpression(display.value);

    display.value = formatResult(result);
    justCalculated = true;
  } catch (error) {
    display.value = "Error";
    justCalculated = true;
  }
}

// Scientific functions
function applyFunction(functionName) {
  if (display.value === "Error") {
    clearDisplay();
  }

  const functions = {
    sin: "sin(",
    cos: "cos(",
    tan: "tan(",

    asin: "asin(",
    acos: "acos(",
    atan: "atan(",

    sec: "sec(",
    cosec: "cosec(",
    cot: "cot(",

    sqrt: "sqrt(",
    cbrt: "cbrt(",

    log: "log10(",
    ln: "log(",

    square: "^2",
    cube: "^3",
    factorial: "!",
    reciprocal: "^(-1)",
    percent: "/100",
  };

  const selectedFunction = functions[functionName];

  if (!selectedFunction) return;

  const postfixFunctions = [
    "square",
    "cube",
    "factorial",
    "reciprocal",
    "percent",
  ];

  if (postfixFunctions.includes(functionName)) {
    if (display.value === "0") return;

    display.value += selectedFunction;
  } else {
    if (justCalculated || display.value === "0") {
      display.value = selectedFunction;
    } else {
      display.value += selectedFunction;
    }
  }

  justCalculated = false;
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (["+", "-", "*", "/", "^"].includes(key)) {
    event.preventDefault();
    appendOperator(key);
  } else if (key === ".") {
    appendDecimal();
  } else if (key === "(" || key === ")") {
    appendParenthesis(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
