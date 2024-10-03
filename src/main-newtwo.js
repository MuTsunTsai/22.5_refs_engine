//import relevant brains from flatfolder
import { M } from "./flatfolder/math.js";
import { IO } from "./flatfolder/io.js";
import { AVL } from "./flatfolder/avl.js";
import { NOTE } from "./flatfolder/note.js";

// Initialize Paper.js
function initializeCanvas() {
    const canvas = document.getElementById('myCanvas');
    if (canvas) {
        paper.setup(canvas);
        resizeCanvas(); // Ensure canvas size is correct
    } else {
        console.error('Canvas element not found.');
    }
}

// Initialize canvas on page load
initializeCanvas();
window.addEventListener('resize', resizeCanvas);

// Function to ensure window.variable stays within range
function setWindowVariable(value) {
    if (value < 1) {
        window.variable = 1; // Set to minimum
    } else if (value > globalC2.length) {
        window.variable = globalC2.length; // Set to maximum
    } else {
        window.variable = value; // Valid value
    }
}

// Update the displayed variable value in the HTML
function updateDisplay() {
    document.getElementById('variableValue').innerText = window.variable;
    document.getElementById("value1Modal").value = defaultValue1
    document.getElementById("value2Modal").value = defaultValue2
    document.getElementById("constructibleToggle").value = defaultConstructible
    document.getElementById("constructibleToggle").checked = defaultConstructible
    updateInfoText(); // Update the status text
}

// Function to handle file upload
function handleFileUpload() {
    
    window.variable = 1; // Reset window.variable to 1
    resetOtherVars(); // Call to reset other variables
    console.log("Settings reset to defaults.");

    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            processFile(event); // Process the file after reading
            updateInfoText(event); // Update the display after file processing
        };
        fileReader.readAsText(fileInput.files[0]);
    }
}

let defaultAX = 0;
let defaultBX = 0;
let defaultCX = 1;
let defaultAY = 0;
let defaultBY = 0;
let defaultCY = 1;

const inputAX = document.getElementById("inputAX");
const inputBX = document.getElementById("inputBX");
const inputCX = document.getElementById("inputCX");
const inputAY = document.getElementById("inputAY");
const inputBY = document.getElementById("inputBY");
const inputCY = document.getElementById("inputCY");

inputAX.value = defaultAX;
inputBX.value = defaultBX;
inputCX.value = defaultCX;
inputAY.value = defaultAY;
inputBY.value = defaultBY;
inputCY.value = defaultCY;

document.getElementById('submitABC').addEventListener('click', abcRender);

function abcRender () {
    defaultValue1 = 32; // Reset to default value
    defaultValue2 = 0.1; // Reset to default value
    defaultConstructible = false; // Reset to default value
    document.getElementById("value1Modal").value = 32;
    document.getElementById("value2Modal").value = 0.1;
    document.getElementById("constructibleToggle").value = false;
    document.getElementById("constructibleToggle").checked = false;
    window.variable = 1;

    let ax = parseFloat(inputAX.value);
    let bx = parseFloat(inputBX.value);
    let cx = parseFloat(inputCX.value);
    let ay = parseFloat(inputAY.value);
    let by = parseFloat(inputBY.value);
    let cy = parseFloat(inputCY.value);

    console.log (ax)
    console.log (bx)
    console.log (cx)
    console.log (ay)
    console.log (by)
    console.log (cy)

    let a = cy * (ax * ay - 2 * bx * by);
    let b = cy * (ay * bx - ax * by);
    let c = cx * (ay ** 2 - 2 * by ** 2);

    let localxory = 'Y'

    if (summup(a, b, c) < 1) {
        [a, b, c] = inverse(a,b,c);
        localxory = 'X'
    }

    [a, b, c] = normalize(a,b,c)

    //let nega, negb, negc;
    //[nega, negb, negc] = normalize(((a ** 2) - (a * c) - (2 * (b ** 2))), (-b * c), (((a - c) ** 2) - (2 * (b ** 2))))
//
    //let typesArr = [[a, b, c], [nega, negb, negc]]
    //console.log(typesArr)

    if (summup(a,b,c) > 0) {
        if (summup(a,b,c) <= defaultValue2 ** -1) {
            if (c <= defaultValue1) {
                let inputC2 = [];

                let types = ['default', 'negdefault']
    
                for(let i = 0; i < types.length; i++) {
                    let globular = rankIt(a, b, c, types[i], 'abcRender');
                    inputC2.push(...globular);
                }
                    
                //function isReasonable (element) {
                //    return ((summup (element[0], element[1], element[2]) < (defaultValue2 ** -1)) && (summup (element[0], element[1], element[2]) > ((1 - defaultValue2) ** -1)))
                //}
        //
                //inputC2 = inputC2.filter(isReasonable);
        //
                inputC2.sort((a, b) => {
                    if (a === undefined || b === undefined) return Infinity;
                    return (a[5] || 0) - (b[5] || 0);
                });

                function isNotInfinity (arr) {
                    return (arr[5] !== Infinity)
                }

                inputC2 = inputC2.filter(isNotInfinity);
    
                globalC2 = inputC2;
    
                let startTester = new paper.Point(0,0);
                let finishTester = new paper.Point(1,1);
    
                if (localxory === 'Y') {
                    startTester.y = summup(a, b, c) ** -1;
                    finishTester.y = summup(a, b, c) ** -1;
                } else {
                    startTester.x = summup(a, b, c) ** -1;
                    finishTester.x = summup(a, b, c) ** -1;
                }
    
                globalVi = [[0,0], [0,1], [1,1], [1,0], [startTester.x, startTester.y], [finishTester.x, finishTester.y]];
    
                console.log(globalVi)
    
                console.log(globalC2)
    
                globalEvi = [[0,1],[1,2],[2,3],[0,3],[4,5]]
    
                globalEAi = ['B', 'B', 'B', 'B', 'M']
    
                drawEverything();
                updateDisplay();
            } else alert ("Either choose a less convoluted value or increase the maximum allowable denominator.")
        } else alert ("Either choose a larger value, or decrease the minimum allowable distance from the edge.")
    } else alert("aₓ + bₓ√2 and aᵧ + bᵧ√2 must both be greater than zero.")
}

// Function to reset other variables to default values
function resetOtherVars() {
    defaultValue1 = 32; // Reset to default value
    defaultValue2 = 0.1; // Reset to default value
    defaultConstructible = true; // Reset to default value
    document.getElementById("value1Modal").value = 32;
    document.getElementById("value2Modal").value = 0.1;
    document.getElementById("constructibleToggle").value = false;
    document.getElementById("constructibleToggle").checked = true;
    document.getElementById("inputAX").value = 0;
    document.getElementById("inputBX").value = 0;
    document.getElementById("inputCX").value = 1;
    document.getElementById("inputAY").value = 0;
    document.getElementById("inputBY").value = 0;
    document.getElementById("inputCY").value = 1;
    updateDisplay(); // Update the display to reflect the new values
}

function updateInfoText() {
    const fileStatus = document.getElementById('fileStatus');
    // Check if globalC2 has valid references after processing the file
    if (globalC2.length > 0 && window.variable > 0 && window.variable <= globalC2.length) {
        const reference = globalC2[window.variable - 1];
        let xory2 = "x";
        if (xory === 'X') { xory2 = 'y'; }

        let inversed = inverse(reference[6][0], reference[6][1], reference[6][2]);

        if (xory2 === 'y' ^ reference[3].includes('neg')) {
            inversed[0] = inversed[2] - inversed[0];
            inversed[1] = -inversed[1];
        }

        inversed = normalize(inversed[0], inversed[1], inversed[2]);

        let value = (summup(inversed[0], inversed[1], inversed[2]));

        let additional;
        if (cIsPowTwoTest) {
            additional = 'The c values are of the form 2^n, so the creases lie along a 22.5° grid.';
        } else {
            additional = 'The c values are not of the form 2^n, so a reference sequence is necessary.';
        }

        // Update the file status text
        fileStatus.textContent = `${globalC2.length} references available. ${additional}
        Reference ${window.variable}: ${xory2} = (${inversed[0]} + ${inversed[1]}√2) / ${inversed[2]} ≈ ${value.toFixed(3)}.
        Approximate rank: ${reference[5]}.`;
    } else {
        fileStatus.textContent = "Upload a file to begin, or input a, b, and c corresponding to a reference having width (aₓ + bₓ√2) / cₓ and height (aᵧ + bᵧ√2) / cᵧ.";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.variable = 1; // Initialize variable on load
    updateDisplay(); // Initial display update

    // Event listeners for increase and decrease buttons
    document.getElementById('decreaseButton').addEventListener('click', () => {
        window.variable--;
        xorycommand = '';
        setWindowVariable(window.variable);
        updateDisplay();
        drawEverything();
    });

    document.getElementById('increaseButton').addEventListener('click', () => {
        window.variable++;
        xorycommand = '';
        setWindowVariable(window.variable);
        updateDisplay();
        drawEverything();
    });
});

// Function to update values based on user input
function updateValues() {
    window.variable = 1;
    const value1 = parseInt(document.getElementById("value1Modal").value);
    const value2 = parseFloat(document.getElementById("value2Modal").value);
    const constructibleCheckbox = document.getElementById("constructibleToggle");
    const isConstructible = constructibleCheckbox.checked; // true or false

    // Validate and set values
    if (Number.isInteger(value1) && value1 >= 1) {
        if (value1 > defaultValue1 && defaultValue1 >= 32) {
            defaultValue1 = value1;
            generateFarey();
            console.log("farey generated");
        } else defaultValue1 = value1;
    }
    if (!isNaN(value2)) defaultValue2 = value2;

    defaultConstructible = isConstructible;

    // Rerun file processing to recalculate C2
    const fileInput = document.getElementById("fileInput").files[0];
    if (fileInput) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            processFile(event);  // Call processFile with the file content
        };
        fileReader.readAsText(fileInput);
    } else if (inputAX.value !== 0 || inputBX.value !== 0 || inputAY.value !== 0 || inputBY.value !== 0) {
        abcRender();
    } else {
        alert("Please select a file before updating values.");
    };
}

document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('fileInput').addEventListener('change', resetOtherVars);

const value1Input =     document.getElementById("value1Modal");
const value2Input =     document.getElementById("value2Modal");
const constructible=    document.getElementById("constructibleToggle");

let defaultValue1 = 32;
let defaultValue2 = 0.1;
let defaultConstructible = true;

// Set default values to inputs
value1Input.value = defaultValue1;
value2Input.value = defaultValue2;
constructible.value = defaultConstructible;
constructible.checked = defaultConstructible;

// Add event listener to button
document.getElementById("saveSettingsButton").addEventListener("click", updateValues);
document.getElementById("saveSettingsButton").addEventListener("click", drawEverything);
document.getElementById("saveSettingsButton").addEventListener("click", updateDisplay);

// Function to resize the canvas
function resizeCanvas() {
    const canvas = document.getElementById('myCanvas');
    if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        paper.view.viewSize = new paper.Size(canvas.clientWidth, canvas.clientHeight);
    }
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
window.addEventListener('resize', () => {
    if (globalC2) {
        drawEverything();
    }
});

// Function to format the edges with coordinates and type
function formatEdges(V, EV, EA) {
    return EV.map(([a, b]) => {
        const [x1, y1] = V[a];
        const [x2, y2] = V[b];
        // Calculate the index in EA based on the edge
        const edgeIndex = EV.findIndex(edge => (edge[0] === a && edge[1] === b) || (edge[0] === b && edge[1] === a));
        const type = (edgeIndex >= 0 && EA[edgeIndex]) || 'unknown'; // Handle undefined cases
        return [x1, y1, x2, y2, type];
    });
}

let globalVi = [];
let globalEvi = [];
let globalEAi = [];
let globalC2 = [];

