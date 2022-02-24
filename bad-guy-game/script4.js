const d1 =
    // Thanks for author of birds .svg
    "M3.46 20.5c-.34 1.15 1.26.67 2.92.13 3.46-1.1 5.86-7.16 8.38-9.47 6.18-5.64 16.5 3.07 23.45 7.7.8.52 1.7 1.12 2.2 1.92 1.4 2.22.3 5.6 2.4 7.24 1.7 1.23 4 .32 5.7-.64 4.3-2.42 8.1-5.47 11.5-8.9 3.4-3.45 10.4-5.66 14.9-7.04 3.3-1 6.3-2.77 8.9-.5 4.78 2.32 12.4 5.68 17.6 11.3 2.85 2.95 6.33 6.18 10.33 5.58 0-1.2-.84-2.25-1.5-3.2-8.5-11.1-4.66-6-14.7-15.82-3.4-3.28-9.44-8.55-14-7.36-3.7.86-15 4.43-18.26 6.6-4.85 2.3-9.07 6.18-14.12 6.5-1.8.07-3.42-.97-5-1.8-7.2-3.88-21-15.04-27.5-10.17C13.32 5 11 9.77 8.45 13.02c-1.22 1.58-2.37 3.22-3.4 5-.03.22-1.45 2.16-1.57 2.46z";
const d2 =
    "M.28 12.2c-.94.75.64 1.28 2.32 1.78 3.47 1.07 8.2-.65 11.58-1.1 8.3-1.1 16.94.82 23.9 5.44.75.53 1.63 1.13 2.14 1.93 1.4 2.23.3 5.6 2.37 7.24 1.6 1.2 4 .3 5.7-.7 4.2-2.4 8.1-5.5 11.4-8.9 3.3-3.5 6.4-7.3 10.7-9.2 3.12-1.4 6.8-1.4 10.2-1.2C93.8 8 95.7 10 106.1 15c4.05.5 8.8.85 11.53-2.1-.77-.96-2.08-1.25-3.2-1.58C101.03 8.1 99.35 5.6 86.8.9c-4.38-1.63-9.5-.86-13.94.8-3.6 1.22-6.6 3.64-9.86 5.82-3.46 2.22-7.18 4.2-11.03 5.7-1.04.38-2.08.75-3.1.8-1.84.06-3.45-.98-5-1.82-7.1-3.86-15.17-5.6-23.25-5.3-4.1.12-8.05.82-11.97 2.03-1.9.6-3.8 1.28-5.64 2.16-.1.1-2.4.9-2.7 1.1z";
const speed = new Map([
    ["slow", ['all 4.95s cubic-bezier(0.9,1.1,0.9,1.1)', 5000]],
    ["low", ['all 3.95s cubic-bezier(0.9,1.1,0.9,1.1)', 4000]],
    ["medium", ['all 2.95s cubic-bezier(0.9,1.1,0.9,1.1)', 3000]],
    ["fast", ['all 1.95s cubic-bezier(0.9,1.1,0.9,1.1)', 2000]]
])


// class to create new SVG for with ID

const wrap = document.querySelector("#birdsWrapper");
const svg = wrap.querySelector("svg");
let idcounter = 0;

class Birds {
    constructor() {
        this.svg = wrap.querySelector("svg").cloneNode(true);
        this.id = idcounter++;
        wrap.appendChild(this.svg).setAttribute("id", this.id);
        this.fly = this.svg.getElementById("birdfly");
    }
}

class Display {
    constructor() {
            this.selectedNumber = ["Start number", 3];
            this.selectedSpeed = ["Speed", 'low'];
            this.currentNumber = ["Current number", 0];
            this.status = ["Status", "Stop"];
            this.timer = ["Time", '0:00'];
        }
        // convert sec to min : sec
    convertTime(amount) {
        if (amount % 60 > 9) {
            return Math.floor(amount / 60) + ":" + (amount % 60 ? amount % 60 : '00')
        } else {
            return Math.floor(amount / 60) + ":0" + amount % 60
        }
    }
}
// 
class BirdPosition {
    constructor(id, transitionSet) {
        this._x = Math.floor(document.body.clientWidth / 4 + (document.body.clientWidth / 2) * Math.random());
        this._y = Math.floor(document.body.clientHeight / 4 + (document.body.clientHeight / 2) * Math.random());
        this._scale = Number((Math.random() * 2).toFixed(2))
        this.id = id;
        this.bird = document.getElementById(this.id);
        this.fly = this.bird.getElementById("birdfly");
        this.transitionSet = transitionSet;
    }

    getPos() {
        return [this._x, this._y, this._scale];
    }
    posBird() {
        this.bird.style.transition = this.transitionSet;
        this.bird.style.left = `${this._x}px`;
        this.bird.style.top = `${this._y}px`;
        this.bird.style.transform = `scale(${this._scale})`;
    }
    get flyInfo() {
        if (this.fly.getAttribute("d") === d2) {
            return "true";
        } else {
            return "false";
        }
    }

    set flyInfo(fl) {
        this.fly.setAttribute("d", fl);
    }
}


// Create DOM elements of display
let display = new Display();
let map = new Map(Object.entries(display))
let infoDiv = document.createElement("div");
infoDiv.classList.add("info");
let info = document.createElement("p");

map.forEach((key, val, m) => {
    let span = document.createElement("span");
    span.classList.add("data")
    let a = document.createElement("span");
    a.classList.add("a-data")
    a.textContent = key[0];
    let b = document.createElement("span");
    b.classList.add("b-data")
    b.textContent = key[1];
    span.appendChild(a);
    span.appendChild(b);
    info.appendChild(span)
})
infoDiv.appendChild(info);
wrap.appendChild(infoDiv);


