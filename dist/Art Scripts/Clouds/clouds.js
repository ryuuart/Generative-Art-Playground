// Create a new canvas to browser size
function setup() {
    createCanvas(windowWidth, windowHeight);
}

// When the browser window resizes, resize the canvas too
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Render loop
function draw() {
    // Proportion used to make sure sizing is consistent regardless of orientation
    const dim = Math.min(width, height);

    const margin = dim * 0.2;

    // white background
    background(255);

    const gridSize = 4;
    const innderWidth = width - margin * 2;
    const scaledGridSize = gridSize * 1.5;
    const cellSize = innerWidth / gridSize;

    for (let y = 0; y < gridSize; y+=1) {
        for (let x = 0; x < gridSize; x+=1) {
            // for the case where the grid's size is only one, make it all in the middle
            const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
            const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);
            
            const px = lerp(margin, width - margin, u);
            const py = lerp(margin, height - margin, v);
            
            printCloud({
                startX: px,
                startY: py,
                amplitude: 50,
                length: dim * 0.04 
            });
        }
    }

}

function printCloud(options) {
    const {
            startX,
            startY,
            amplitude,
            length,
    } = options;

    const calcVScale = (x, i, amp) => {
        return x - amp * noise(i + x * amp);
    }

    const radius = length;
    const eHeight = length;
    const eWidth = length * 1.5;
    // Cloud shape
    beginShape();
    for (let i = 0; i < 2 * PI; i+= 0.01) {
        vertex(eWidth * cos(i) + calcVScale(startX, i, amplitude), eHeight * sin(i) + calcVScale(startY, i, amplitude));
    }
    vertex(eWidth * cos(0) + calcVScale(startX, 0, amplitude), eHeight * sin(0) + calcVScale(startY, 0, amplitude));
    endShape();
}