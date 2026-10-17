// ==================================
// PROGRAMMER CALCULATOR
// ==================================

// Navigation

const menuButton = document.getElementById("programmer-menu-btn");
const navigation = document.getElementById("programmer-navigation");

menuButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const isOpen = navigation.classList.toggle("active");

  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (
    !navigation.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    navigation.classList.remove("active");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

// ==================================
// NUMBER SYSTEM CONVERSION
// ==================================

const numberRows = document.querySelectorAll(".number-row");
const digitButtons = document.querySelectorAll("[data-digit]");
const message = document.getElementById("programmer-message");
const operationIndicator = document.getElementById("operation-indicator");

const displays = {
  16: document.getElementById("hex-value"),
  10: document.getElementById("dec-value"),
  8: document.getElementById("oct-value"),
  2: document.getElementById("bin-value"),
};

let currentBase = 16;
let inputValue = "0";
const wordSizeSelect = document.getElementById("word-size");

let wordSize = Number(wordSizeSelect.value);

// Keep values within the selected unsigned word size
function normalizeValue(value) {
  return BigInt.asUintN(wordSize, value);
}

let firstOperand = null;
let pendingOperation = null;
let waitingForSecondOperand = false;

// Convert the current input to decimal
function getDecimalValue() {
  const isNegative = inputValue.startsWith("-");
  const digits = isNegative ? inputValue.slice(1) : inputValue;

  const prefixes = {
    16: "0x",
    10: "",
    8: "0o",
    2: "0b",
  };

  const value = BigInt(prefixes[currentBase] + digits);

  return isNegative ? -value : value;
}
// Update all four displays
function updateDisplays() {
  const decimalValue = normalizeValue(getDecimalValue());

  displays[16].textContent = decimalValue.toString(16).toUpperCase();
  displays[10].textContent = decimalValue.toString(10);
  displays[8].textContent = decimalValue.toString(8);
  displays[2].textContent = decimalValue.toString(2);
}

// Enable only digits valid for the selected base
function updateDigitButtons() {
  digitButtons.forEach((button) => {
    const digit = parseInt(button.dataset.digit, 16);

    button.disabled = digit >= currentBase;
  });
}
// Switch number system
numberRows.forEach((row) => {
  row.addEventListener("click", () => {
    const decimalValue = normalizeValue(getDecimalValue());

    currentBase = Number(row.dataset.base);
    inputValue = decimalValue.toString(currentBase).toUpperCase();

    numberRows.forEach((item) => {
      item.classList.toggle("active", item === row);
    });

    updateDigitButtons();
    updateDisplays();
  });
});

// Digit input
digitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const digit = button.dataset.digit;

    if (waitingForSecondOperand) {
      inputValue = digit;
      waitingForSecondOperand = false;
    } else {
      inputValue = inputValue === "0" ? digit : inputValue + digit;
    }

    // Apply the selected word-size limit
    const normalizedValue = normalizeValue(getDecimalValue());

    inputValue = normalizedValue.toString(currentBase).toUpperCase();

    updateDisplays();
    message.textContent = "";
  });
});

// Clear and backspace
document
  .querySelector('[data-action="clear"]')
  .addEventListener("click", () => {
    inputValue = "0";
    updateDisplays();
    message.textContent = "";
    firstOperand = null;
    pendingOperation = null;
    waitingForSecondOperand = false;
    operationIndicator.textContent = "";
  });

document
  .querySelector('[data-action="backspace"]')
  .addEventListener("click", () => {
    inputValue = inputValue.length > 1 ? inputValue.slice(0, -1) : "0";

    if (inputValue === "-") {
      inputValue = "0";
    }
    updateDisplays();
    message.textContent = "";
  });

// ==================================
// BITWISE OPERATIONS
// ==================================

