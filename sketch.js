let cols, rows;
let gridSize = 30;
let gridData = [];
let selectedKey = "g";
let colorData = {};
let currentColor = "#008000";
let helpMenuVisible = false;
let displayTileId = true;
function toggleGridId() {
  if (displayTileId) {
    displayTileId = false;
  } else {
    displayTileId = true;
  }
}
function toggleHelpMenu() {
  const helpMenu = document.getElementById("helpMenu");
  helpMenuVisible = !helpMenuVisible;
  helpMenu.style.display = helpMenuVisible ? "block" : "none";
}

function setup() {
  document.body.style.backgroundColor = color(0);
  Canvas = createCanvas(500, 500);
  Canvas.style("position", "absolute");
  Canvas.style("object-fit", "contain");
  windowResized();
  Canvas.style("border", " 3px solid black");
  Canvas.style("border-color", color(234, 16, 78));
  updateGrid();
  setupControls();
  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleTabPress);
  setDefaultColors();
}
function windowResized() {
  resizeCanvas(cols * gridSize, rows * gridSize);
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  if (width > window.innerWidth) {
    canvasX = 0;
  }
  canvasY = 120;
  Canvas.position(canvasX, canvasY);
}
function setDefaultColors() {
  const defaultColors = {
    a: "#00FFFF",
    b: "#000000",
    c: "#DC143C",
    d: "#9400D3",
    e: "#FFDAB9",
    f: "#808000",
    g: "#008000",
    h: "#FF69B4",
    i: "#4B0082",
    j: "#000080",
    k: "#F0E68C",
    l: "#00FF00",
    m: "#FF00FF",
    n: "#A52A2A",
    o: "#FFA500",
    p: "#FFC0CB",
    q: "#40E0D0",
    r: "#FF0000",
    s: "#87CEEB",
    t: "#D2B48C",
    u: "#0000FF",
    v: "#EE82EE",
    w: "#FFFFFF",
    x: "#FFD700",
    y: "#FFFF00",
    z: "#808080",
  };
  for (
    let letter = "a";
    letter <= "z";
    letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    if (!colorData[letter]) {
      colorData[letter] = defaultColors[letter] || "#FFFFFF";
    }
  }
}
function setupControls() {
  let gridSizeInput = select("#gridSizeInput");
  let rowsInput = select("#rowsInput");
  let colsInput = select("#colsInput");
  let keyInput = select("#keyInput");
  let colorPicker = select("#colorPicker");
  keyInput.value(selectedKey);
  colorPicker.value(colorData[selectedKey] || currentColor); // Set the color picker value directly to the hex value
  gridSizeInput.input(updateGrid);
  rowsInput.input(updateGrid);
  colsInput.input(updateGrid);
  keyInput.input(function () {
    selectedKey = keyInput.value().charAt(0);
    if (!colorData[selectedKey]) {
      colorData[selectedKey] = "#FFFFFF"; // Set a default hex value
    }
    colorPicker.value(colorData[selectedKey]); // Set the color picker value directly to the hex value
  });
  colorPicker.input(function () {
    currentColor = colorPicker.value();
    colorData[selectedKey] = currentColor; // Store the hex value directly in colorData
  });
}
function clearGridId() {
  const newCols = cols;
  const newRows = rows;
  const tempGridData = [];
  for (let i = 0; i < newRows; i++) {
    tempGridData.push([]);
    for (let j = 0; j < newCols; j++) {
      tempGridData[i][j] = ".";
    }
  }
  gridData = tempGridData;
  redraw();
}