function drawEverything() {
    clearCanvas();

    // Get the canvas size
    const canvas = document.getElementById('myCanvas');
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const colorMap = {
        'B': 'black',
        'V': 'blue',
        'M': 'red',
        'A': 'cyan'
    };

    let drawFrom = formatEdges(globalVi, globalEvi, globalEAi);

    // Find the min and max x and y values
    const xs = drawFrom.map(([x1, y1, x2, y2]) => [x1, x2]).flat();
    const ys = drawFrom.map(([y1, y2]) => [y1, y2]).flat();
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Calculate width and height of the coordinates
    const width = maxX - minX;
    const height = maxY - minY;

    // Scale the pattern to fit the canvas size with some padding
    const scale = Math.min((canvasWidth / 2)/ width, canvasHeight * 0.8 / height) * 0.9;
    cPScale = scale;

    // Calculate offsets to center the pattern
    const offsetX = (canvasWidth/4) - (width/2)*scale;
    const offsetY = (canvasHeight/2) - (height/2)*scale;
    cPOffsetX = offsetX;
    cPOffSetY = offsetY;

    if (defaultConstructible) {
        drawFrom.push([0, 0, 1, 1, 'A'], [0, 1, 1, 0, 'A'],
            [0, 0, ro.x, ro.y, 'A'], [0, 0, to.x, to.y, 'A'], 
            [0, 1, bo.x, bo.y, 'A'], [0, 1, rt.x, rt.y, 'A'],
            [1, 1, lt.x, lt.y, 'A'], [1, 1, bt.x, bt.y, 'A'],
            [1, 0, lo.x, lo.y, 'A'], [1, 0, tt.x, tt.y, 'A']
        )
    }

    // Scale and translate coordinates
    drawFrom = drawFrom.map(([x1, y1, x2, y2, type]) => [
        (x1 * scale) + offsetX,
        (y1 * scale) + offsetY,
        (x2 * scale) + offsetX,
        (y2 * scale) + offsetY,
        type
    ]);

    drawFrom.sort((a, b) => {
        if (a[4] === 'A' || a[4] === undefined) {
            return -1; // Move 'A' or undefined to the beginning
        } else if (b[4] === 'A' || b[4] === undefined) {
            return 1;
        } else {
            return 0;
        }
    });

    drawFrom.forEach(([x1, y1, x2, y2, type]) => {
        const color = colorMap[type] || 'cyan';
        const line = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
        line.strokeColor = color;
        if (color === 'cyan') {
            //line.opacity = 0.5;
            line.strokeWidth = 0.5;
        }
    });

    if (globalC2.length > 0 && globalC2[window.variable-1][3].includes('default')) {
        draw(globalC2[window.variable-1][0],globalC2[window.variable-1][1],globalC2[window.variable-1][2],
            globalC2[window.variable-1][3],globalC2[window.variable-1][4],globalC2[window.variable-1][5],globalC2[window.variable-1][6])
    }
}

let cPScale, cPOffsetX, cPOffSetY;

function draw (a, b, c, name, meth, val, elev) {
    let sloped = sloper(elev[0], elev[1], elev[2], meth);

    let a1 = sloped[0][0], b1 = sloped[0][1], a2 = sloped[0][2], b2 = sloped[0][3];

    let w1 = sloped[1][0], w2 = sloped[1][1];
    let h1 = 1, h2 = 1;

    let typeA = (findRank(a1, b1)).type;
    let typeB = (findRank(a2, b2)).type;

    let aFinal = a, bFinal = b, cFinal = c;

    const elevationFinal = inverse(aFinal, bFinal, cFinal);
    const elevationFinalCoord = summup(elevationFinal[0], elevationFinal[1], elevationFinal[2])

    searchVi(globalVi, elevationFinalCoord, 10 ** -8, cPScale, cPOffsetX, cPOffSetY);

    let lineArr = [];

    globalC2.forEach(element => {
        let elementA = element[0], elementB = element[1], elementC = element[2];
        let searchValueABC = inverse(elementA, elementB, elementC);
        let searchValue = summup(searchValueABC[0], searchValueABC[1], searchValueABC[2]);

        for (let i = 0; i < globalVi.length; i++) {
            const [x, y] = globalVi[i];

            // Check for y value with tolerance
            if (Math.abs(y - searchValue) < tolerance) {
                lineArr.push([new paper.Point(cPOffsetX, (searchValue * cPScale) + cPOffSetY), 
                    new paper.Point(cPScale + cPOffsetX, (searchValue * cPScale) + cPOffSetY)])
            }

            // Check for x value with tolerance
            if (Math.abs(x - searchValue) < tolerance) {
                lineArr.push([new paper.Point((searchValue * cPScale) + cPOffsetX, cPOffSetY), 
                    new paper.Point((searchValue * cPScale) + cPOffsetX, cPScale + cPOffSetY)])
            }
        }
    })

    lineArr = uniq_fast(lineArr);

    console.log(lineArr);
    
    lineArr.forEach(element => {
        var magicLine = new paper.Path.Line(element[0], element[1]);
        magicLine.strokeColor = 'green';
        magicLine.strokeWidth = 2;
        magicLine.opacity = 0.1;
        magicLine.onMouseEnter = function(event) {magicLine.opacity = 1};
        magicLine.onMouseLeave = function(event) {magicLine.opacity = 0.1};
        let localxorycommand;

        let c2index;

        for (let i = 0; i < globalC2.length; i++) {
            let sum = summup(globalC2[i][0], globalC2[i][1], globalC2[i][2]);
            let goal = sum ** -1;
            //console.log(goal);

            const s = element[0];
            let reverseSearchVal;
            if ((s.x - cPOffsetX)/cPScale === 0 || (s.x - cPOffsetX)/cPScale === 1) {
                reverseSearchVal = (s.y - cPOffSetY)/cPScale;
                localxorycommand = 'X'
            } else {
                reverseSearchVal = (s.x - cPOffsetX)/cPScale;
                localxorycommand = 'Y'
            }
            //console.log(reverseSearchVal);
    
            if (tolerantSame(reverseSearchVal, goal)) {
                c2index = i;
                break;
            }
        }

        magicLine.onClick = function(event) {
            setWindowVariable(c2index + 1);
            xorycommand = localxorycommand;
            updateDisplay();
            drawEverything();
        };
    });
    
    rotate = 0;
    if (xory === 'Y') {rotate -= 90};
    if (name.includes('neg')) {rotate += 180};
    console.log(rotate);

    scrawler(a1, b1, w1, h1, typeA, a2, b2, w2, h2, typeB);
}

let xorycommand = '';

//pulled from a stackoverflow https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

function isPowerTwo(x) {
    return (Math.log(x) / Math.log(2)) % 1 === 0;
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return new paper.Point(x,y);
}

function isOne(w, h)                {return (Math.abs(w/h - 1) <                    10 ** -8)};
function isRtTwoPlusOne(w, h)       {return (Math.abs(w/h - (Math.SQRT2 + 1)) <     10 ** -8)};
function isRtTwoMinusOne(w, h)      {return (Math.abs(w/h - (Math.SQRT2 - 1)) <     10 ** -8)};
function isOnePlusHalfRtTwo(w,h)    {return (Math.abs(w/h - (1 + Math.SQRT2/2)) <   10 ** -8)};
function isTwoMinusRtTwo(w,h)       {return (Math.abs(w/h - (2 - Math.SQRT2)) <     10 ** -8)};

let elevX = null;
let elevY = null;
let circles = [];

let xory = '';

function searchVi(vi, searchValue, tolerance, scale, offsetX, offsetY) {
    let found = false;

    // Clear previous lines if they exist
    if (elevX) {
        elevX.remove();
        elevX = null;
    }

    if (elevY) {
        elevY.remove();
        elevY = null;
    }

    // Clear previous circles
    for (let circle of circles) {
        circle.remove();
    }
    circles = []; // Clear the circles array

    let foundXval = [];
    let foundYval = [];
    let foundValues = [];

    // Scaling functions (ensure scale, offsetX, and offsetY are defined)
    function scaleX(x) {
        return (x * scale) + offsetX;
    }

    function scaleY(y) {
        return (y * scale) + offsetY;
    }

    // Search through vi array
    for (let i = 0; i < vi.length; i++) {
        const [x, y] = vi[i];

        // Check for y value with tolerance
        if (Math.abs(y - searchValue) < tolerance) {
            foundYval.push(vi[i]);
            found = true;
        }

        // Check for x value with tolerance
        if (Math.abs(x - searchValue) < tolerance) {
            foundXval.push(vi[i]);
            found = true;
        }
    }

    // Decide which line to draw based on counts
    if ((foundYval.length >= foundXval.length && !xorycommand) || xorycommand === 'X') {
        foundValues = foundYval;
        elevY = new paper.Path.Line(
            new paper.Point(scaleX(0), scaleY(searchValue)),
            new paper.Point(scaleX(1), scaleY(searchValue))
        );
        elevY.strokeColor = '#00ff00';
        elevY.strokeWidth = 2;
        elevY.shadowColor = 'black';
        elevY.shadowBlur = 5;
        xory = 'X';
    } else if ((foundXval.length > foundYval.length && !xorycommand) || xorycommand === 'Y') {
        foundValues = foundXval;
        elevX = new paper.Path.Line(
            new paper.Point(scaleX(searchValue), scaleY(0)),
            new paper.Point(scaleX(searchValue), scaleY(1))
        );
        elevX.strokeColor = '#00ff00';
        elevX.strokeWidth = 2;
        elevX.shadowColor = 'black';
        elevX.shadowBlur = 5;
        xory = 'Y';
    }

    // Draw new circles at found values
    for (let i = 0; i < foundValues.length; i++) {
        let circle = new paper.Path.Circle({
            center: [scaleX(foundValues[i][0]), scaleY(foundValues[i][1])],
            radius: 3,
            fillColor: '#00ff00',
            strokeColor: 'green'
        });

        if (test(foundValues[i][0], foundValues[i][1]) && defaultConstructible) {
            circle.fillColor = 'cyan';
            circle.strokeColor = 'blue'
        }

        circles.push(circle); // Add circle to the list
    }

    if (!found) {
        console.log(`${searchValue} not found within tolerance ${tolerance} in Vi.`);
    }
};

function clearCanvas() {
    if (paper.project) {
        paper.project.activeLayer.removeChildren();
    }
}

// Function to handle file input and extract coordinates
function processFile(event) {
    NOTE.clear_log();
    NOTE.start("*** Starting File Import ***");
    const doc = event.target.result;
    const file_name = document.getElementById("fileInput").value;
    const parts = file_name.split(".");
    const type = parts[parts.length - 1].toLowerCase();
    NOTE.time(`Importing from file ${file_name}`);
    
    const [V_org, VV, EVi, EAi, EF, FV, FE] = IO.doc_type_side_2_V_VV_EV_EA_EF_FV_FE(doc, type, true);
    const Vi = M.normalize_points(V_org);
    globalVi = Vi;
    globalEvi = EVi;
    globalEAi = EAi;

    const EPS = 10**(-8);
    
    const [C, VC] = V_2_C_VC(Vi, EPS);
    
    const target = { C, VC, EV: EVi, EA: EAi, FV };

    processC2(C, EPS).then(C2 => {
        globalC2 = C2;
        target.C2 = C2;
        update(target, EPS);
    }).catch(error => {
        console.error('Failed to process C2:', error);
        NOTE.time(`Failed to process C2: ${error.message}`);
    });

    drawEverything();
}

// Function to convert vertices to radical form
function V_2_C_VC(V, eps) {
    const Ci = [];
    for (let i = 0; i < V.length; ++i) {
        for (const j of [0, 1]) {
            Ci.push([V[i][j], i, j]);
        }
    }
    Ci.sort(([a, ai, aj], [b, bi, bj]) => a - b);
    let C = [];
    const VC = V.map(() => [undefined, undefined]);
    C.push(Ci[0][0]);
    VC[Ci[0][1]][Ci[0][2]] = 0;
    for (let i = 1; i < Ci.length; ++i) {
        const [c1, i1, j1] = Ci[i - 1];
        const [c2, i2, j2] = Ci[i];
        if (c2 - c1 > eps) {
            C.push(c2);
        }
        VC[i2][j2] = C.length - 1;
    }

    if (defaultConstructible) {
        function laysOnGrid(element) {
            const index = C.indexOf(element);
            let trutherBucket = [];
            for (let i = 0; i < VC.length; i++) {
                const [s, f] = VC[i];

                const sElement = C[s];
                const fElement = C[f];

                if (Math.abs(sElement - element) < 10 ** -8) {
                    trutherBucket.push(test(element, fElement))
                } else if (Math.abs(fElement - element) < 10 ** -8) {
                    trutherBucket.push(test(sElement, element))
                }
            }
            return trutherBucket.includes(true);
        }

        C = C.filter(laysOnGrid);
    }

    return [C, VC];
}