function performOperation(operation, a, b) {
  switch (operation) {
    case "and":
      return a & b;

    case "or":
      return a | b;

    case "xor":
      return a ^ b;

    case "left-shift":
      if (b < 0n || b > 1024n) {
        throw new Error("Shift count must be between 0 and 1024.");
      }
      return a << b;

    case "right-shift":
      if (b < 0n || b > 1024n) {
        throw new Error("Shift count must be between 0 and 1024.");
      }
      return a >> b;

    default:
      return a;
  }
}

// Display a BigInt result in the selected number system
function setResult(value) {
  const normalizedResult = normalizeValue(value);
  inputValue = normalizedResult.toString(currentBase).toUpperCase();
  updateDisplays();
}

// Select a binary operation
// Select a binary operation
document
  .querySelectorAll(
    '[data-action="and"], [data-action="or"], [data-action="xor"], [data-action="left-shift"], [data-action="right-shift"]',
  )
  .forEach((button) => {
    button.addEventListener("click", () => {
      firstOperand = getDecimalValue();
      pendingOperation = button.dataset.action;
      waitingForSecondOperand = true;

      const symbols = {
        and: "AND",
        or: "OR",
        xor: "XOR",
        "left-shift": "<<",
        "right-shift": ">>",
      };

      operationIndicator.textContent = `${inputValue} ${symbols[pendingOperation]}`;

      message.textContent = "";
    });
  });
// NOT operation
document.querySelector('[data-action="not"]').addEventListener("click", () => {
  const value = getDecimalValue();

  // The result is converted to the selected unsigned word size by setResult().
  const result = ~value;

  setResult(result);
  operationIndicator.textContent = "";

  firstOperand = null;
  pendingOperation = null;
  waitingForSecondOperand = false;

  message.textContent = "";
});

// Equals
document
  .querySelector('[data-action="equals"]')
  .addEventListener("click", () => {
    if (pendingOperation === null || firstOperand === null) {
      return;
    }

    try {
      const secondOperand = getDecimalValue();
      const result = performOperation(
        pendingOperation,
        firstOperand,
        secondOperand,
      );

      setResult(result);
      operationIndicator.textContent = "";

      firstOperand = null;
      pendingOperation = null;
      waitingForSecondOperand = true;

      message.textContent = "";
    } catch (error) {
      message.textContent = error.message;
    }
  });

// ==================================
// WORD-SIZE SELECTION
// ==================================

wordSizeSelect.addEventListener("change", () => {
  wordSize = Number(wordSizeSelect.value);

  // Convert the current number to the selected word size
  const normalizedValue = normalizeValue(getDecimalValue());

  inputValue = normalizedValue.toString(currentBase).toUpperCase();

  // Cancel any unfinished operation
  firstOperand = null;
  pendingOperation = null;
  waitingForSecondOperand = false;

  operationIndicator.textContent = "";
  message.textContent = "";

  updateDisplays();
});

// Initialize
updateDigitButtons();
updateDisplays();

// ==================================
// KEYBOARD SUPPORT
// ==================================

document.addEventListener("keydown", (event) => {
  // Ignore keyboard shortcuts when typing in an input field
  if (
    event.target.matches("input, textarea, select") ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey
  ) {
    return;
  }

  const key = event.key.toUpperCase();

  // Number input: 0-9 and A-F
  if (/^[0-9A-F]$/.test(key)) {
    const button = document.querySelector(
      `.programmer-buttons [data-digit="${key}"]`,
    );

    if (button && !button.disabled) {
      event.preventDefault();
      button.click();
    }

    return;
  }

  // Keyboard shortcuts for operations
  const shortcuts = {
    Enter: "equals",
    "=": "equals",
    Backspace: "backspace",
    Escape: "clear",
    "&": "and",
    "|": "or",
    "^": "xor",
    "<": "left-shift",
    ">": "right-shift",
    "~": "not",
  };

  const action = shortcuts[event.key];

  if (action) {
    const button = document.querySelector(
      `.programmer-buttons [data-action="${action}"]`,
    );

    if (button && !button.disabled) {
      event.preventDefault();
      button.click();
    }
  }
});
