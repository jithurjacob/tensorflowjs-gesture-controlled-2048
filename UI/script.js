// import * as tf from '@tensorflow/tfjs';


const NUM_CLASSES = 4;

let truncatedMobileNet;
let model;
let isPredicting = false;

const webcam = new Webcam(document.getElementById('webcam'));
const controllerDataset = new ControllerDataset(NUM_CLASSES);
const ui = new UI_();

// Loads mobilenet and returns a model that returns the internal activation
// we'll use as input to our classifier model.
async function loadTruncatedMobileNet() {
    const mobilenet = await tf.loadModel(
        'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

    // Return a model that outputs an internal activation.
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
}


// When the UI buttons are pressed, read a frame from the webcam and associate
// it with the class label given by the button. up, down, left, right are
// labels 0, 1, 2, 3 respectively.
ui.setExampleHandler(label => {
    tf.tidy(() => {
      const img = webcam.capture();
      controllerDataset.addExample(truncatedMobileNet.predict(img), label);
  
      // Draw the preview thumbnail.
      ui.drawThumb(img, label);
    });
  });
  
async function init() {
    try {
        await webcam.setup();
    } catch (e) {
        document.getElementById('no-webcam').style.display = 'block';
    }
    truncatedMobileNet = await loadTruncatedMobileNet();

    // Warm up the model. This uploads weights to the GPU and compiles the WebGL
    // programs so the first time we collect data from the webcam it will be
    // quick.
    tf.tidy(() => truncatedMobileNet.predict(webcam.capture()));

    ui.init();
}

// Initialize the application.
init();