function test (x,y) {
    return (isOne(x, y) || isOne(x, 1-y) || 
    (Math.abs(x) < 10 ** -8) || (Math.abs(x - 1) < 10 ** -8) || 
    (Math.abs(y) < 10 ** -8) || (Math.abs(y - 1) < 10 ** -8) ||
    isRtTwoPlusOne(x, y) || isRtTwoMinusOne(x, y) || 
    isRtTwoPlusOne(1-x, y) || isRtTwoMinusOne(1-x, y) || 
    isRtTwoPlusOne(x, 1-y) || isRtTwoMinusOne(x, 1-y) || 
    isRtTwoPlusOne(1-x, 1-y) || isRtTwoMinusOne(1-x, 1-y))
} 

// Function to update the display or data structure
function update(target, eps) {
    const { C, VC, EV, EA, FV, C2 } = target;
}

let cIsPowTwoTest = true;

// Function to process C2 with a Promise
function processC2(C, eps) {
    return new Promise((resolve, reject) => {
        try {
            let C2 = checkPi8(C, eps);

            function isComplete(element) {
                return element !== undefined}
            
            C2 = C2.filter(isComplete);
            
            C2.forEach(([a, b, c, d], index) => {
                const [alpha, beta, gamma] = toABC(a, b, c, d);
                C2[index] = [alpha, beta, gamma]
            });

            function constructible(element) {
                const gamma = element[2];
                return ((Math.log(gamma)/Math.log(2)) % 1 !== 0);
            }

            const C2con = C2.filter(constructible);

            if (C2con.length > C2.length/2){
                C2 = C2con;
                cIsPowTwoTest = false;
            }

            C2.forEach(([a, b, c], index) => {
                const [alpha, beta, gamma] = inverse(a, b, c);
                C2[index] = [alpha, beta, gamma];
            })

            C2.forEach(([a, b, c], index) => {
                const [alpha, beta, gamma] = normalize(a, b, c);
                C2[index] = [alpha, beta, gamma];
            })

            function updateC2(C2) {
                return C2.map(([a, b, c]) => {
                    const minType = alts(a, b, c);
                    return [a, b, c, minType.name, minType.meth, minType.value, minType.elev];
                });
            }

            C2 = updateC2(C2);

            C2 = C2.filter(item => 
                item[5] !== undefined && item[6] !== null &&
                !(
                    (item[0] === 1 && item[1] === 0 && item[2] === 1) || 
                    (item[0] === 1 && item[1] === -0 && item[2] === 1)
                )
            );

            function isReasonable (element) {
                return ((summup (element[0], element[1], element[2]) < (defaultValue2 ** -1)) && (summup (element[0], element[1], element[2]) > ((1 - defaultValue2) ** -1)))
            }

            C2 = C2.filter(isReasonable);

            C2.sort((a, b) => {
                if (a === undefined || b === undefined) return Infinity; // Handle undefined values
                return (a[5] || 0) - (b[5] || 0); // Compare minType.value (index 5)
            });

            globalC2 = C2

            console.log(C2);
            resolve(C2);
        } catch (error) {
            reject(error);
        }
    });
}

//below is the maths stuff, which for now is working FINE don't mess with it.  The ranking equations will need to be updated.
function summup(a,b,c) {
    return ((a + (b * Math.SQRT2)) / c)
}

function normalize(a,b,c) {
    let grcodi = gcd(gcd(a, b), c);
    if (summup(a,b,c) < 0 || ((a + (b * Math.SQRT2) < 0) && (c < 0))) {
        a = -a;
        b = -b;
        c = -c;
    };
    return [a/grcodi, b/grcodi, c/grcodi];
}

function inverse(a, b, c) {
    let alpha = a * c;
    let beta = -b * c;
    let gamma = (a ** 2) - (2 * (b ** 2));

    return [alpha, beta, gamma]
}

function gcd(a, b) {
    if (b) {
        return gcd(b, a % b);
    } else {
        return Math.abs(a);
    }
}

function toABC(a, b, c, d) {
    let alpha, beta, gamma;
    if (c**2 - 2 * d**2 >= 0) {
        alpha = a * c - 2 * b * d;
        beta = b * c - a * d;
        gamma = c**2 - 2 * d**2;
    } else {
        alpha = -a * c + 2 * b * d;
        beta = -b * c + a * d;
        gamma = 2 * d**2 - c**2;
    }
    let grcodi = gcd(gamma,gcd(alpha,beta));
    return [alpha/grcodi, beta/grcodi, gamma/grcodi];
}

// Function to check if coordinates are at pi/8 and return corresponding radical forms
const checkPi8 = (C, eps) => {
    const r2 = Math.sqrt(2);
    const val = ([a, b]) => a + r2 * b;
    const T = new AVL((a, b) => Math.abs(a - b) < eps ? 0 : a - b);
    const M = new Map();
    T.insert(0);
    T.insert(1);
    M.set(0, [0, 0, 1, 0]);
    M.set(1, [1, 0, 1, 0]);

    for (let n = 0; n < 50; ++n) {
        for (let i = 0; i <= n; ++i) {
            for (let j = 0; j <= n - i; ++j) {
                for (const [a, b] of [[j, i], [-j, i], [j, -i]]) {
                    const num = val([a, b]);
                    if (num < 0) continue;
                    for (let k = 0; k <= n - i - j; ++k) {
                        const l = n - i - j - k;
                        for (const [c, d] of [[l, k], [-l, k], [l, -k]]) {
                            const den = val([c, d]);
                            if (den <= 0) continue;
                            const v = num / den;
                            if (v > 1) continue;
                            const u = T.insert(v);
                            if (u === undefined) {
                                M.set(v, [a, b, c, d]);
                            }
                        }
                    }
                }
            }
        }
    }

    return C.map(v => {
        const u = T.insert(v);
        return u === undefined ? undefined : M.get(u);
    });
};

//----------------------------------------------------------------------------------------

// PART ONE: Generates the farey sequence of all fractions having a denominator less than or equal to n.
// Each fraction corresponds to a slope.  The lookup table records the number of creases required
// to develop that slope, and the methodology used to do so.

let lookupTable = [];

//most extreme fraction
const m = (1/defaultValue2);

// if b is a power of 2, the reference may be developed in log2(b)+1 folds
function powTwo(b) {if (isPowerTwo(b)) {return Math.log2(b) + 1} else {return Infinity}};

function diagA(a,b) {if (isPowerTwo(a+b))           {return Math.log2(a+b) + 2} else {return Infinity}};

function diagB(a,b) {if (isPowerTwo(a + 2*b))       {return Math.log2(a + 2*b) + 3} else {return Infinity}};

function diagC(a,b) {if (isPowerTwo(2*a + b))       {return Math.log2(2*a + b) + 3} else {return Infinity}};

function diagD (a,b) {if (isPowerTwo(a + 4*b))      {return Math.log2(a + 4*b) + 4} else {return Infinity}};

function diagE (a,b) {if (isPowerTwo(4*a + b))      {return Math.log2(4*a + b) + 4} else {return Infinity}};

function diagF (a,b) {if (isPowerTwo(3*a + 4*b))    {return Math.log2(3*a + 4*b) + 4} else {return Infinity}};
    
function diagG (a,b) {if (isPowerTwo(4*a + 3*b))    {return Math.log2(4*a + 3*b) + 4} else {return Infinity}};

function general(a,b) {if (!isPowerTwo(b)) {
        let c = Math.ceil(Math.log2(b));
        return Math.log2((2 ** c) / (gcd((2 ** c), a))) + Math.log2((2 ** c) / (gcd((2 ** c), b))) + 1;
    } else {
        return Infinity;
    }
}

function type (a,b) {
    let min = Math.min(powTwo(b), diagA(a,b), diagB(a,b), diagC(a,b), diagD(a,b), diagE(a,b), diagF(a,b), diagG(a,b), general(a,b));
    if (powTwo(b)===min){
        return "powTwo";
    } else if (diagA(a,b)===min){
        return "diagA";
    } else if (diagB(a,b)===min){
        return "diagB";
    } else if (diagC(a,b)===min){
        return "diagC";
    } else if (diagD(a,b)===min){
        return "diagD";
    } else if (diagE(a,b)===min){
        return "diagE";
    } else if (diagF(a,b)===min){
        return "diagF";
    } else if (diagG(a,b)===min){
        return "diagG";
    } else if (general(a,b)===min){
        return "general";
    } else return error
}

function generateFarey () {
    lookupTable = [];
    // Generate the Farey sequence
    for (let b = 1; b <= defaultValue1; b++) {
        for (let a = 0; a <= b; a++) {
            if (gcd(a, b) === 1) {  // Check if gcd(a, b) == 1 (i.e., they are coprime)
                lookupTable.push({ 
                    numerator: a, 
                    denominator: b, 
                    weight: a/b, 
                    rank: Math.min(powTwo(b), diagA(a,b), diagB(a,b), diagC(a,b), diagD(a,b), diagE(a,b), diagF(a,b), diagG(a,b), general(a,b)),
                    type: type(a,b),
                },
            );
            }
        }
    }
}

generateFarey();

// Sort the fractions by their value (numerator/denominator)
lookupTable.sort((frac1, frac2) => (frac1.numerator / frac1.denominator) - (frac2.numerator / frac2.denominator));

// Function to search for a specific numerator and denominator
function findRank(numerator, denominator) {
    // Check if the fraction is greater than one
    if (numerator > denominator) {
        // Swap numerator and denominator for fractions greater than 1
        [numerator, denominator] = [denominator, numerator];
    }
    if (numerator/denominator < 0 || (numerator < 0 && denominator < 0)) {
        [numerator, denominator] = [-numerator, -denominator]
    }

    let gcdND = gcd(numerator, denominator);
    numerator /= gcdND;
    denominator /= gcdND;

    let result = lookupTable.find(row => row.numerator === numerator && row.denominator === denominator);

    if (numerator === 0 && denominator === 0) {result.rank = Infinity}
    else if (numerator === 0 || denominator === 0) {result.rank = 0}
    else if (numerator/denominator === 1) {result.rank = 1}
    else if (denominator/numerator > m || numerator/denominator > m) {result.rank = Infinity};

    if (result) {return result}
    else {
        console.log(numerator+"/"+denominator)
        console.log(result);
        return null;
    }
}

// Function you can call later to search after data is loaded
function searchForFraction(numerator, denominator) {
    if (denominator <= defaultValue1 && numerator <= defaultValue1) {
        return (findRank(numerator/gcd(numerator,denominator), denominator/gcd(numerator,denominator))).rank;
    } else {
        return Infinity;
    }
}

//---------------------------------------------------------------------------------------------------------
// PART TWO: A rectangle having w/h = (a + b(rt2)) / c can be decomposed into a pair of slopes in ten possible ways.
// This section calculates the number of creases required for each situation, and reports the most efficient option,
// and the corresponding number of creases.

