import * as dat from 'dat.gui';
import p5 from 'p5';

window.addEventListener('load', function () {
    const p5Context = document.getElementById('p5-container');

    const gui = new dat.GUI({ name: 'Cloud Controls' });

    const params = {
        cloudWidth: 10,
        cloudHeight: 10,
        gridWidth: 4,
        gridHeight: 4,
        scale: 1.5,
        amplitude: 1,
        randomize: true,
        diff: 10,
        fileName: 'clouds',
        save: function() {
        },
    }

    gui.add(params, 'cloudWidth', 0, 50);
    gui.add(params, 'cloudHeight', 0, 50);
    gui.add(params, 'amplitude', 0, 50);
    gui.add(params, 'scale', 0, 50);
    gui.add(params, 'gridWidth', 0, 50, 1);
    gui.add(params, 'gridHeight', 0, 50, 1);
    gui.add(params, 'randomize');


    const randomizeFolder = gui.addFolder('Randomize Only');
    randomizeFolder.add(params, 'diff', 0, 100);

    const saveFolder = gui.addFolder('Save');
    saveFolder.add(params, 'fileName');
    saveFolder.add(params, 'save');

    const sketch = (p5) => {
        // Create a new canvas to browser size
        p5.setup = function() {
            const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.Renderer);

            params.save = function() {
                p5.save(canvas, params.fileName ? params.fileName : 'clouds', 'png');
            }
        }

        // When the browser window resizes, resize the canvas too
        p5.windowResized = function() {
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        }

        // Render loop
        p5.draw = function() {
            // Proportion used to make sure sizing is consistent regardless of orientation
            const dim = Math.min(p5.width, p5.height);

            const margin = dim * 0.2;

            // white background
            p5.background(255);

            const innerWidth = p5.width - margin * 2;

            for (let y = 0; y < params.gridHeight; y += 1) {
                for (let x = 0; x < params.gridWidth; x += 1) {
                    // for the case where the grid's size is only one, make it all in the middle
                    const u = params.gridWidth <= 1 ? 0.5 : x / (params.gridWidth - 1);
                    const v = params.gridHeight <= 1 ? 0.5 : y / (params.gridHeight - 1);

                    const px = p5.lerp(margin, p5.width - margin, u);
                    const py = p5.lerp(margin, p5.height - margin, v);

                    printCloud({
                        startX: px,
                        startY: py,
                        amplitude: params.amplitude,
                        cloudWidth: params.cloudWidth,
                        cloudHeight: params.cloudHeight,
                        scale: params.scale,
                    });
                }
            }
        }
 
        function printCloud(options) {
            const {
                startX,
                startY,
                cloudWidth,
                cloudHeight,
                scale,
                amplitude,
            } = options;


            const eHeight = cloudHeight * scale;
            const eWidth = cloudWidth * scale;

            function startCloud(startPos, length, dirFun) {
                return function(circlePos) {
                    return startPos(circlePos) + length * dirFun(circlePos);
                }
            }

            const calcPosX = startCloud((pos) => {
                return startX - (scale * amplitude * Math.cos(pos) * p5.noise(Math.cos(pos) + 1, Math.sin(pos) + 1, params.randomize ? startY * params.diff : pos));
            }, eWidth, Math.cos);
            const calcPosY = startCloud((pos) => {
                return startY - (scale * amplitude * Math.sin(pos) * p5.noise(Math.cos(pos) + 1, Math.sin(pos) + 1, params.randomize ? startX * params.diff : pos));
            }, eHeight, Math.sin);

            // Cloud shape
            p5.beginShape();
            for (let i = 0; i < p5.TWO_PI; i += 0.01) {
                p5.vertex(calcPosX(i), calcPosY(i));
            }
            p5.endShape(p5.CLOSE);
        }
    }

    new p5(sketch, p5Context);
});
