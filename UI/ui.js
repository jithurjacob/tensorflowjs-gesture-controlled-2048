
const CONTROLS = ['up', 'down', 'left', 'right', 'noaction'];
const CONTROL_CODES = [38, 40, 37, 39, -1];

function UI_() {
  this.addExampleHandler;
  this.thumbDisplayed = {};

  this.statusElement = document.getElementById('status');
  this.trainStatusElement = document.getElementById('train-status');
  this.learningRateElement = document.getElementById('learningRate');
  this.batchSizeFractionElement = document.getElementById('batchSizeFraction');
  this.epochsElement = document.getElementById('epochs');
  this.denseUnitsElement = document.getElementById('dense-units');

  this.upButton = document.getElementById('up');
  this.downButton = document.getElementById('down');
  this.leftButton = document.getElementById('left');
  this.rightButton = document.getElementById('right');
  this.noactionButton = document.getElementById('noaction');

  this.upButton.addEventListener('mousedown', () => this.handler(0));
  this.upButton.addEventListener('mouseup', () => mouseDown = false);

  this.downButton.addEventListener('mousedown', () => this.handler(1));
  this.downButton.addEventListener('mouseup', () => mouseDown = false);

  this.leftButton.addEventListener('mousedown', () => this.handler(2));
  this.leftButton.addEventListener('mouseup', () => mouseDown = false);

  this.rightButton.addEventListener('mousedown', () => this.handler(3));
  this.rightButton.addEventListener('mouseup', () => mouseDown = false);

  this.noactionButton.addEventListener('mousedown', () => this.handler(4));
  this.noactionButton.addEventListener('mouseup', () => mouseDown = false);

}


UI_.prototype.init = function () {
  document.getElementById('controller').style.display = '';
  this.statusElement.style.display = 'none';
}


// Set hyper params from UI values.
UI_.prototype.getLearningRate = function(){return +this.learningRateElement.value; }
UI_.prototype.getBatchSizeFraction = function(){return +this.batchSizeFractionElement.value;}
UI_.prototype.getEpochs = function(){return +this.epochsElement.value;}
UI_.prototype.getDenseUnits = function(){ return +this.denseUnitsElement.value;}

UI_.prototype.startPacman = function() {
  //google.pacman.startGameplay();
}

UI_.prototype.predictClass = function(classId)  {
  console.log(classId);
  this.statusElement.text = classId;
  //google.pacman.keyPressed(CONTROL_CODES[classId]);
  //document.body.setAttribute('data-active', CONTROLS[classId]);
}

UI_.prototype.isPredicting = function() {
  this.statusElement.style.visibility = 'visible';
}
UI_.prototype.donePredicting = function()  {
  this.statusElement.style.visibility = 'hidden';
}
UI_.prototype.trainStatus = function(status) {
  this.trainStatusElement.innerText = status;
}

//export let addExampleHandler;
UI_.prototype.setExampleHandler = function(handler)  {
  this.addExampleHandler = handler;
}

let mouseDown = false;
const totals = [0, 0, 0, 0, 0];


UI_.prototype.handler = async function(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(className + '-total');
  while (mouseDown) {
    this.addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = totals[label]++;
    await tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}

UI_.prototype.draw = function(image, canvas){
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

UI_.prototype.drawThumb = function(img, label) {
  if (this.thumbDisplayed[label] == null) {
    this.thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    this.draw(img, this.thumbCanvas);
  }
}