function rankIt(alphadef, betadef, gammadef, type, callSpot) {
    let alpha, beta, gamma;

    if (type === 'default') {
        [alpha, beta, gamma] = [alphadef, betadef, gammadef];
    } else if (type === 'negdefault') {
        [alpha, beta, gamma] = normalize(( (alphadef * (alphadef - gammadef)) - 2 * betadef ** 2), (-betadef * gammadef), ((alphadef - gammadef) ** 2 - 2 * betadef ** 2))
    } else console.error("unknown type");

    [alpha, beta, gamma] = normalize(alpha, beta, gamma);

    let inputC2 = [];

    let rankA = Infinity, rankB = Infinity, rankC = Infinity, rankD = Infinity;
    let rankE = Infinity, rankF = Infinity, rankG = Infinity, rankH = Infinity;
    let rankI = Infinity, rankJ = Infinity;

    // Perform the checks and calculations
    if (beta >= 0 && alpha + beta >= 0) {
        const rank1 = searchForFraction(beta, gamma);
        const rank2 = searchForFraction(alpha + beta, gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankA = rank1 + rank2;
            if (rank1 !== 0) {
                rankA += 3;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'A', rankA, [alpha, beta, gamma]])
    } 
    if (beta <= 0 && alpha + 2 * beta >= 0) {
        const rank1 = searchForFraction(-beta, gamma);
        const rank2 = searchForFraction(alpha + 2 * beta, gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankB = rank1 + rank2;
            if (rank1 !== 0) {
                rankB += 3;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'B', rankB, [alpha, beta, gamma]])
    }
    if (beta >= 0 && alpha - 2 * beta >= 0) {
        const rank1 = searchForFraction(2 * beta, gamma);
        const rank2 = searchForFraction(alpha - 2 * beta, gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankC = rank1 + rank2;
            if (rank1 !== 0) {
                rankC += 3;
            }
        } 
        inputC2.push([alphadef, betadef, gammadef, type, 'C', rankC, [alpha, beta, gamma]])
    }
    if (beta >= 0 && alpha - beta >= 0) {
        const rank1 = searchForFraction(beta, gamma);
        const rank2 = searchForFraction(alpha - beta, gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankD = rank1 + rank2;
            if (rank1 !== 0) {
                rankD += 3;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'D', rankD, [alpha, beta, gamma]])
    }
    if (alpha + beta >= 0 && alpha + 2 * beta >= 0) {
        const rank1 = searchForFraction(alpha + beta, gamma);
        const rank2 = searchForFraction(alpha + 2 * beta, gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankE = rank1 + rank2 + 3;
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'E', rankE, [alpha, beta, gamma]])
    }
    if (alpha + beta >= 0 && -alpha + 2 * beta >= 0) {
        const rank1 = searchForFraction(2 * alpha + 2 * beta, 3 * gamma);
        const rank2 = searchForFraction(-alpha + 2 * beta, 3 * gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankF = rank1 + rank2 + 3;
            if (rank1 !== 0 && rank2 !== 0) {
                rankF += 1;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'F', rankF, [alpha, beta, gamma]])
    }
    if (alpha + beta >= 0 && -alpha + beta >= 0) {
        const rank1 = searchForFraction(alpha + beta, 2 * gamma);
        const rank2 = searchForFraction(-alpha + beta, 2 * gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankG = rank1 + rank2 + 3;
            if (rank1 !== 0 && rank2 !== 0) {
                rankG += 1;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'G', rankG, [alpha, beta, gamma]])
    }
    if (alpha + 2 * beta >= 0 && alpha - 2 * beta >= 0) {
        const rank1 = searchForFraction(alpha + 2 * beta, 2 * gamma);
        const rank2 = searchForFraction(alpha - 2 * beta, 4 * gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankH = rank1 + rank2 + 3;
            if (rank1 !== 0 && rank2 !== 0) {
                rankH += 1;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'H', rankH, [alpha, beta, gamma]])
    }
    if (alpha + 2 * beta >= 0 && alpha - beta >= 0) {
        const rank1 = searchForFraction(alpha + 2 * beta, 3 * gamma);
        const rank2 = searchForFraction(alpha - beta, 3 * gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankI = rank1 + rank2 + 3;
            if (rank1 !== 0 && rank2 !== 0) {
                rankI += 1;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'I', rankI, [alpha, beta, gamma]])
    }
    if (-alpha + 2 * beta >= 0 && alpha - beta >= 0) {
        const rank1 = searchForFraction(-alpha + 2 * beta, gamma);
        const rank2 = searchForFraction(2 * alpha - 2 * beta, gamma);
        if (rank1 !== undefined && rank2 !== undefined) {
            rankJ = rank1 + rank2 + 3;
            if (rank1 !== 0 && rank2 !== 0) {
                rankJ += 2;
            }
        }
        inputC2.push([alphadef, betadef, gammadef, type, 'J', rankJ, [alpha, beta, gamma]])
    }

    const types = [
        { name: "A", value: rankA },
        { name: "B", value: rankB },
        { name: "C", value: rankC },
        { name: "D", value: rankD },
        { name: "E", value: rankE },
        { name: "F", value: rankF },
        { name: "G", value: rankG },
        { name: "H", value: rankH },
        { name: "I", value: rankI },
        { name: "J", value: rankJ }
    ];
    
    // Check if all ranks are Infinity
    const allInfinity = types.every(type => type.value === Infinity);
    
    if (allInfinity) {
        return ["N/A", Infinity];
    }
    
    // Find the object with the minimum value
    const minType = types.reduce((min, current) => current.value < min.value ? current : min, types[0]);
    
    // Return the type corresponding to the minimum value
    if (callSpot === 'regular') {
        return [minType.name, minType.value];
    } else if (callSpot === 'abcRender') {
        return inputC2;
    }
}

//---------------------------------------------------------------------------------------------------------------

function findBisector(a,b,c) {
    if ((summup(a,b,c) >= Math.SQRT2 + 1)) {
    //CORRECT
        let bisoA =  (2 * a * c * ((a ** 2) - (2 * (b ** 2))) * ((a ** 2) - (2 * (b ** 2)) - (c ** 2)));
        let bisoB = (-2 * b * c * ((a ** 2) - (2 * (b ** 2))) * ((a ** 2) - (2 * (b ** 2)) + (c ** 2)));
        let bisoC = ((a ** 2) * (((a ** 2) - (2 * (b ** 2)) - (c ** 2)) ** 2) - (2 * (b ** 2) * (((a ** 2) - (2 * (b ** 2)) + (c ** 2)) ** 2)));

        let bisA = bisoA * bisoC;
        let bisB = -bisoB * bisoC;
        let bisC = (bisoA**2) - (2 * (bisoB ** 2))

        if ((summup(bisA, bisB, bisC) < 0) || (bisA + (bisB * Math.SQRT2) < 0 && bisC < 0)) {
            bisA = -bisA;
            bisB = -bisB;
            bisC = -bisC;
        } 

        let bisG = gcd((gcd(bisA, bisB)), bisC);
        return [bisA/bisG, bisB/bisG, bisC/bisG];

    } else if ((summup(a,b,c) <= Math.SQRT2 + 1 && (summup(a,b,c) >= 1))) {
    //CORRECT
        let bisA =  (2 * a * c * ((a ** 2) - (2 * (b ** 2))) * ((a ** 2) - (2 * (b ** 2)) - (c ** 2)));
        let bisB = (-2 * b * c * ((a ** 2) - (2 * (b ** 2))) * ((a ** 2) - (2 * (b ** 2)) + (c ** 2)));
        let bisC = ((a ** 2) * (((a ** 2) - (2 * (b ** 2)) - (c ** 2)) ** 2) - (2 * (b ** 2) * (((a ** 2) - (2 * (b ** 2)) + (c ** 2)) ** 2)));

        if ((summup(bisA, bisB, bisC) < 0) || (bisA + (bisB * Math.SQRT2) < 0 && bisC < 0)) {
            bisA = -bisA;
            bisB = -bisB;
            bisC = -bisC;
        } 

        let bisG = gcd((gcd(bisA, bisB)), bisC);
        return [bisA/bisG, bisB/bisG, bisC/bisG];
            
    } else {
        return [Infinity, Infinity, Infinity]
    }
}

function findSwitchIt(a,b,c) {
    //CORRECT
    if (summup(a,b,c) > 1) {

        let swiA = (((a-c)*(a+c))-(2*(b**2)));
        let swiB = ((-2)*b*c);
        let swiC = (((a-c)**2)-(2*(b**2)));

        if ((summup(swiA, swiB, swiC) < 0) || (swiA + (swiB * Math.SQRT2) < 0 && swiC < 0)) {
            swiA = -swiA;
            swiB = -swiB;
            swiC = -swiC;
        } 

        let swiG = gcd((gcd(swiA, swiB)), swiC);
        return [swiA/swiG, swiB/swiG, swiC/swiG];

    } else {
        return [Infinity, Infinity, Infinity]
    }
}

function findHSA(a,b,c) {
    //CORRECT
    if (summup(a,b,c) >= 1) {
    
    let hsaA = a * ((a ** 2) - (2 * (b ** 2)) + (c ** 2));
    let hsaB = -b * (-(a ** 2) + (2 * (b ** 2)) + (c ** 2));
    let hsaC = 2 * c * ((a ** 2) - (2 * (b ** 2)));

    if ((summup(hsaA, hsaB, hsaC) < 0) || (hsaA + (hsaB * Math.SQRT2) < 0 && hsaC < 0)) {
        hsaA = -hsaA;
        hsaB = -hsaB;
        hsaC = -hsaC;
    } 

    let hsaG = gcd((gcd(hsaA, hsaB)), hsaC);
    return [hsaA/hsaG, hsaB/hsaG, hsaC/hsaG]
    } else {
        return [Infinity, Infinity, Infinity]
    }
}

function findHSB(a,b,c) {
    //CORRECT!
    if (summup(a,b,c) >= 1) {
    
    let hsBA = (a ** 4) + (4 * (b ** 4)) - (c ** 4) - (4 * (a ** 2) * (b ** 2));
    let hsBB = -4 * a * b * (c ** 2);
    let hsBC = (a ** 4) + (4 * (b ** 4)) + (c ** 4) - (2 * (a ** 2) * (c ** 2)) - (4 * (a ** 2) * (b ** 2)) - (4 * (b ** 2) * (c ** 2));

    if ((summup(hsBA, hsBB, hsBC) < 0) || (hsBA + (hsBB * Math.SQRT2) < 0 && hsBC < 0)) {
        hsBA = -hsBA;
        hsBB = -hsBB;
        hsBC = -hsBC;
    } 

    let hsBG = gcd((gcd(hsBA, hsBB)), hsBC);
    return [hsBA/hsBG, hsBB/hsBG, hsBC/hsBG]
    } else {
        return [Infinity, Infinity, Infinity]
    }
}

function alts(a, b, c) {
    function neg(a, b, c) {
        const alpha = (a ** 2) - (a * c) - (2 * (b ** 2));
        const beta = -b * c;
        const gamma = ((a - c) ** 2) - (2 * (b ** 2));

        const grcodi = gcd(gcd(alpha, beta), gamma);

        if ((summup(alpha, beta, gamma) < 0) || (alpha + (beta * Math.SQRT2) < 0 && gamma < 0)) {
            return [-alpha / grcodi, -beta / grcodi, -gamma / grcodi];
        }

        return [alpha / grcodi, beta / grcodi, gamma / grcodi];
    }

    function createRankType(name, values, rankIncrement = 0) {
        const rank = rankIt(values[0], values[1], values[2], name, 'regular');
        const negValues = neg(values[0], values[1], values[2]);
        const rankNeg = rankIt(negValues[0], negValues[1], negValues[2], "neg"+name, 'regular');
        
        return [
            { name: name, meth: rank[0], value: rank[1] + rankIncrement, elev: values },
            { name: `neg${name}`, meth: rankNeg[0], value: rankNeg[1] + rankIncrement, elev: negValues }
        ];
    }

    // Default and negdefault
    const defaultType = createRankType('default', [a, b, c]);

    //// Double and negdouble (only calculate if summup > 2)
    //const doubleType = summup(a, b, c) > 2 ? createRankType('double', [a, b, 2 * c], 1) : [{ name: 'double', meth: 'N/A', value: Infinity }, { name: 'negdouble', meth: 'N/A', value: Infinity }];
//
    //// Quadruple and negquadruple (only calculate if summup > 4)
    //const quadrupleType = summup(a, b, c) > 4 ? createRankType('quadruple', [a, b, 4 * c], 2) : [{ name: 'quadruple', meth: 'N/A', value: Infinity }, { name: 'negquadruple', meth: 'N/A', value: Infinity }];
//
    //// Bisector and negbisector
    //const bisectorValues = findBisector(a, b, c);
    //const bisectorType = createRankType('bisector', bisectorValues, 2);
//
    //// SwitchIt and negSwitchIt
    //const switchItValues = findSwitchIt(a, b, c);
    //const switchItType = createRankType('switchIt', switchItValues, 2);
//
    //// HSA and negHSA
    //const hsaValues = findHSA(a, b, c);
    //const hsaType = createRankType('HSA', hsaValues, 2);
//
    //// HSB and negHSB
    //const hsbValues = findHSB(a, b, c);
    //const hsbType = createRankType('HSB', hsbValues, 2)

    // Combine all rank types into one array
    const types = [
        ...defaultType,
        //...doubleType,
        //...quadrupleType,
        //...bisectorType,
        //...switchItType,
        //...hsaType,
        //...hsbType
    ];

    // Check if all ranks are Infinity
    const allInfinity = types.every(type => type.value === Infinity);
    if (allInfinity) {
        return ["N/A", Infinity];
    }

    // Find the object with the minimum value
    const minType = types.reduce((min, current) => current.value < min.value ? current : min, types[0]);

    // Return the type corresponding to the minimum value
    return {
         name: minType.name, 
         meth: minType.meth, 
         value: minType.value, 
         elev: minType.elev
    };
}