// Run update browser display
let displayID;
let runUpdateDisplay = () => {
    displayID = setInterval(() => {
        let browserData = info.querySelectorAll(".b-data")
        let displayArray = Array.from(map);
        for (let n = 0; n < 5; n++) {
            if (n !== 4) {
                browserData[n].textContent = displayArray[n][1][1]
            } else {
                browserData[n].textContent = display.convertTime(displayArray[n][1][1])
            }

        }
    }, 500);
};

// Stop update display 0.5sec cycle
let stopUpdateDisplay = () => {
    clearInterval(displayID);
};

// Run 1 sec timer
let timerID;
let timerRun = () => {
    timerID = setInterval(() => {
        display.timer[1]++;
    }, 1000);
};

// Stop 1 sec timer
let timerStop = () => {
    clearInterval(timerID);
};

const start = document.getElementById("start");

function once() {
    for (let i = 0; i < display.selectedNumber[1]; i++) {
        startFly();
        wrap.style.cursor = "crosshair";
        start.disabled = true;
        numberButton.disabled = true;
        speedSelectButton.disabled = true;
        stop.disabled = false;
        display.status[1] = "Game started";
        runUpdateDisplay();
    }
    shot();
    display.timer[1] = 0;
    timerRun();
    start.removeEventListener("click", once);
}
start.addEventListener("click", once);

function startFly() {
    let bird = new Birds();
    birdsNumber();
    runFly(bird.id);
}

let changePosition = [];

function runFly(id) {
    birdsNumber();
    let brd = new BirdPosition(id, speed.get(display.selectedSpeed[1])[0])
    brd.posBird()
    brd.flyInfo = d2;
    changePosition[id] = setInterval(() => {
        brd = new BirdPosition(id, speed.get(display.selectedSpeed[1])[0])
        brd.posBird()
        brd.flyInfo = d2;
        setTimeout(() => {
            setTimeout(() => {
                brd.flyInfo = d2;
            }, 300 + id * 10); // period of changing of type of wings
            brd.flyInfo = d1;
        }, 1000 + id * 10); // period of changing of type of wings
        // }
    }, speed.get(display.selectedSpeed[1])[1] + id * 50); // period of changing direction of movement
}



function stopFly(id) {
    clearInterval(displayID);
    clearInterval(changePosition[id]);
}

function birdsNumber() {
    let birdsNumber = wrap.querySelectorAll("svg").length - 1;
    display.currentNumber[1] = birdsNumber;
    if (!birdsNumber) {
        display.status[1] = "GAME OVER!";
        if (stop.textContent == "Play") {
            playPause()
        }
        overSound();
        timerStop();
        start.addEventListener("click", once);
        wrap.removeEventListener("click", shotCallback);
        start.disabled = false;
        numberButton.disabled = false;
        speedSelectButton.disabled = false;
        stop.disabled = true;
        wrap.style.cursor = "default";
    }
}


function shot() {
    wrap.addEventListener("click", shotCallback);
}

function shotCallback(ev) {
    if (ev.target.nodeName === "path") {
        let target = ev.target.parentElement.parentElement;
        let shotPos = [ev.clientX, ev.clientY]
        stopFly(ev.target.parentElement.parentElement.id);
        ev.target.parentElement.parentElement.remove();
        shotFlame(shotPos)
    } else {
        if (stop.textContent !== "Play") {
            startFly();
        }
    }
    shotSound()
    birdsNumber();
}

// Shot image
let shotFlame = (el) => {
    let shotFlame = document.createElement("img")
    const styles = {
        "position": "absolute",
        "zIndex": 10,
        "left": (el[0] - 45) + "px",
        "top": (el[1] - 45) + "px"
    };
    shotFlame.src = "flame3.png"
    Object.assign(shotFlame.style, styles);
    wrap.appendChild(shotFlame)
    setTimeout(() => {
        shotFlame.remove()
    }, 500)
}

// Shot sound
function shotSound() {
    // Thanks free sound effects from https://www.fesliyanstudios.com
    const gun = new Audio("gun.mp3");
    gun.play();
}

// Game over sound
function overSound() {
    // Thanks free https://www.fiftysounds.com/royalty-free-music
    const over = new Audio("gameover.mp3");
    over.play();
}


const numberButton = document.getElementById("select-number");
const numberList = document.getElementById("number-list");
const speedSelectButton = document.getElementById("select-speed");
const speedList = document.getElementById("speed-list");

// open Numbers settings
numberButton.addEventListener("click", () => {
    numberList.classList.add("show");
});

// open Speed settings
speedSelectButton.addEventListener("click", () => {
    speedList.classList.add("show");
});

// set Numbers settings
numberList.addEventListener("click", (e) => {
    display.selectedNumber[1] = e.target.text;
    if (numberList.classList.contains("show")) {
        numberList.classList.remove("show");
    }
    display.timer[1] = 0;
    runUpdateDisplay();
});

// set Speed settings
speedList.addEventListener("click", (event) => {
    display.selectedSpeed[1] = event.target.text;
    if (speedList.classList.contains("show")) {
        speedList.classList.remove("show");
    }
    display.timer[1] = 0;
    runUpdateDisplay();
});


// Stop-Play function
const stop = document.getElementById("stop");
let toggle = true;
stop.addEventListener("click", playPause);

function playPause() {
    let ids = wrap.querySelectorAll("svg");
    if (toggle) {
        stop.textContent = "Play"
        ids.forEach((element) => {
            if (element.id.length) {
                stopFly(element.id);
            }
        });
    } else {
        stop.textContent = "Pause"
        ids.forEach((element) => {
            if (element.id.length) {
                runFly(Number(element.id));
            }
        });
    }
    toggle = !toggle;
}