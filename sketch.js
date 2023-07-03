/////////////////////////////////////////////////////
//set the Tilemap size with the gridWidth and gridHeight variables;

//left click - select tile
//press a key to type it in the selected tile
//shift+left click - select multiple tiles one at a time
//hold ctrl - continuously select multiple tiles while moving mouse
//tab - copy the tile map to your clip board, and log it in the console

// you can upload your own tile maps by un-commenting the prompt section,
// in the setup. exclude "[" and "]" when pasting in your map string.

// you can assign colors to any character you would like with,
// the getColorFromKey(key) function below;

function getColorFromKey(key) {
  switch (key) {
    //copy paste the two lines below this to make as many colors as you need
    // case "P":
    //   return color(195, 50, 195);
    case "g":
      return color(0, 255, 0);
    case "r":
      return color(255, 0, 0);
    case "b":
      return color(0, 0, 255);
    default:
      return color(255);
  }
}
let inputText = [];
let tileColors = [];
let gridSize = 20;
let gridWidth = 25; //change this for you tile map width
let gridHeight = 25; //change this for you tile map height
let canvasWidth = gridWidth * gridSize;
let canvasHeight = gridHeight * gridSize;
let maxInputLength = gridWidth * gridHeight;
let fontSize = 14;
let padding = 10;
let selectedTiles = [];
let isShiftDown = false;
function setup() {
  Canvas = createCanvas(canvasWidth, canvasHeight);
  Canvas.style("position", "absolute");
  Canvas.style("object-fit", "contain");
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  Canvas.position(canvasX, canvasY);
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  textFont("monospace");

  for (let i = 0; i < maxInputLength; i++) {
    inputText[i] = "";
    tileColors[i] = color(255);
  }
  // Prompt for grid string input, uncomment the two lines below and run the sketch.
  // const gridString = prompt("Enter grid string:");
  // parseGridString(gridString);
}
function draw() {
  background(220);
  // Draw grid
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const tileIndex = x + y * gridWidth;
      const tileCenter = createVector(x, y)
        .mult(gridSize)
        .add(gridSize / 2, gridSize / 2);
      if (isSelectedTile(x, y)) {
        fill(200);
      } else {
        fill(tileColors[tileIndex]);
      }
      rect(
        tileCenter.x - gridSize / 2,
        tileCenter.y - gridSize / 2,
        gridSize,
        gridSize
      );
      fill(0);
      text(inputText[tileIndex] || ".", tileCenter.x, tileCenter.y);
    }
  }
  // Draw cursor
  if (frameCount % 60 < 30 && !isShiftDown && selectedTiles.length > 0) {
    const cursorPositionInPixels = selectedTiles[0]
      .copy()
      .mult(gridSize)
      .add(padding + gridSize / 2, padding + gridSize / 2);
    stroke(0);
    line(
      cursorPositionInPixels.x - gridSize / 2,
      cursorPositionInPixels.y,
      cursorPositionInPixels.x + gridSize / 2,
      cursorPositionInPixels.y
    );
  }
  if (keyIsDown(CONTROL)) {
    let clickedTile = createVector(
      floor(mouseX / gridSize),
      floor(mouseY / gridSize)
    );
    if (
      clickedTile.x >= 0 &&
      clickedTile.x < gridWidth &&
      clickedTile.y >= 0 &&
      clickedTile.y < gridHeight
    ) {
      if (isSelectedTile(clickedTile.x, clickedTile.y)) {
        // removeSelectedTile(clickedTile.x, clickedTile.y);
      } else {
        addSelectedTile(clickedTile.x, clickedTile.y);
      }
    }
  }
}
function parseGridString(gridString) {
  const lines = gridString.trim().split("\n");
  gridHeight = lines.length;
  gridWidth = lines[0].length;

  for (let y = 0; y < gridHeight; y++) {
    const line = lines[y];
    for (let x = 0; x < gridWidth; x++) {
      const tileIndex = x + y * gridWidth;
      inputText[tileIndex] = line[x];
      tileColors[tileIndex] = getColorFromKey(line[x]);
    }
  }
  // Update canvas size based on new grid dimensions
  canvasWidth = gridWidth * gridSize;
  canvasHeight = gridHeight * gridSize;
  resizeCanvas(canvasWidth, canvasHeight);
  const canvasX = (windowWidth - width) / 2;
  const canvasY = (windowHeight - height) / 2;
  Canvas.position(canvasX, canvasY);
}
function mouseClicked() {
  const clickedTile = createVector(
    floor(mouseX / gridSize),
    floor(mouseY / gridSize)
  );
  if (
    clickedTile.x >= 0 &&
    clickedTile.x < gridWidth &&
    clickedTile.y >= 0 &&
    clickedTile.y < gridHeight
  ) {
    if (isShiftDown) {
      if (isSelectedTile(clickedTile.x, clickedTile.y)) {
        removeSelectedTile(clickedTile.x, clickedTile.y);
      } else {
        addSelectedTile(clickedTile.x, clickedTile.y);
      }
    } else {
      selectedTiles = [clickedTile.copy()];
    }
  }
}
function keyTyped() {
  if (selectedTiles.length > 0) {
    if (isShiftDown) {
      if (keyCode === BACKSPACE) {
        for (const tile of selectedTiles) {
          const tileIndex = tile.x + tile.y * gridWidth;
          if (inputText[tileIndex].length > 0) {
            inputText[tileIndex] = inputText[tileIndex].substring(
              0,
              inputText[tileIndex].length - 1
            );
          } else {
            moveCursorBackward();
          }
        }
      } else if (keyCode !== ENTER) {
        for (const tile of selectedTiles) {
          const tileIndex = tile.x + tile.y * gridWidth;
          inputText[tileIndex] = key;
          tileColors[tileIndex] = getColorFromKey(key);
          moveCursorForward();
        }
      }
    } else {
      const tileIndex = selectedTiles[0].x + selectedTiles[0].y * gridWidth;
      if (keyCode === BACKSPACE) {
        if (inputText[tileIndex].length > 0) {
          inputText[tileIndex] = inputText[tileIndex].substring(
            0,
            inputText[tileIndex].length - 1
          );
        } else {
          moveCursorBackward();
        }
      } else if (
        keyCode !== ENTER &&
        inputText.join("").length < maxInputLength
      ) {
        for (const tile of selectedTiles) {
          const tileIndex = tile.x + tile.y * gridWidth;
          inputText[tileIndex] = key;
          tileColors[tileIndex] = getColorFromKey(key);
          moveCursorForward();
        }
      }
    }
    if (selectedTiles.length > 1) {
      selectedTiles = [];
    }
  }
}
function keyPressed() {
  if (keyCode === SHIFT) {
    isShiftDown = true;
  }
  if (keyIsDown(TAB)) {
    logGridString();
  }
}
function keyReleased() {
  if (keyCode === SHIFT) {
    isShiftDown = false;
  }
}
function moveCursorForward() {
  const currentIndex = selectedTiles[0].x + selectedTiles[0].y * gridWidth;

  if (currentIndex < maxInputLength - 1) {
    selectedTiles[0].x++;
    if (selectedTiles[0].x >= gridWidth) {
      selectedTiles[0].x = 0;
      selectedTiles[0].y++;
    }
  }
}
function moveCursorBackward() {
  const currentIndex = selectedTiles[0].x + selectedTiles[0].y * gridWidth;

  if (currentIndex > 0) {
    selectedTiles[0].x--;
    if (selectedTiles[0].x < 0) {
      selectedTiles[0].x = gridWidth - 1;
      selectedTiles[0].y--;
    }
  }
}
function parseGridString(gridString) {
  const lines = gridString.trim().split(",");
  gridHeight = lines.length;
  gridWidth = lines[0].trim().length - 2; // Exclude opening and closing quotation marks

  for (let y = 0; y < gridHeight; y++) {
    const line = lines[y].trim();
    for (let x = 0; x < gridWidth; x++) {
      const tileIndex = x + y * gridWidth;
      inputText[tileIndex] = line[x + 1]; // Skip the quotation mark
      tileColors[tileIndex] = getColorFromKey(line[x + 1]);
    }
  }

  // Update canvas size based on new grid dimensions
  canvasWidth = gridWidth * gridSize;
  canvasHeight = gridHeight * gridSize;
  resizeCanvas(canvasWidth, canvasHeight);
  const canvasX = (windowWidth - width) / 2;
  const canvasY = (windowHeight - height) / 2;
  Canvas.position(canvasX, canvasY);
}

function isSelectedTile(x, y) {
  for (const tile of selectedTiles) {
    if (tile.x === x && tile.y === y) {
      return true;
    }
  }
  return false;
}
function addSelectedTile(x, y) {
  selectedTiles.push(createVector(x, y));
}
function removeSelectedTile(x, y) {
  for (let i = 0; i < selectedTiles.length; i++) {
    if (selectedTiles[i].x === x && selectedTiles[i].y === y) {
      selectedTiles.splice(i, 1);
      break;
    }
  }
}