//----------------------------------------------------------------------------------------------------------------

var bl = new paper.Point(0,            0);
var tl = new paper.Point(0,            1);
var tr = new paper.Point(1,            1);
var br = new paper.Point(1,            0);
var bo = new paper.Point(Math.SQRT2-1, 0);
var bt = new paper.Point(2-Math.SQRT2, 0);
var lo = new paper.Point(0,            Math.SQRT2-1);
var lt = new paper.Point(0,            2-Math.SQRT2);
var ro = new paper.Point(1,            Math.SQRT2-1);
var rt = new paper.Point(1,            2-Math.SQRT2);
var to = new paper.Point(Math.SQRT2-1, 1);
var tt = new paper.Point(2-Math.SQRT2, 1);

let rotation1 = [bo, bt, br, ro, rt, tr, tt, to, tl, lt, lo, bl];

let flip1 = [bt, br, ro, rt, tr, tt, bo, bl, lo, lt, tl, to];

function findTransformation (point) {
    let transArr = [];

    console.log(point);
 
    if (!tolerantSame(point[1], 0)) {

        point[0] -= 0.5, point[1] -= 0.5;

        do {
            [point[0], point[1]] = [-point[1], point[0]];
            transArr.push("rotCC90");
        } while (point[1] !== -0.5)

        point[0] += 0.5, point[1] += 0.5    
    }

    if (!tolerantSame(point[0], bo.x)) {
        transArr.push("flipX")
    }

    console.log(transArr);
    return transArr;
}