function updateGrid(clearGrid) {
  const newCols = select("#colsInput").value();
  const newRows = select("#rowsInput").value();
  gridSize = select("#gridSizeInput").value();
  const oldCols = cols;
  const oldRows = rows;
  const tempGridData = [];
  for (let i = 0; i < newRows; i++) {
    tempGridData.push([]);
    for (let j = 0; j < newCols; j++) {
      if (i < oldRows && j < oldCols) {
        tempGridData[i][j] = gridData[i][j];
      } else {
        tempGridData[i][j] = ".";
      }
    }
  }
  cols = newCols;
  rows = newRows;
  gridData = tempGridData;
  resizeCanvas(cols * gridSize, rows * gridSize);
  windowResized();
}
function isColorTooDark(color) {
  let r = red(color);
  let g = green(color);
  let b = blue(color);
  let brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;
  return brightnessValue < 80;
}
function draw() {
  background(220);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * gridSize;
      let y = i * gridSize;
      stroke(10);
      strokeWeight(1);
      let fillColor = colorData[gridData[i][j]] || color(255);
      fill(fillColor);
      rect(x, y, gridSize, gridSize);
      let textColor = isColorTooDark(fillColor) ? color(255) : color(0);
      fill(textColor);
      textFont("Arial");
      textSize(gridSize * 0.8);
      textAlign(CENTER, CENTER);
      if (displayTileId) {
        text(gridData[i][j], x + gridSize / 2, y + gridSize / 2);
      }
    }
  }
  if (
    mouseX >= 0 &&
    mouseY >= 0 &&
    mouseX < cols * gridSize &&
    mouseY < rows * gridSize
  ) {
    let col = floor(mouseX / gridSize);
    let row = floor(mouseY / gridSize);
    noFill();
    stroke(234, 16, 78);
    strokeWeight(3);
    rect(col * gridSize, row * gridSize, gridSize, gridSize);
    strokeWeight(1);
  }
}
function mouseClicked() {
  if (mouseButton === LEFT) {
    let col = floor(mouseX / gridSize);
    let row = floor(mouseY / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      gridData[row][col] = selectedKey;
    }
  }
}

function mouseDragged() {
  if (mouseButton === LEFT) {
    let col = floor(mouseX / gridSize);
    let row = floor(mouseY / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      gridData[row][col] = selectedKey;
    }
  }
}
function handleKeyPress(event) {
  const key = event.key;
  if (key.length === 1) {
    selectedKey = key;
    document.getElementById("keyInput").value = key;
    let colorPicker = select("#colorPicker");
    colorPicker.value(colorData[selectedKey] || "#FFFFFF");
  }
}

function copyPalette() {
  let paletteData = {};
  for (let key in colorData) {
    if (colorData.hasOwnProperty(key)) {
      let colorValue = colorData[key];
      paletteData[key] = colorValue;
    }
  }

  let paletteString = JSON.stringify(paletteData, null, 2);
  copyToClipboard(paletteString);
}

function setPaletteFromLog() {
  let logTextArea = select("#copyPastePalette");
  let logData = logTextArea.value().trim();

  // Remove trailing commas using regular expression
  logData = logData.replace(/,\s*([\]}])/g, "$1");

  try {
    const paletteData = JSON.parse(logData);
    if (typeof paletteData === "object") {
      for (let key in paletteData) {
        let colorValue = paletteData[key];
        if (typeof colorValue === "string" && colorValue.charAt(0) === "#") {
          colorData[key] = colorValue;
        }
      }
      redraw();
    } else {
      console.error("Invalid palette data format.");
    }
  } catch (error) {
    console.error("Error parsing palette data:", error);
  }
}

/////////////////////////////////
function copyTileMap() {
  let gridString = "";
  for (let i = 0; i < rows; i++) {
    let rowData = '"' + gridData[i].join("") + '",';
    gridString += rowData + "\n";
  }
  console.log(gridString);
  copyToClipboard(gridString);
  event.preventDefault();
}
function handleTabPress(event) {
  if (event.keyCode === 9) {
    let gridString = "";
    for (let i = 0; i < rows; i++) {
      let rowData = '"' + gridData[i].join("") + '",';
      gridString += rowData + "\n";
    }
    console.log(gridString);
    copyToClipboard(gridString);
    event.preventDefault();
  }
}
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
function setGridFromLog() {
  let logTextArea = select("#copyPaste");
  let logData = logTextArea.value().trim();
  let logLines = logData.split("\n");
  let newRows = logLines.length;
  let newCols = 0;
  for (let i = 0; i < newRows; i++) {
    let rowData = logLines[i].trim();
    rowData = rowData.replace(/["',]/g, "");
    if (rowData.length > newCols) {
      newCols = rowData.length;
    }
  }
  if (newRows >= 1 && newCols >= 1) {
    const tempGridData = [];
    for (let i = 0; i < newRows; i++) {
      let rowData = logLines[i].trim();
      rowData = rowData.replace(/["',]/g, "");
      let rowArray = rowData.split("");

      while (rowArray.length < newCols) {
        rowArray.push(".");
      }
      tempGridData.push(rowArray);
    }
    cols = newCols;
    rows = newRows;
    gridData = tempGridData;
    select("#rowsInput").value(rows);
    select("#colsInput").value(cols);
    resizeCanvas(cols * gridSize, rows * gridSize);
    windowResized();
    redraw();
  }
}
