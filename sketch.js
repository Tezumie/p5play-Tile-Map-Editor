let cols, rows;
let gridSize = 30;
let gridData = [];
let selectedKey = ".";
let colorData = {};
let currentColor = "#FFFFFF";
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
function setupControls() {
  let rowsInput = select("#rowsInput");
  let colsInput = select("#colsInput");
  let keyInput = select("#keyInput");
  let colorPicker = select("#colorPicker");
  keyInput.value(selectedKey);
  colorPicker.value(colorData[selectedKey] || currentColor);
  rowsInput.input(updateGrid);
  colsInput.input(updateGrid);
  keyInput.input(function () {
    selectedKey = keyInput.value().charAt(0);
    if (colorData[selectedKey]) {
      colorPicker.value(colorData[selectedKey]);
    } else {
      colorData[selectedKey] = "#FFFFFF";
      colorPicker.value("#FFFFFF");
    }
  });
  colorPicker.input(function () {
    currentColor = colorPicker.value();
    colorData[selectedKey] = currentColor;
  });
}
function updateGrid() {
  const newCols = select("#colsInput").value();
  const newRows = select("#rowsInput").value();
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
      fill(0);
      textSize(gridSize * 0.8);
      textAlign(CENTER, CENTER);
      stroke(255);
      strokeWeight(1);
      text(gridData[i][j], x + gridSize / 2, y + gridSize / 2);
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