function distance (point1, point2) {
    let x1 = point1[0];
    let y1 = point1[1];
    let x2 = point2[0];
    let y2 = point2[1];
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function doTransform (point, transArr) {
    //console.log("original point: " + point);
    for (let i = 0; i < transArr.length; i++) {
        if (transArr[i] === 'rotCC90') {
            point[0] -= 0.5, point[1] -= 0.5;
            [point[0], point[1]] = [-point[1], point[0]];
            point[0] += 0.5, point[1] += 0.5;
            //console.log(point);
        } else if (transArr[i] === 'flipX') {
            [point[0], point[1]] = [1-point[0], point[1]];
            //console.log(point);
        }
    }
    //console.log("messed up point: " + point);
    return point;
}

function undoTransform (point, transArr) {
    //console.log("original point: " + point);
    for (let i = transArr.length; i >= 0; i--) {
        if (transArr[i] === 'flipX') {
            [point[0], point[1]] = [1-point[0], point[1]];
            //console.log(point);
        } else if (transArr[i] === 'rotCC90') {
            point[0] -= 0.5, point[1] -= 0.5;
            [point[0], point[1]] = [point[1], -point[0]];
            point[0] += 0.5, point[1] += 0.5;
            //console.log(point);
        }
    }
    //console.log("messed up point: " + point);
    return point;
}

function point (point1) {
    let transArr = findTransformation(point1);
    console.log(transArr);

    let creaseArr = [[tl, br], [tl, bo]];
    let rotatedFlippedCreaseArr = []

    for (let i = 0; i < creaseArr.length; i++) {
        let start = undoTransform([creaseArr[i][0].x, creaseArr[i][0].y], transArr);
        let finish = undoTransform([creaseArr[i][1].x, creaseArr[i][1].y], transArr);
        rotatedFlippedCreaseArr.push([start, finish]);
    }
    
    console.log(rotatedFlippedCreaseArr)

    return rotatedFlippedCreaseArr;
}

function pointPoint (point1, point2) {

    console.log("point1: " + point1);
    console.log("point2: " + point2);

    let transArr = findTransformation(point1);
    console.log(transArr);

    console.log(point2);

    let point2new = doTransform(point2, transArr);
    console.log(point2new);
    
    for (let i = 0; i < rotation1.length; i ++) {
        if (tolerantSame(point2new[0], rotation1[i].x) && tolerantSame(point2new[1], rotation1[i].y)) {
            point2new = rotation1[i];
            break;
        }
    }

    let creaseArr = [[tl, br], [tl, bo]];

    switch(point2new) {
        case bo:
            break;
        case bt:
            creaseArr.push ([bl, tr], [tr, bt]);
            break;
        case ro:
            creaseArr.push ([bl, ro]);
            // perp symbol
            break;
        case rt:
            creaseArr.push ([tl, rt]);
            break;
        case tt:
            creaseArr.push ([br, tt]);
            break;
        case to:
            creaseArr.push ([to, bo]);
            break;
        case lt:
            creaseArr.push ([lt, tr]);
            //perp symbol
            break;
        case lo:
            creaseArr.push ([lo, br]);
            break;   
    }
    
    console.log(creaseArr);

    let rotatedFlippedCreaseArr = []

    for (let i = 0; i < creaseArr.length; i++) {
        let start = undoTransform([creaseArr[i][0].x, creaseArr[i][0].y], transArr);
        let finish = undoTransform([creaseArr[i][1].x, creaseArr[i][1].y], transArr);
        rotatedFlippedCreaseArr.push([start, finish]);
    }
    
    console.log(rotatedFlippedCreaseArr);

    return rotatedFlippedCreaseArr;
}

function pointLine (point1, point2, point3) {
    let point, lineS, lineF;

    if (lineTest(point1, point2)) {
        point = point3;
        lineS = point1;
        lineF = point2;
    } else if (lineTest(point2, point3)) {
        point = point1;
        lineS = point2;
        lineF = point3;
    } else if (lineTest(point1, point3)) {
        point = point2;
        lineS = point1;
        lineF = point3;
    } else {
        console.error("It's not pointLine");
    }

    let transArr = findTransformation(point);
    console.log(transArr);

    let lineS2 = doTransform(lineS, transArr);
    
    console.log(lineS2);
    
    let lineF2 = doTransform(lineF, transArr);
    
    console.log(lineF2);

    let creaseArr = [[tl, br], [tl, bo]];

    if (tolerantSame(lineS2[0], lineF2[0])) {
        console.log('A');
        if (tolerantSame(lineS2[0], bo.x)) {
            console.log('B');
            creaseArr.push([bo, to]);
        } else if (tolerantSame(lineS2[0], bt.x)) {
            console.log('C');
            creaseArr.push([bt, tt], [tt, br]);
        }
    } else if (tolerantSame(lineS2[1], lineF2[1])) {
        console.log('D');
        if (tolerantSame(lineS2[1], lo.y)) {
            console.log('E');
            creaseArr.push([lo, ro], [lo, br]);
        } else if (tolerantSame(lineS2[1], lt.y)) {
            console.log('F');
            creaseArr.push([bo, to], [lt, rt]);
        }
    }
    
    console.log(creaseArr);

    let rotatedFlippedCreaseArr = [];

    for (let i = 0; i < creaseArr.length; i++) {
        let start = undoTransform([creaseArr[i][0].x, creaseArr[i][0].y], transArr);
        let finish = undoTransform([creaseArr[i][1].x, creaseArr[i][1].y], transArr);
        rotatedFlippedCreaseArr.push([start, finish]);
    }
    
    console.log(rotatedFlippedCreaseArr);

    return rotatedFlippedCreaseArr;
}

const tolerance = 10 ** -8;

function tolerantSame (value1, value2) {
    return Math.abs(value1 - value2) < tolerance;
}

function lineTest (point1, point2) {
    return ((tolerantSame(point1[0], point2[0]) || tolerantSame(point1[1], point2[1])) && tolerantSame(distance(point1, point2), 1))
}

function lineLine (point1, point2, point3, point4) {
    let line1S, line1F, line2S, line2F;

    if (lineTest(point1, point2)) {
        line1S = point1, line1F = point2, line2S = point3, line2F = point4;
    } else if (lineTest(point1, point3)) {
        line1S = point1, line1F = point3, line2S = point2, line2F = point4;
    } else if (lineTest(point1, point4)) {
        line1S = point1, line1F = point4, line2S = point2, line2F = point3;
    } else {
        console.error("It's not lineLine");
    }

    let transArr = findTransformation(line1S);

    let line1F2 = doTransform(line1F, transArr);
    
    let line2S2 = doTransform(line2S, transArr);
    
    let line2F2 = doTransform(line2F, transArr);

    let creaseArr = [];

    if (tolerantSame(line2S2[0], line2F2[0])) {
        if (tolerantSame(line2S2[0], bt.x)) {
            creaseArr = [[tl, br], [tl, bo], [bo, to], [br, tt], [tt, bt]];
        }
    } else if (tolerantSame(line2S2[1], line2F2[1])) {
        if (tolerantSame(line2S2[1], lo.y)) {
            creaseArr = [[bl, tr], [bl, to], [to, bo], [lo, ro]];
        } else if (tolerantSame(line2S2[1], lt.y)) {
            creaseArr = [[tl, br], [tl, bo], [lt, rt], [bo, to]];
        }
    }

    let rotatedFlippedCreaseArr = [];

    for (let i = 0; i < creaseArr.length; i++) {
        let start = undoTransform([creaseArr[i][0].x, creaseArr[i][0].y], transArr);
        let finish = undoTransform([creaseArr[i][1].x, creaseArr[i][1].y], transArr);
        rotatedFlippedCreaseArr.push([start, finish]);
    }

    return rotatedFlippedCreaseArr;

}

function findCreaseArr (arr) {
    let creaseArr;

    arr = arr.flat();

    let cleanArray = [];

    arr.forEach((point, index) => {
        if (point instanceof paper.Point) {
            cleanArray.push([point.x, point.y])
        } else {
            console.error(`Element ${index} is not a paper.Point`);
        }
    });

    console.log(cleanArray);    

    switch(cleanArray.length) {
        case 1:
            console.log("point");
            creaseArr = point(cleanArray[0])
            break;
        case 2:
            console.log("pointPoint");
            creaseArr = pointPoint(cleanArray[0], cleanArray[1]);
            break;
        case 3:
            console.log("pointLine");
            creaseArr = pointLine(cleanArray[0], cleanArray[1], cleanArray[2]);
            break;
        case 4:
            console.log("lineLine");
            creaseArr = lineLine(cleanArray[0], cleanArray[1], cleanArray[2], cleanArray[3]);
            break;
    }

    return creaseArr;
    //linePusher(creaseArr, prelimGroup, 0);
    //prelimGroup.addChild(border);
    //prelimGroup.pivot = new paper.Point(0.5,0.5)
    //prelimGroup.scale(200, 200);
    //prelimGroup.rotate(0);
    //prelimGroup.position = new paper.Point(300, 300);
    //prelimGroup.strokeWidth = 1;
    //prelimGroup.strokeColor = 'black';
    //prelimGroup.visible = true;
}

function linePusher(arr, boxArr, time) {
    for (let i = 0; i < arr.length; i++) {

        console.log(arr);
        console.log(arr[i].length);

        // Ensure that arr[i] is an array with two points
        if (arr[i].length === 2) {
            const point1 = new paper.Point(arr[i][0][0], arr[i][0][1]);
            const point2 = new paper.Point(arr[i][1][0], arr[i][1][1]);
            var lineToBePushed = new paper.Path.Line(point1, point2);

            console.log(point1);
            console.log(point2);

            boxArr.addChild(lineToBePushed);
            lineToBePushed.strokeColor = time === 0 ? 'red' : 'black';
            lineToBePushed.strokeWidth = 1;
            lineToBePushed.visible = time >= 0;
        } else {
            console.error("Invalid array format for line:", arr[i]);
        }
    };
}

let scale;

function dot(point, time) {
    return new paper.Path.Circle({
        center: point,
        radius: 2.5/scale,
        fillColor: 'black',
        visible: time === 0
    });
}

function highLighter (from, to, time) {
    var fromDot = dot(from, time);
    var toDot = dot(to, time);
    var line = new paper.Path.Line({
        from: from,
        to: to,
        strokeColor: 'black',
        strokeWidth: 1,
        shadowBlur: 4,
        shadowColor: 'yellow',
        visible: time === 0
    })
    let highLightLine = new paper.Group(fromDot, toDot, line);

    console.log(`highlighter called.  time: ${time}`);

    return highLightLine;
}

let fontSize;

//reduces n and d by their gcd
function simplify(n, d) {
    if (n !== 0 && d !== 0) {
        const gcdND = gcd(n, d);
        n /= gcdND;
        d /= gcdND;
    } else if (n === 0) {
        d = 1;
    } else {
        n = 1;
    }
    return [n, d];
}

//a pair of numbers are scaled so that the larger equals one, but proportionality is maintained
function scaler(n, d) {
    const maxND = Math.max(n, d);
    n /= maxND;
    d /= maxND;
    return [n, d];
}

function sloper(a,b,c,type) {
    let slopePair = [];
    let blockInfo = [];
    switch (type) {
        case 'A':
            slopePair = [a+b, c, b, c];
            blockInfo = [1, Math.SQRT2 -1];
            break;
        case 'B':
            slopePair = [a + 2*b, c, -b, c];
            blockInfo = [1, 2 - Math.SQRT2];
            break;
        case 'C':
            slopePair = [2*b, c, a - 2*b, c];
            blockInfo = [1 + Math.SQRT2/2, 1];
            break;
        case 'D':
            slopePair = [b, c, a - b, c];
            blockInfo = [Math.SQRT2 + 1, 1];
            break;
        case 'E':
            slopePair = [a + b, c, a + 2*b, c];
            blockInfo = [2 - Math.SQRT2, Math.SQRT2 - 1];
            break;
        case 'F':
            slopePair = [2 * (a + b), 3 * c, -a + 2 * b, 3 * c];
            blockInfo = [1 + Math.SQRT2/2, Math.SQRT2 - 1];
            break;
        case 'G':
            slopePair = [a + b, 2 * c, -a + b, 2 * c];
            blockInfo = [Math.SQRT2 + 1, Math.SQRT2 - 1];
            break;
        case 'H':
            slopePair = [a + 2*b, 2 * c, a - 2*b, 4 * c];
            blockInfo = [1 + Math.SQRT2/2, 2 - Math.SQRT2];
            break;
        case 'I':
            slopePair = [a + 2*b, 3 * c, a - b, 3 * c]
            blockInfo = [Math.SQRT2 + 1, 2 - Math.SQRT2];
            break;
        case 'J':
            slopePair = [-a + 2*b, c, 2*a - 2*b, c]
            blockInfo = [Math.SQRT2 + 1, 1 + Math.SQRT2/2];
            break;
    }
    return [slopePair, blockInfo];
};

let rotate = 0;

function scrawler(a1, b1, w1, h1, type1, a2, b2, w2, h2, type2) {
    let zero1 = (a1 === 0 || b1 === 0 || a1 === -0 || b1 === -0);
    let one1 = (a1/b1 === 1);
    let diag1 = false;

    let zero2 = (a2 === 0 || b2 === 0 || a2 === -0 || b2 === -0);
    let one2 = (a2/b2 === 1);
    let diag2 = false;

    let precrease = false;

    [w1, h1] = scaler(w1, h1);
    [w2, h2] = scaler(w2, h2);

    // Get the canvas size
    const canvas = document.getElementById('myCanvas');
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Adjust the step size based on the canvas dimensions
    const stepSize = Math.min(canvasHeight / 2, canvasWidth / 6) * 0.8;

    scale = stepSize;

    fontSize = 12/stepSize;

    const y1 = canvasHeight / 2 - canvasWidth / 12 - stepSize / 2, y2 = canvasHeight / 2 - stepSize / 2, y3 = canvasHeight / 2 + canvasWidth / 12 - stepSize / 2;

    const x1 = 7 * canvasWidth / 12 - stepSize / 2, x2 = 2 * canvasWidth / 3 - stepSize / 2, x3 = 3 * canvasWidth / 4 - stepSize / 2, x4 = 5 * canvasWidth / 6 - stepSize / 2, x5 = 11 * canvasWidth / 12 - stepSize / 2;

    const stepper = [
        [[x3, y2]], 
        [[x2, y2], [x4, y2]], 
        [[x1, y2], [x3, y2], [x5, y2]],
        [[x2, y1], [x4, y1], [x2, y3], [x4, y3]],
        [[x1, y1], [x3, y1], [x5, y1], [x2, y3], [x4, y3]],
        [[x1, y1], [x3, y1], [x5, y1], [x1, y3], [x3, y3], [x5, y3]]
    ];

    updateInfoText();

    let preCreaseLineArr = [], preCreaseArr = [];

    let diag1Group = diag(a1, b1, w1, h1, 0, false);
    let diag2Group = diag(a2, b2, w2, h2, 0, true);

    let c1S = new paper.Point(0,0), c1F = new paper.Point(1,1);
    let c2S = new paper.Point(1,0), c2F = new paper.Point(0,1);

    if ((one1 || zero1) && (one2 || zero2)) {
        preCreaseLineArr.push (...oneZero(one1, one2, zero1, zero2, w1, h1, w2, h2));
        c1F = new paper.Point(w1, h1);
        c2F = new paper.Point(1-w2, h2);
        if (zero1) {
            if (a2*w2/b2*h2 >= 1) {c1F.x = 0}
            else {c1S.y = 1}
        }
        if (zero2) {
            if (a1*w1/b1*h1 >= 1) {c2F.x = 1}
            else {c2S.y = 1}
        }
    } else {
        if (one1) {
            if (isTwoMinusRtTwo(w1, h1) || isOnePlusHalfRtTwo(w1, h1)) preCreaseLineArr.push([[0,0],[w1,h1]]);
            preCreaseArr.push(new paper.Point(w1, h1));
            preCreaseLineArr.push([[0,0], [w1, h1]])
            c1F = new paper.Point(w1, h1);
            console.log("log")
        } else if (zero1) {
            if (a2*w2/b2*h2 >= 1) {c1F.x = 0}
            else {c1S.y = 1}
            console.log("log")
        } else {
            diag1 = true;
            preCreaseArr.push(diag1Group[1]);
            //c1F = diag1Group[0]._children[0].segments.slice(-1)[0].point;
            console.log("log")
        }
        if (one2) {
            if (isTwoMinusRtTwo(w2, h2) || isOnePlusHalfRtTwo(w2, h2)) preCreaseLineArr.push([[1,0],[1-w2,h2]]);
            preCreaseArr.push(new paper.Point(1-w2, h2));
            c2F = new paper.Point(1-w2, h2);
            preCreaseLineArr.push([[1,0], [1-w2, h2]])
            console.log("log")
        } else if (zero2) {
            if (a1*w1/b1*h1 >= 1) {c2F.x = 1}
            else {c2S.y = 1}
            console.log("log")
        } else {
            diag2 = true;
            preCreaseArr.push(diag2Group[1]);
            //c2F = diag2Group[0]._children[0].segments.slice(-1)[0].point
            console.log("log")
        }
    }

    let intersection = true;
    
    if (!((zero2 && type1 === 'powTwo' && tolerantSame(w1, h1)) || (zero1 && type2 === 'powTwo' && tolerantSame (w2, h2)))) {
        if (!((one1 || zero1) && (one2 || zero2))) {
            console.log("sending");
            console.log(findCreaseArr(preCreaseArr));
            if (findCreaseArr(preCreaseArr)) preCreaseLineArr.push (...findCreaseArr(preCreaseArr));
        }
        precrease = true;
    };

    if ((zero2 && type1 === 'powTwo' && (a1 > b1 === w1 > h1 || tolerantSame(w1, h1))) || 
    (zero1 && type2 === 'powTwo' && (a2 > b2 === w2 > h2 || tolerantSame (w2, h2)))) {
        intersection = false;
        console.log("intersection false")
    }

    let preCreaseGroup = new paper.Group();

    let stepCount = [];

    if (precrease) {stepCount.push('precrease')};
    if (diag1) {stepCount.push('diag1')};
    if (diag2) {stepCount.push('diag2')};
    if (intersection) {stepCount.push('intersection')};

    const stepData = stepper[stepCount.length - 1];

    if (preCreaseLineArr) {linePusher(preCreaseLineArr, preCreaseGroup, 0)};

    function borderFactory(numSteps) {
        const border = new paper.Path.Rectangle({
            from: new paper.Point(stepData[numSteps][0], stepData[numSteps][1]),
            to: new paper.Point(stepData[numSteps][0] + stepSize, stepData[numSteps][1] + stepSize),
            strokeColor: 'black',
            strokeWidth: 1,
        });
        return border;
    }

    let screen = new paper.Group();

    let precreaseIndex = stepCount.indexOf('precrease');
    let diag1Index = stepCount.indexOf('diag1');
    let diag2Index = stepCount.indexOf('diag2');
    let intersectionIndex = stepCount.indexOf('intersection');

    let precreasesi0 = new paper.Group();
    let precreasesi1 = new paper.Group();
    console.log("to linePusher");
    console.log(preCreaseLineArr);
    linePusher(preCreaseLineArr, precreasesi0, 0);
    linePusher(preCreaseLineArr, precreasesi1, 1);


    let diagonals1, diagonals2;

    console.log(`*** Begin drawing elev. ${window.variable} ***`);

    let aRD = globalC2[window.variable-1][0];
    let bRD = globalC2[window.variable-1][1];
    let cRD = globalC2[window.variable-1][2];

    [aRD, bRD, cRD] = normalize(aRD, bRD, cRD);

    const elevationFinal = inverse(aRD, bRD, cRD);
    const elevationFinalCoord = summup(elevationFinal[0], elevationFinal[1], elevationFinal[2])

    var dSLs = new paper.Point(0,0);
    var dSLf = new paper.Point(1,1);

    if (xory === 'X') {
        dSLs.x = (stepData[stepCount.length - 1][0]);
        dSLs.y = (stepData[stepCount.length - 1][1]) + elevationFinalCoord*stepSize;
        dSLf.x = (stepData[stepCount.length - 1][0] + stepSize);
        dSLf.y = (stepData[stepCount.length - 1][1]) + elevationFinalCoord*stepSize;
    } else {
        dSLs.x = (stepData[stepCount.length - 1][0] + elevationFinalCoord*stepSize);
        dSLs.y = (stepData[stepCount.length - 1][1] );
        dSLf.x = (stepData[stepCount.length - 1][0] + elevationFinalCoord*stepSize);
        dSLf.y = (stepData[stepCount.length - 1][1] + stepSize);
    }

    var desiredLine = new paper.Path.Line ({
        from: dSLs,
        to: dSLf,
        strokeColor: 'red',
        strokeWidth: 1
    });

    for (let i = 0; i < stepCount.length; i++) {
        let thisStep = new paper.Group();

        if (precreaseIndex !== -1) {
            console.log(`precreases called for step ${i + 1} with a time ${i - precreaseIndex}`);
            let precreasesToAdd 
            if (i - precreaseIndex === 0) {
                precreasesToAdd = precreasesi0.clone();
            } else precreasesToAdd = precreasesi1.clone();            
            precreasesToAdd.rotate(rotate);
            thisStep.addChild(precreasesToAdd);
            console.log(thisStep);
        }
        if (diag1Index !== -1 && i - diag1Index >= 0) {
            console.log(`diag1 called for step ${i + 1} with a time ${i - diag1Index}`);
            diagonals1 = diag(a1, b1, w1, h1, i - diag1Index, false)[0];
            thisStep.addChild(diagonals1);
            console.log(thisStep);
            if (!intersection) {
                diagonals1._children[0].visible = false;
            }
            if (i - intersectionIndex === 0) {
                c1S = diagonals1._children[0].segments[0].point;
                c1F = diagonals1._children[0].segments.slice(-1)[0].point;
                console.log([c1S, c1F]);
            }
        }
        if (diag2Index !== -1 && i - diag2Index >= 0) {
            console.log(`diag2 called for step ${i + 1} with a time ${i - diag2Index}`);
            diagonals2 = diag(a2, b2, w2, h2, i - diag2Index, true)[0];
            thisStep.addChild(diagonals2);
            console.log(thisStep);
            if (!intersection) {
                diagonals2._children[0].visible = false;
            }
            if (i - intersectionIndex === 0) {
                c2S = c2S = diagonals2._children[0].segments[0].point;
                c2F = diagonals2._children[0].segments.slice(-1)[0].point;
                console.log([c2S, c2F]);
            }
        }
        if (intersectionIndex !== -1 && i - intersectionIndex >= 0 && intersection) {

            console.log("int step, " + [c1S, c1F, c2S, c2F]);
            let intPt = new paper.Point();

            let unscaledDSLS = new paper.Point(0,0);
            let unscaledDSLF = new paper.Point(1,1);

            if (xory === 'X') {
                unscaledDSLS.y = (elevationFinalCoord);
                unscaledDSLF.y = (elevationFinalCoord);
            } else {
                unscaledDSLS.x = (elevationFinalCoord);
                unscaledDSLF.x = (elevationFinalCoord);
            };

            if (diag1 && diag2) {
                intPt = intersect(c1S.x, c1S.y, c1F.x, c1F.y, c2S.x, c2S.y, c2F.x, c2F.y);
            } else if (diag1) {
                intPt = intersect(c1S.x, c1S.y, c1F.x, c1F.y, unscaledDSLS.x, unscaledDSLS.y, unscaledDSLF.x, unscaledDSLF.y);
                if (!intPt) {
                    intPt = c1F.clone();
                }
                console.log("log");
            } else if (diag2) {
                intPt = intersect(c2S.x, c2S.y, c2F.x, c2F.y, unscaledDSLS.x, unscaledDSLS.y, unscaledDSLF.x, unscaledDSLF.y);
                if (!intPt) {
                    intPt = c2F.clone();
                }
                console.log("log");
            } else if (one1) {
                if (zero2) {
                    intPt = new paper.Point(w1, h1)
                } else {
                    intPt = intersect(0, 0, w1, h1, unscaledDSLS.x, unscaledDSLS.y, unscaledDSLF.x, unscaledDSLF.y);
                }
                //intPt = unscaledDSLS.clone();
                console.log("hey");
            } else if (one2 && zero1) {
                if (zero1) {
                    intPt = new paper.Point(1-w2, h2);
                } else {
                    intPt = intersect(1, 0, 1-w1, h1, unscaledDSLS.x, unscaledDSLS.y, unscaledDSLF.x, unscaledDSLF.y);
                }
                //intPt = unscaledDSLF.clone();
                console.log("hey");
            }

            if (intPt) {
                intPt.pivot = new paper.Point(0.5, 0.5);
                intPt.rotate(rotate);
                let intDot = dot (intPt, i - intersectionIndex);
                console.log(intDot);
                thisStep.addChild(intDot);
            }
        } else {
            console.log("no int step, " + [c1S, c1F, c2S, c2F]);
        }

        thisStep.pivot = new paper.Point(0.5, 0.5);
        thisStep.scale(stepSize, stepSize);
        console.log(stepData);
        console.log(thisStep);
        console.log(thisStep.position);
        thisStep.position = new paper.Point(stepData[i][0] + stepSize / 2, stepData[i][1] + stepSize / 2);
        thisStep.strokeWidth = 1;

        borderFactory(i);

        screen.addChild(thisStep);
    }
}

function diag (a, b, w, h, time, diag2) {
    let type = findRank(a, b).type;

    if (tolerantSame(a, b)) {
        return [null, null]
    } else if (tolerantSame(a, 0) || tolerantSame(b, 0)) {
        return [null, null]
    } else if (type.includes('diag')) {type = 'diag'};
    switch (type) {
        case 'powTwo':
            return powTwoFunction   (a, b, w, h, time, diag2);
        case 'general':
            return generalFunction  (a, b, w, h, time, diag2);
        case 'diag':
            return diagFunction     (a, b, w, h, time, diag2);
    }
}

//returns [powtwogroup, powtwoprelim]
function powTwoFunction (a, b, w, h, time, diag2) {

    [w, h] = scaler(w, h);
    [a, b] = simplify(a, b);

    var bbl = new paper.Point(0, 0);
    var bbr = new paper.Point(w, 0);
    var btr = new paper.Point(w, h);
    var btl = new paper.Point(0, h);

    let timeColor = time === 0 ? 'red' : 'black';
    var creaseStyle = {
        strokeColor: timeColor,
        strokeWidth: 1,
        visible: time >= 0
    }

    var cstart = bbl;
    var csquare = new paper.Point(a * w, b * h);
    [csquare.x, csquare.y] = scaler(csquare.x, csquare.y);
    var creasePowTwo = new paper.Path(cstart, csquare);
    creasePowTwo.style = creaseStyle;

    let powTwoHighLight, powTwoDot, powTwoDotPt, powTwoLabelText, powTwoBlockDot, powTwoTextPt;
    let powTwoTextJust = 'center';

    let powTwoPrelim = [];

    if (isPowerTwo(Math.max(a,b))) {
        if (tolerantSame(w, h)) {
            console.log("square, powTwo");
            powTwoDotPt = csquare;
            powTwoDot = dot(csquare, time);
            powTwoLabelText = `${Math.min(a,b)}/${Math.max(a,b)}`;
            powTwoTextPt = csquare.clone();
            if (a < b) {
                powTwoHighLight = highLighter(btl, btr, time);
                powTwoTextPt.y += fontSize;
            } else if (a > b) {
                powTwoHighLight = highLighter(btr, bbr, time);
                powTwoTextJust = 'left'
            } else {
                powTwoTextPt.y += fontSize;
            }
        } else {
            console.log("not square, powTwo");
            powTwoPrelim.push(btr);
            if (a < b) {
                powTwoHighLight = highLighter(btl,btr,time);
                powTwoDotPt = new paper.Point(w*a/b, h);
                powTwoLabelText = `${a}/${b}`;
                powTwoTextPt = powTwoDotPt.clone();
                powTwoTextPt.y += fontSize;
                if (w > h) {
                    powTwoPrelim.push(btl);
                    console.log("a<b, w>h");
                };
            } else if (a > b) {
                powTwoHighLight = highLighter(btr,bbr,time);
                powTwoDotPt = new paper.Point(w,h*b/a);
                powTwoLabelText = `${b}/${a}`;
                powTwoTextPt = powTwoDotPt.clone();
                powTwoTextJust = 'left';
                if (w < h) {
                    powTwoPrelim.push(bbr);
                    console.log("a>b, w<h")
                };
            }
            powTwoDot = dot(powTwoDotPt, time);
        }
        if (a === b) {powTwoLabelText = ''};
    } else console.error("Not powTwo")

    var powTwoLabel = new paper.PointText({
        point: powTwoTextPt,
        content: powTwoLabelText,
        fontSize: 12/scale,
        fillColor: 'black',
        justification: powTwoTextJust,
        visible: time === 0
    })
      
    var validPowTwoItems = [creasePowTwo, powTwoHighLight, powTwoLabel, powTwoDot]
    .filter(item => item instanceof paper.Item); // Only keep valid Paper.js items

    var powTwoGroup = new paper.Group(validPowTwoItems);

    console.log(powTwoPrelim);

    powTwoGroup.pivot = new paper.Point(0.5, 0.5);

    if (diag2) {
        powTwoGroup.scale(-1, 1);
        powTwoPrelim.forEach(element => {
            element.x = 1 - element.x;
        });
        powTwoLabel.scale(-1,1);
    }
    console.log(powTwoPrelim);
    console.log(powTwoLabel);
    console.log(powTwoHighLight);
    console.log(powTwoDot);

    powTwoGroup.rotate(rotate);
    powTwoLabel.rotation = 0;
    
    if (powTwoPrelim.length > 0) {
        return([powTwoGroup, powTwoPrelim]);
    } else return([powTwoGroup, null]);

}

function generalFunction (a, b, w, h, time, diag2) {
    let tall = h > w;
    let wide = w > h;
    let square = tolerantSame(w, h);

    let timeColor = time === 0 ? 'red' : 'black';
    var creaseStyle = {
        strokeColor: timeColor,
        strokeWidth: 1,
    };
    
    [w, h] = scaler(w, h);

    [a, b] = simplify(a, b);

    var bbl = new paper.Point(0, 0);
    var bbr = new paper.Point(w, 0);
    var btr = new paper.Point(w, h);
    var btl = new paper.Point(0, h);

    var cstart = bbl;
    var csquare = new paper.Point(a * w, b * h);
    [csquare.x, csquare.y] = scaler(csquare.x, csquare.y);
    var creaseGen = new paper.Path(cstart, csquare);
    creaseGen.style = creaseStyle;

    const smallestPowTwo = 2 ** Math.ceil(Math.log2(Math.max(a, b)));

    let vertX = w*a/smallestPowTwo;
    let horiY = h*b/smallestPowTwo;

    var genInt = new paper.Point(vertX, horiY);
    var genIntPt = dot(genInt);

    let vertY = 0;
    let horiX = 0;
    let vertTexY = vertY;
    
    let horiJust = 'right';
    let vertJust = 'center';
    
    let horiHighLightStart = new paper.Point(0,0);
    let vertHighLightStart = new paper.Point(0,0);
    let horiHighLightFinish = new paper.Point(w,0);
    let vertHighLightFinish = new paper.Point(0,h);

    let horiNear = true;
    let vertNear = true;

    if (square) {
        horiNear = a <= smallestPowTwo/2;
        vertNear = b <= smallestPowTwo/2;
    } else if (wide) {
        horiNear = a <= smallestPowTwo/2;
    } else if (tall) {
        vertNear = b <= smallestPowTwo/2;
    }

    let generalPrelim = [];

    if (tall) {
        if (vertNear) {
            generalPrelim.push(bbr);
        } else generalPrelim.push(btr);
    } else if (wide) {
        if (horiNear) {
            generalPrelim.push(btl);
        } else generalPrelim.push(btr);
    }

    if (!horiNear) {
        horiX = 1;
        horiJust = 'left';
        vertHighLightStart.x = 1;
        vertHighLightFinish.x = 1;
    } else {
        horiX = 0;
    }

    if (!vertNear) {
        vertY = 1;
        vertTexY = 1;
        vertTexY += fontSize;
        horiHighLightStart.y = 1;
        horiHighLightFinish.y = 1;
    } else {
        vertY = 0;
        vertTexY -= fontSize;
    }

    let generalA = a;
    let generalB = b;
    let generalADenom = smallestPowTwo;
    let generalBDenom = smallestPowTwo;
    
    [generalA, generalADenom] = simplify(generalA, generalADenom);
    [generalB, generalBDenom] = simplify(generalB, generalBDenom);
    let vertTextLabel = `${generalA}/${generalADenom}`;
    let horiTextLabel = `${generalB}/${generalBDenom}`;

    var vertStart = new paper.Point(vertX, vertY);
    var horiStart = new paper.Point(horiX, horiY);
    
    var vertLine = new paper.Path(vertStart, genInt);
    vertLine.style = creaseStyle;
    var horiLine = new paper.Path(horiStart, genInt);
    horiLine.style = creaseStyle;
    let vertDot = dot(vertStart);
    let horiDot = dot(horiStart);
    let vertHighLight = highLighter(vertHighLightStart, vertHighLightFinish, time);
    let horiHighLight = highLighter(horiHighLightStart, horiHighLightFinish, time);

    let horiText = new paper.PointText({
        point: new paper.Point(horiX, horiY),
        content: horiTextLabel,
        fillColor: 'black',
        fontSize: 12/scale,
        justification: horiJust,
        visible: time === 0
    });

    let vertText = new paper.PointText({
        point: new paper.Point(vertX, vertTexY),
        content: vertTextLabel,
        fillColor: 'black',
        fontSize: 12/scale,
        justification: vertJust,
        visible: time === 0
    });

    var validGenItems = [creaseGen, vertHighLight, horiHighLight, vertDot, horiDot, vertLine, horiLine, genIntPt, vertText, horiText]
    .filter(item => item instanceof paper.Item); // Only keep valid Paper.js items

    var genGroup = new paper.Group(validGenItems);

    genGroup.pivot = new paper.Point(0.5, 0.5);

    if (diag2) {
        genGroup.scale(-1, 1);
        generalPrelim.forEach(element => {
            element.x = 1 - element.x;
        });
        vertText.scale(-1,1);
        horiText.scale(-1,1);
    }

    genGroup.rotate(rotate);
    vertText.rotation = 0;
    horiText.rotation = 0;
    
    return [genGroup, generalPrelim];
}

function diagFunction (a, b, w, h, time, diag2) {

    let timeColor = time === 0 ? 'red' : 'black';
    var creaseStyle = {
        strokeColor: timeColor,
        strokeWidth: 1,
        visible: time >= 0
    };

    let type = findRank(a,b).type;
    
    [w, h] = scaler(w, h);
    [a, b] = simplify(a, b);
    
    var bbl = new paper.Point(0, 0);
    var bbr = new paper.Point(w, 0);
    var btl = new paper.Point(0, h);

    var cstart = bbl.clone();
    var csquare = new paper.Point(a * w, b * h);
    
    [csquare.x, csquare.y] = scaler(csquare.x, csquare.y);
    
    console.log("csquare: " + csquare)
    
    var creaseDiag = new paper.Path(cstart, csquare);
    creaseDiag.style = creaseStyle;

    var diagStart = btl.clone();
    var diagFinish = bbr.clone();
    let diagNumA = a, diagNumB = b, diagDenom = Math.max(a,b);
    let diagLabelPt = bbl.clone();
    let diagLabelText = '';

    let diagLabelSide;

    //returns relevant diagStart/Finish, diagDenom, diagLabelPt, diagLabelText
    if (type.includes('diag')) {
        let typeFixed = type;
        console.log(`a: ${a}, b: ${b}, type: ${type}`);
        if (a>b) {
            switch(type) {
                case 'diagA':
                    break;
                case 'diagB':
                    typeFixed = 'diagC';
                    break;
                case 'diagC':
                    typeFixed = 'diagB';
                    break;
                case 'diagD':
                    typeFixed = 'diagE';
                    break;
                case 'diagE':
                    typeFixed = 'diagD';
                    break;
                case 'diagF':
                    typeFixed = 'diagG';
                    break;
                case 'diagG':
                    typeFixed = 'diagF';
                    break;
                default:
                    break;
            }
        }
        console.log(`a: ${a}, b: ${b}, typeFixed: ${typeFixed}`);
        switch(typeFixed) {
            case 'diagA':
                if (isPowerTwo(a + b)) {
                    diagDenom = a+b;
                } else throw new Error('diagA issue');
                break;
            case 'diagB':
                if (isPowerTwo(a + 2*b)) {
                    diagStart.y = h/2;
                    diagDenom = a + 2*b;
                    diagLabelPt.y = h/2;
                    diagLabelText = '1/2';
                    diagLabelSide = 'left';
                } else throw new Error('diagB issue');            
                break;
            case 'diagC':
                if (isPowerTwo(2*a + b)) {
                    diagFinish.x = w/2;
                    diagDenom = 2*a + b;
                    diagLabelPt.x = w/2;
                    diagLabelText = '1/2';
                    diagLabelSide = 'bottom';
                } else throw new Error('diagC issue');
                break;
            case 'diagD':
                if (isPowerTwo(a + 4*b)) {
                    diagStart.y = h/4;
                    diagDenom = a + 4*b;
                    diagLabelPt.y = h/4;
                    diagLabelText = '1/4';
                    diagLabelSide = 'left';
                } else throw new Error('diagD issue');
                break;
            case 'diagE':
                if (isPowerTwo(4*a + b)) {
                    diagFinish.x = w/4;
                    diagDenom = 4*a + b;
                    diagLabelPt.x = w/4;
                    diagLabelText = '1/4';
                    diagLabelSide = 'bottom';
                } else throw new Error('diagE issue');
                break;
            case 'diagF':
                if (isPowerTwo(3*a + 4*b)) {
                    diagStart.y = 3*h/4;
                    diagDenom = 3*a + 4*b;
                    diagLabelPt.y = 3*h/4;
                    diagLabelText = '3/4';
                    diagLabelSide = 'left';
                } else throw new Error('diagF issue');
                break;
            case 'diagG':
                if (isPowerTwo(4*a + 3*b)) {
                    diagFinish.x = 3*w/4;
                    diagDenom = 4*a + 3*b;
                    diagLabelPt.x = 3*w/4;
                    diagLabelText = '3/4';
                    diagLabelSide = 'bottom';
                } else throw new Error('diagG issue');
                break;
            default:
                break;
        }
    } else throw new Error ("not Diag")
    
    console.log(diagStart)
    console.log(diagFinish)
    console.log(cstart)
    console.log(csquare)
   
    let diagInt = intersect(diagStart.x, diagStart.y, diagFinish.x, diagFinish.y, cstart.x, cstart.y, csquare.x, csquare.y);
    let diagIntDot = dot(diagInt, time);
    var parallelStart = bbl.clone();
    let parallelText  = '';
    var highLightX = highLighter(bbl,bbr, time);
    var highLightY = highLighter(bbl,btl, time);
    let diagDot = dot(diagLabelPt, time);
    
    [diagNumA, diagDenom] = simplify(diagNumA, diagDenom);
    [diagNumB, diagDenom] = simplify(diagNumB, diagDenom);

    let parallelLabelPt;
    let parallelLabelJust = 'center';

    let diagPrelim = [];

    if (!tolerantSame(diagFinish.x, diagStart.y)) {
        if (diagFinish.x > diagStart.y){
            parallelStart.x = diagInt.x;
            parallelText = `${diagNumA}/${diagDenom}`;
            parallelLabelPt = parallelStart.clone();
            parallelLabelPt.y -= fontSize;
        } else if (diagFinish.x < diagStart.y){
            parallelStart.y = diagInt.y;
            parallelText = `${diagNumB}/${diagDenom}`;
            parallelLabelPt = parallelStart.clone();
            parallelLabelJust = 'right';
        }
    } else {
        diagDot.visible = false;

        if (a*w >= b*h) {
            parallelStart.x = diagInt.x;
            parallelText = `${diagNumA}/${diagDenom}`;
            highLightY.visible = false;
            parallelLabelPt = parallelStart.clone();
            parallelLabelPt.y -= fontSize;
        } else {
            parallelStart.y = diagInt.y;
            parallelText = `${diagNumB}/${diagDenom}`;
            highLightX.visible = false;
            parallelLabelPt = parallelStart.clone();
            parallelLabelJust = 'right';
        }
    }
    
    let parallelDot = dot(parallelStart)
    var parallelLine = new paper.Path(parallelStart, diagInt);
    parallelLine.style = creaseStyle;

    let diagJust;
    if (diagLabelSide === 'left') {diagJust = 'right'} else {diagJust = 'center'};
    if (diagLabelSide === 'bottom') {diagLabelPt.y -= fontSize};

    var diagText = new paper.PointText({
        point: diagLabelPt,
        content: diagLabelText,
        fillColor: 'black',
        fontSize: 12/scale,
        justification: diagJust,
        visible: time === 0
    })

    var parallelTextObj = new paper.PointText({
        point: parallelLabelPt,
        content: parallelText,
        fillColor: 'black',
        fontSize: 12/scale,
        justification: parallelLabelJust,
        visible: time === 0
    })

    let diagLine = new paper.Path(diagStart, diagFinish);
    diagLine.style = creaseStyle;
    
    let anotherDot;
    if (w > h) {
        anotherDot = dot(new paper.Point(0, h), time);
        diagPrelim.push(btl);
    } else if (h > w) {
        anotherDot = dot(new paper.Point(w, 0), time);
        diagPrelim.push(bbr);
    }
    
    var validDiagItems = [creaseDiag, anotherDot, highLightX, highLightY, parallelLine, diagIntDot, diagLine, diagDot, parallelDot, parallelTextObj, diagText]
    .filter(item => item instanceof paper.Item); // Only keep valid Paper.js items

    var diagGroup = new paper.Group(validDiagItems);

    diagGroup.pivot = new paper.Point(0.5, 0.5);

    if (diag2) {
        diagGroup.scale(-1, 1);
        diagPrelim.forEach(element => {
            element.x = 1 - element.x;
        });
        parallelTextObj.scale(-1,1);
        diagText.scale(-1,1);
    }

    diagGroup.visible = time >= 0;

    diagGroup.rotate(rotate);
    parallelTextObj.rotation = 0;
    diagText.rotation = 0;

    return([diagGroup, diagPrelim])
}

function oneZero (one1, one2, zero1, zero2, w1, h1, w2, h2) {
    let pointBucket = [];
    console.log("calling oneZero");
    if (one1 && one2) {
        if (isOne(w1, h1)) {
            if (isRtTwoMinusOne(w2, h2)) {
                pointBucket.push([bl,tr],[tl,br],[br,tt]);
                //dotStepOne(bl, tr, tt, br);
                console.log("A, one & one");
            } else if (isTwoMinusRtTwo(w2, h2)) {
                pointBucket.push([bl,tr], [bl,to], [br,to]);
                //dotStepOne(bl, tr, to, br);
                console.log("B, one & one");
            }
        } else if (isOne(w2, h2)) {
            if (isOnePlusHalfRtTwo(w1, h1)) {
                pointBucket.push([tl,br], [tl,rt], [bl,rt]);
                //dotStepOne(bl, rt, tl, br);
                console.log("C, one & one");
            } else if (isRtTwoPlusOne(w1, h1)) {
                pointBucket.push([tl,br], [bl,ro], [bl,tr]);
                //dotStepOne(bl, ro, tl, br);
                console.log("D, one & one");
            }
        } else if (isRtTwoPlusOne(w1, h1)) {
            if (isRtTwoMinusOne(w2, h2)) {
                pointBucket.push([bl,tr],[bl,ro],[tt,br]);
                //dotStepOne(bl, ro, tt, br);
                //perp symbol
                console.log("G, one & one");
            } else if (isTwoMinusRtTwo(w2, h2)) {
                pointBucket.push([bl,tr], [bl,to],[bl,ro],[to,br]);
                //dotStepOne(bl, ro, to, br);
                console.log("I, one & one");
            } else if (isOnePlusHalfRtTwo(w2, h2)) {
                pointBucket.push([bl,tr],[bl,ro],[tr,lt],[lt,br]);
                //dotStepOne(br, lo, bl, rt);
                console.log("J, one & one");
            }
        } else if (isOnePlusHalfRtTwo(w1, h1)) {
            if (isRtTwoMinusOne(w2, h2)) {
                pointBucket.push([tl,br],[tl,rt],[br,tt],[bl,rt]);
                //dotStepOne(bl, rt, br, tt);
                console.log("F, one & one");
            } else if (isTwoMinusRtTwo(w2, h2)) {
                pointBucket.push([tl,br], [tl,rt], [bl,rt],[to,br]);
                //dotStepOne(bl, rt, to, br);
                //perp symbol
                console.log("H, one & one");
            }
        }
    } else if (zero1 || zero2) {
        if (one1 && isRtTwoPlusOne(w1, h1)) {
            pointBucket.push([bl,tr],[bl,ro]);
            console.log("zero & one(rt2+1)");
        } else if (one2 && isRtTwoPlusOne(w2, h2)) {
            pointBucket.push([br,tl],[br,lo]);
            console.log("zero & one(rt2+1)");
        } else if (one1 && isOnePlusHalfRtTwo(w1, h1)) {
            pointBucket.push([tl,br],[tl,rt]);
            console.log("zero & one(1+rt2/2)")
        } else if (one2 && isOnePlusHalfRtTwo(w2, h2)) {
            pointBucket.push([bl,tr],[tr,lt]);
            console.log("zero & one(1+rt2/2)")
        }
    }

    const result = pointBucket.map(pair => {
        return pair.map(point => [point.x, point.y]);
    });

    return result;
}