import * as dat from 'dat.gui';
import p5 from 'p5';

window.addEventListener('load', function () {
    const p5Context = document.getElementById('p5-container');

    const gui = new dat.GUI({ name: 'Cloud Controls' });

    const params = {
        cloudWidth: 10,
        cloudHeight: 10,
        gridSize: 4,
        scale: 1.5,
    }

    gui.add(params, 'cloudWidth', 0, 50);
    gui.add(params, 'cloudHeight', 0, 50);
    gui.add(params, 'scale', 0, 50);
    gui.add(params, 'gridSize', 0, 50, 1);

    const sketch = (p5) => {
        // Create a new canvas to browser size
        p5.setup = function() {
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
        }

        // When the browser window resizes, resize the canvas too
        p5.windowResized = function() {
            resizeCanvas(p5.windowWidth, p5.windowHeight);
        }

        // Render loop
        p5.draw = function() {
            // Proportion used to make sure sizing is consistent regardless of orientation
            const dim = Math.min(p5.width, p5.height);

            const margin = dim * 0.2;

            // white background
            p5.background(255);

            const gridSize = params.gridSize;
            const innerWidth = p5.width - margin * 2;
            const scaledGridSize = gridSize * 1.5;
            const cellSize = innerWidth / gridSize;

            for (let y = 0; y < gridSize; y += 1) {
                for (let x = 0; x < gridSize; x += 1) {
                    // for the case where the grid's size is only one, make it all in the middle
                    const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
                    const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

                    const px = p5.lerp(margin, p5.width - margin, u);
                    const py = p5.lerp(margin, p5.height - margin, v);

                    p5.fill(255);

                    printCloud({
                        startX: px,
                        startY: py,
                        amplitude: 0,
                        cloudWidth: params.cloudWidth,
                        cloudHeight: params.cloudHeight,
                        length: dim * 0.04,
                        scale: params.scale,
                    });

                    p5.fill(0);
                    p5.ellipse(px, py, 20, 20);
                }
            }

        }

        function printCloud(options) {
            const {
                startX,
                startY,
                amplitude,
                length,
                cloudWidth,
                cloudHeight,
                scale
            } = options;

            const calcVScale = (x, i, amp) => {
                return x - amp * p5.noise(i + x * amp);
            }

            const radius = length;
            const eHeight = cloudHeight * scale;
            const eWidth = cloudWidth * scale;
            // Cloud shape
            p5.beginShape();
            for (let i = 0; i < 2 * p5.PI; i += 0.01) {
                p5.vertex(eWidth * Math.cos(i) + calcVScale(startX, i, amplitude), eHeight * Math.sin(i) + calcVScale(startY, i, amplitude));
            }
            p5.vertex(eWidth * Math.cos(0) + calcVScale(startX, 0, amplitude), eHeight * Math.sin(0) + calcVScale(startY, 0, amplitude));
            p5.endShape();
        }
    }

    new p5(sketch, p5Context);
});
