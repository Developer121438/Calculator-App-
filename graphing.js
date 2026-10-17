const canvas = document.getElementById("graph-canvas");
const ctx = canvas.getContext("2d");

const functionInputs = [
  document.getElementById("function1"),
  document.getElementById("function2"),
  document.getElementById("function3"),
];

const message = document.getElementById("graph-message");

const colors = ["#e53935", "#1565c0", "#2e7d32"];

let scale = 30;
let plottedFunctions = [];
let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Navigation
const menuButton = document.getElementById("graph-menu-btn");
const navigation = document.getElementById("graph-navigation");
// Open and close navigation
// Open and close navigation
menuButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const isOpen = navigation.classList.toggle("active");

  // Change hamburger into X
  menuButton.classList.toggle("active", isOpen);

  menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Close navigation when clicking outside
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
// Canvas sizing
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawGraph();
}

// Draw coordinate grid
function drawGrid(width, height) {
  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;

  ctx.beginPath();

  for (let x = centerX % scale; x < width; x += scale) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = centerY % scale; y < height; y += scale) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();

  // Axes
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1.5;

  ctx.beginPath();

  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);

  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);

  ctx.stroke();

  // Axis labels
  ctx.fillStyle = "#555";
  ctx.font = "12px sans-serif";

  ctx.fillText("0", centerX + 5, centerY + 15);

  for (let i = 1; centerX + i * scale < width; i++) {
    ctx.fillText(i, centerX + i * scale + 3, centerY + 15);
  }

  for (let i = 1; centerX - i * scale > 0; i++) {
    ctx.fillText(-i, centerX - i * scale + 3, centerY + 15);
  }

  for (let i = 1; centerY - i * scale > 0; i++) {
    ctx.fillText(i, centerX + 5, centerY - i * scale - 3);
  }

  for (let i = 1; centerY + i * scale < height; i++) {
    ctx.fillText(-i, centerX + 5, centerY + i * scale - 3);
  }
}

// Plot a function
function plotFunction(compiledFunction, color, width, height) {
  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  let drawing = false;
  let previousY = null;

  for (let px = 0; px < width; px += 1) {
    const x = (px - centerX) / scale;

    try {
      const y = compiledFunction.evaluate({ x });

      if (typeof y !== "number" || !Number.isFinite(y)) {
        drawing = false;
        previousY = null;
        continue;
      }

      const py = centerY - y * scale;

      // Avoid connecting across large discontinuities
      if (
        !Number.isFinite(py) ||
        Math.abs(py) > 100000 ||
        (previousY !== null && Math.abs(py - previousY) > height * 0.5)
      ) {
        drawing = false;
        previousY = null;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(px, py);
        drawing = true;
      } else {
        ctx.lineTo(px, py);
      }

      previousY = py;
    } catch (error) {
      drawing = false;
      previousY = null;
    }
  }

  ctx.stroke();
}

// Draw everything
function drawGraph() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // Clear previous drawing
  ctx.clearRect(0, 0, width, height);

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Draw grid and axes
  drawGrid(width, height);

  // Draw mathematical functions
  plottedFunctions.forEach((item, index) => {
    if (item) {
      plotFunction(item, colors[index], width, height);
    }
  });
}
// Compile and plot
function plotGraphs() {
  message.textContent = "";

  const functions = [];

  for (let i = 0; i < functionInputs.length; i++) {
    const expression = functionInputs[i].value.trim();

    if (!expression) {
      functions.push(null);
      continue;
    }

    try {
      const compiled = math.compile(expression);
      console.log("Compiled expression:", expression);

      // Test expression before plotting
      const result = compiled.evaluate({ x: 1 });

      if (typeof result !== "number") {
        throw new Error("Function must return a number");
      }

      functions.push(compiled);
      console.log("Function added successfully:", compiled);
    } catch (error) {
      message.textContent = `Invalid expression in y${i + 1}: ${error.message}`;

      return;
    }
  }

  plottedFunctions = functions;

  drawGraph();
}

// Zoom
document.getElementById("zoom-in").addEventListener("click", () => {
  scale = Math.min(scale * 1.25, 200);
  drawGraph();
});

document.getElementById("zoom-out").addEventListener("click", () => {
  scale = Math.max(scale / 1.25, 5);
  drawGraph();
});

// Reset
document.getElementById("reset-view").addEventListener("click", () => {
  scale = 30;

  offsetX = 0;
  offsetY = 0;

  drawGraph();
});

// Clear
document.getElementById("clear-graph").addEventListener("click", () => {
  functionInputs.forEach((input) => (input.value = ""));

  plottedFunctions = [];
  message.textContent = "";

  drawGraph();
});

// Plot button
document.getElementById("plot-btn").addEventListener("click", plotGraphs);

// Enter key
functionInputs.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      plotGraphs();
    }
  });
});

// Resize
window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
plotGraphs();
// Mouse dragging
canvas.addEventListener("mousedown", (event) => {
  isDragging = true;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  canvas.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  offsetX += deltaX;
  offsetY += deltaY;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  drawGraph();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  canvas.style.cursor = "grab";
});
// Coordinate tracking
const coordinates = document.getElementById("coordinates");

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();

  const centerX = canvas.clientWidth / 2 + offsetX;
  const centerY = canvas.clientHeight / 2 + offsetY;

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const x = (mouseX - centerX) / scale;
  const y = (centerY - mouseY) / scale;

  coordinates.textContent = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)}`;
});
// Download graph as PNG
document.getElementById("download-graph").addEventListener("click", () => {
  const imageURL = canvas.toDataURL("image/png");

  const link = document.createElement("a");

  link.href = imageURL;
  link.download = "calculator-graph.png";

  document.body.appendChild(link);
  link.click();
  link.remove();
});
