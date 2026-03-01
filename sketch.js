let isScanning = false;
let resultData = null;
let progress = 0;
let charImg = null; 
let scanLineY = 0;
let tempData = null;
let rick; 

function preload() {
  rick = loadImage('rick.png'); 
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Courier New');
}

function draw() {
  drawComicBackground(); 

  
  

  let scW = 600; 
  let scH = height * 0.85; 
  if (scH > 600) scH = 600;
  if (scH < 450) scH = 450; 

  let scX = width / 2;
  let scY = height / 2;
  let scY_top = scY - scH / 2;

  //main
  push();
  translate(scX - scW / 2, scY_top);
  
  // yellow
  stroke(0);
  strokeWeight(8);
  fill(255, 210, 0); 
  rect(0, 0, scW, scH, 35);
  
  fill(60);
  ellipse(30, 30, 15); ellipse(scW - 30, 30, 15);
  ellipse(30, scH - 30, 15); ellipse(scW - 30, scH - 30, 15);

  // screen
  let screenH = 300; 
  let screenY = 70;
  fill(5, 25, 10); 
  stroke(0);
  strokeWeight(5);
  rect(40, screenY, scW - 80, screenH, 10);
  //grid
  stroke(0, 100, 0, 40);
  for (let i = 40; i < scW - 40; i += 40) line(i, screenY, i, screenY + screenH);
  for (let i = screenY; i < screenY + screenH; i += 40) line(40, i, scW - 40, i);


  if (isScanning) {
    runScanningAnimation(scW, screenY, screenH);
  } else if (resultData) {
    displayResult(scW, screenY, screenH);
  } else {
    textAlign(CENTER, CENTER);
    drawSciFiText("C-137", scW / 2, screenY + screenH / 2 - 30, 60, color(0, 255, 0), true);
    drawSciFiText("DIMENSIONAL SCANNER", scW / 2, screenY + screenH / 2 + 30, 18, color(0, 255, 100), true);
  }

  // bottom
  
  // bottom
  let btnBaseY = scH - 65; 
  
  // roundlights
  for (let i = 0; i < 3; i++) {
    let lx = scW / 2 - 140 - (i * 25); // 放在 SCAN 按钮左边
    stroke(0); strokeWeight(3);
    
    // flash
    let colors = [color(255, 0, 0), color(0, 255, 0), color(255, 200, 0)];
    if (frameCount % 30 < 15) fill(colors[i]); 
    else fill(40); 
    
    ellipse(lx, btnBaseY, 15, 15);
  
    fill(0); noStroke(); textSize(8); textAlign(CENTER);
    text("V-" + (i+1), lx, btnBaseY + 18);
  }

  // rectbottom
  for (let i = 0; i < 2; i++) {
    let rx = scW / 2 + 120 + (i * 35); 
    stroke(0); strokeWeight(3);
    fill(200, 30, 30);
    rectMode(CENTER);
    rect(rx, btnBaseY, 25, 25, 3);
    
   
  }
  drawComicButton(scW / 2, scH - 65, "SCAN");
  pop();

  // rickimg
  if (rick) {
    push();
    let rW = 320; 
    let rH = (rick.height / rick.width) * rW; 
    image(rick, width - rW - 20, height - rH - 20, rW, rH);
    pop();
  }
}

// animation
function runScanningAnimation(scW, screenY, screenH) {
  scanLineY = (frameCount * 12) % screenH;
  stroke(0, 255, 100);
  strokeWeight(5);
  line(40, screenY + scanLineY, scW - 40, screenY + scanLineY);
  
  fill(0, 255, 100, 40);
  noStroke();
  rect(40, screenY, scW - 80, scanLineY);

  textAlign(LEFT);
  drawSciFiText("X_AXIS: " + floor(random(1000, 9999)), 55, screenY + 30, 12, color(0, 255, 0));
  drawSciFiText("Y_AXIS: " + floor(random(1000, 9999)), 55, screenY + 50, 12, color(0, 255, 0));
  drawSciFiText("UPLINK: " + floor(progress) + "%", scW - 160, screenY + 30, 12, color(0, 255, 0));

  textAlign(CENTER);
  drawSciFiText("SCANNING...", scW / 2, screenY + screenH / 2, 22, color(0, 255, 150), true);
  
  progress += 1.5;
  if (progress > 100) finishScan();
}

// API 
function displayResult(scW, screenY, screenH) {
  let imgS = 140;
  let margin = 65;
  if (charImg) {
    image(charImg, margin, screenY + 40, imgS, imgS);
    stroke(0, 255, 100); noFill();
    rect(margin, screenY + 40, imgS, imgS);
  }
  textAlign(LEFT, TOP);
  let tx = margin + imgS + 20; 
  drawSciFiText(resultData.name.toUpperCase(), tx, screenY + 45, 16, color(0, 255, 200), true);
  let spacing = 32;
  drawSciFiText("> SP: " + resultData.species, tx, screenY + 85, 12, color(0, 255, 100));
  let originName = resultData.origin.name.length > 12 ? resultData.origin.name.substring(0, 10) + ".." : resultData.origin.name;
  drawSciFiText("> OR: " + originName, tx, screenY + 85 + spacing, 12, color(0, 255, 100));
  let sColor = resultData.status === "Alive" ? color(0, 255, 0) : color(255, 50, 50);
  drawSciFiText("> ST: " + resultData.status.toUpperCase(), tx, screenY + 85 + spacing * 2, 12, sColor);
}

// word
function drawSciFiText(txt, x, y, sz, c, isBold = false) {
  push();
  if (isBold) textStyle(BOLD);
  textSize(sz);
  noStroke();
  fill(c);
  text(txt, x, y); 
  pop();
}

// button
function drawComicButton(x, y, txt) {
  push();
  translate(x, y);
  fill(0);
  rectMode(CENTER);
  rect(5, 5, 180, 55, 10);
  stroke(0); strokeWeight(5);
  fill(255);
  rect(0, 0, 180, 55, 10);
  fill(0); noStroke();
  textAlign(CENTER, CENTER);
  textSize(20); textStyle(BOLD);
  text(txt, 0, 0);
  pop();
}

function startScan() {
  if (isScanning) return;
  isScanning = true;
  progress = 0;
  resultData = null;
  let id = floor(random(1, 826));
  loadJSON(`https://rickandmortyapi.com/api/character/${id}`, (data) => {
    tempData = data;
    charImg = loadImage(data.image); 
  });
}

function finishScan() {
  isScanning = false;
  resultData = tempData;
}

function mousePressed() {
  let scH = height * 0.85;
  if (scH > 600) scH = 600;
  if (scH < 450) scH = 450;
  let scY_top = (height - scH) / 2;
  let btnX = width / 2;
  let btnY = scY_top + (scH - 65); 
  if (mouseX > btnX - 90 && mouseX < btnX + 90 && 
      mouseY > btnY - 28 && mouseY < btnY + 28) {
    startScan();
  }
}

function drawComicBackground() {
  background(220, 40, 60); 
  fill(100, 0, 0, 65);
  noStroke();
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      ellipse(x, y, 6, 6);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}