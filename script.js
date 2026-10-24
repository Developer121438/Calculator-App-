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

let justCalculated = false;
const memoryIndicator = document.getElementById("memory-indicator");

let memory = 0;

let hasMemory = false;

// Update memory indicator visibility
function updateMemoryIndicator() {
  memoryIndicator.classList.toggle("active", hasMemory);
}
// Add numbers
function appendNumber(number) {
  if (display.value === "Error" || justCalculated) {
    display.value = "0";
    justCalculated = false;
  }

  if (display.value === "0") {
    if (number === "00") return;
    display.value = number;
  } else {
    display.value += number;
  }
}

// Add operators
function appendOperator(operator) {
  if (display.value === "Error") return;

  justCalculated = false;

  const lastChar = display.value.slice(-1);

  if ("+-*/".includes(lastChar)) {
    display.value = display.value.slice(0, -1) + operator;
  } else if (lastChar !== ".") {
    display.value += operator;
  }
}

// Add decimal point
function appendDecimal() {
  if (display.value === "Error" || justCalculated) {
    display.value = "0";
    justCalculated = false;
  }

  const currentNumber = display.value.split(/[+\-*/]/).pop();

  if (!currentNumber.includes(".")) {
    display.value += ".";
  }
}

// Clear display
function clearDisplay() {
  display.value = "0";
  justCalculated = false;
}

// Delete last character
function deleteLast() {
  if (display.value === "Error" || justCalculated) {
    clearDisplay();
    return;
  }

  display.value = display.value.slice(0, -1);

  if (display.value === "") {
    display.value = "0";
  }
}

// Calculate expression
function calculate() {
  try {
    const expression = display.value;

    // Only allow numbers and arithmetic operators
    if (!/^[0-9+\-*/.]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    // Check if expression ends with an operator
    if (/[+\-*/.]$/.test(expression)) {
      throw new Error("Incomplete expression");
    }

    const result = Function('"use strict"; return (' + expression + ")")();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    display.value = String(Number(result.toPrecision(12)));
    justCalculated = true;
  } catch (error) {
    display.value = "Error";
    justCalculated = true;
  }
}

// ===================================
// STANDARD CALCULATOR MEMORY FUNCTIONS
// ===================================

// Get the current numerical value
function getCurrentValue() {
  const expression = display.value;

  if (expression === "Error") {
    return null;
  }

  // Reject incomplete expressions
  if (/[+\-*/.]$/.test(expression)) {
    return null;
  }

  // Evaluate expressions before using memory
  if (/[+\-*/]/.test(expression.slice(1))) {
    calculate();
    if (display.value === "Error") {
      return null;
    }
  }

  const value = Number(display.value);
  return Number.isFinite(value) ? value : null;
}

// MC - Clear memory
function memoryClear() {
  memory = 0;
  hasMemory = false;
  updateMemoryIndicator();
}
// MR - Recall memory
function memoryRecall() {
  display.value = String(memory);
  justCalculated = true;
}

// M+ - Add displayed value to memory
function memoryAdd() {
  const value = getCurrentValue();

  if (value === null) return;

  memory += value;
  justCalculated = true;

  hasMemory = true;
  updateMemoryIndicator();
}
// M- - Subtract displayed value from memory
function memorySubtract() {
  const value = getCurrentValue();

  if (value === null) return;

  memory -= value;
  justCalculated = true;

  hasMemory = true;
  updateMemoryIndicator();
}
// MS - Store displayed value in memory
function memoryStore() {
  const value = getCurrentValue();

  if (value === null) return;

  memory = value;
  justCalculated = true;

  hasMemory = true;
  updateMemoryIndicator();
}
// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    event.preventDefault();
    appendOperator(key);
  } else if (key === ".") {
    appendDecimal();
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
