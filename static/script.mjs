import {makeGrid} from "./grid.mjs";

let param = window.location.search;

if(param && param.indexOf("?") === 0) {
    param = param.substring(1);
}

let [level, seed, uniqifier, player] = param.split("/");

if(!level) {
    level = "normal";
}
if(!/^\d+$/.test(seed)) {
    seed = Math.floor(Math.random() * 1000000000) + 1;
    seed = seed.toString();
}
if(!/^\d+$/.test(uniqifier)) {
    uniqifier = Math.floor(Math.random() * 1000000000) + 1
    uniqifier = uniqifier.toString();
}

window.history.replaceState({}, "", `?${level}/${seed}/${uniqifier}${player ? "/" + encodeURIComponent(player) : ""}`);

//const result = await (await fetch("./grid?seed=" + seed + "&level=" + level)).json();

const result = {
    grid: makeGrid(seed, 5, 5, level),
};

const grid = document.getElementById("grid");

let i = 0;
const cells = [];
const targetRows = [];
const targetCols = [];

for(let y = 0; y < 5; y++) {
    cells[y] = [];
    for(let x = 0; x < 5; x++) {
        const goal = result.grid[i];
        const div = document.createElement("div");
        cells[y][x] = div;
        updateCell(goal, div);
        div.addEventListener("mousedown", ((g, d) => (ev) => onCellMouseDown(g, d, ev))(goal, div));
        div.addEventListener("mouseup", ((g, d) => (ev) => onCellMouseUp(g, d, ev))(goal, div));
        div.addEventListener("touchstart", ((g, d) => (ev) => onCellMouseDown(g, d, ev))(goal, div));
        div.addEventListener("touchend", ((g, d) => (ev) => onCellMouseUp(g, d, ev))(goal, div));
        div.addEventListener("contextmenu", (ev) => ev.preventDefault())
        grid.appendChild(div);
        i++;
    }
    const goal = document.createElement("div");
        
    goal.className = "tally";
    goal.innerText = "Goal";
    goal.addEventListener("mouseup", ((i) => () => onGoalMouseUp(true, i))(y));
    
    grid.appendChild(goal);
}

for(let x = 0; x < 5; x++) {
    const goal = document.createElement("div");
    goal.className = "tally";
    goal.innerText = "Goal";
    goal.addEventListener("mouseup", ((i) => () => onGoalMouseUp(false, i))(x));
    grid.appendChild(goal);
}



document.addEventListener("mousedown", onDocumentMouseDown);
document.getElementById("reveal").addEventListener("click", revealBoard);
document.getElementById("new_easy").addEventListener("click", () => newBoard("easy"));
document.getElementById("new_normal").addEventListener("click", () => newBoard("normal"));
document.getElementById("new_hard").addEventListener("click", () => newBoard("hard"));

document.getElementById("fullscreen").addEventListener("click", goFullscreen);

// alert(JSON.stringify(grid));


async function doRefresh() {
    const eventSource = new EventSource("./data/" + level + "/" + seed + "/subscribe");
    eventSource.addEventListener("message", (data) => {
        console.log("Got data", data);
        refreshData(JSON.parse(data.data));
    });
    eventSource.addEventListener("error", (e) => {
        console.error(e);
    })
}

getData().then(doRefresh);


/**
 * 
 * @param {object} goal 
 * @param {Element} div 
 * @param {MouseEvent} ev 
 */
function onCellMouseUp(goal, div, ev) {
    ev.preventDefault();
    if(div.timer) {
        clearTimeout(div.timer);
        div.timer = null;
    }
    if(div.locked) {
        div.locked = false;
        return;
    }

    let isNeg = "button" in ev && ev.button === 2;

    if(goal.incremental) {
        if(!isNeg && goal.completed < goal.value) {
            goal.completed += 1;
        } else if(isNeg && goal.completed > 0) {
            goal.completed -= 1;
        }
    } else {
        if(isNeg) {
            goal.completed = 0;
        } else {
            goal.completed = 1;
        }
    }
    notifyGoal(result.grid.indexOf(goal), goal.completed);
    updateCell(goal, div);
}

/**
 * 
 * @param {object} goal 
 * @param {Element} div 
 * @param {MouseEvent} ev 
 */
 function onCellMouseDown(goal, div, ev) {
    ev.preventDefault();
    
    div.timer = setTimeout(() => {
        div.timer = null;
        div.locked = true;
        if(goal.completed > 0) {
            goal.completed -= 1;
            notifyGoal(result.grid.indexOf(goal), goal.completed);
        }
        updateCell(goal, div);
    }, 500);
}

function onGoalMouseUp(isRow, i) {
    if(isRow) {
        if(targetRows.includes(i)) {
            targetRows.splice(targetRows.indexOf(i));
            notifyTargetRow(i, false);
        } else {
            targetRows.push(i);
            notifyTargetRow(i, true);
        }
        
        for(let x = 0; x < 5; x++) {
            updateCell(result.grid[5 * i + x], cells[i][x]);
        }

        
    } else {
        if(targetCols.includes(i)) {
            targetCols.splice(targetCols.indexOf(i));
            notifyTargetCol(i, false);
        } else {
            targetCols.push(i);
            notifyTargetCol(i, true);
        }
        for(let y = 0; y < 5; y++) {
            updateCell(result.grid[5 * y + i], cells[y][i]);
        }
    }
}

function onDocumentMouseDown(ev) {
    if(ev.detail > 1) {
        ev.preventDefault();
    }
}

function revealBoard() {
    this.parentNode.removeChild(this);
    const grid = document.getElementById("grid");
    grid.classList.remove("hidden");
}

function newBoard(level) {
    window.location.assign("?" + level);
}

/**
 * 
 * @param {object} goal 
 * @param {Element} div 
 */
function updateCell(goal, div) {
    div.innerHTML = "";
    div.className = "cell";
    div.title = "";

    if(goal) {

        let count = goal.value.toString();

        if(goal.incremental && goal.value > 1) {
            count = goal.completed + "/" + count;
            if(goal.completed >= goal.value) {
                div.classList.add("completed");
            }
        } else if(goal.completed) {
            div.classList.add("completed");
        }

        let contents = goal.goal.replace(/\{\}/g, "<span class=\"callout\">" + count + "</span>");
        if(goal.value != 1) {
            contents = contents.replace(/\(s\)/g, "s");
            
        } else {
            contents = contents.replace(/\(s\)/g, "")
                .replace(/wolves/, "wolf")
                .replace(/cities/, "city");
        }
        contents = "<span>" + contents + "</span>";

        div.innerHTML = contents;

        if(goal.note) {
            div.classList.add("info");
            div.title = goal.note;
        }

        if(targetRows.includes(goal.y) || targetCols.includes(goal.x)) {
            div.classList.add("target");
        }
        
    }
}
function goFullscreen() {
    if(document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen({
            navigationUI: "hide",
        });
    } else if(document.documentElement.webkitEnterFullscreen) {
        document.documentElement.webkitEnterFullscreen();
    }
}

const notifyRequest = new Request("./data/" + level + "/" + seed, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
})

async function notifyGoal(i, value) {
    const request = new Request(notifyRequest, {
        body: JSON.stringify({
            goal: i,
            value,
        })
    });
    const result = await (await fetch(request)).json();

    if(!result.ok) {
        console.error(result);
    }
}

async function notifyTargetRow(i, value) {
    const request = new Request(notifyRequest, {
        body: JSON.stringify({
            targetRow: i,
            value: value ? 1 : 0,
        })
    });
    const result = await (await fetch(request)).json();

    if(!result.ok) {
        console.error(result);
    }
}

async function notifyTargetCol(i, value) {
    const request = new Request(notifyRequest, {
        body: JSON.stringify({
            targetCol: i,
            value: value ? 1 : 0,
        }),
    });
    const result = await (await fetch(request)).json();

    if(!result.ok) {
        console.error(result);
    }
}

async function getData() {
    const data = await(await fetch("./data/" + level + "/" + seed + "?time=0")).json();
    await refreshData(data);
}

async function pollData() {
    const data = await(await fetch("./data/" + level + "/" + seed + "?time=60000")).json();
    await refreshData(data);
}

async function refreshData(data) {
    const touched = new Set();

    for(let i = 0; i < result.grid.length; i++) {
        if(typeof (data.goals[i]) === "number" && result.grid[i].completed !== data.goals[i]) {
            result.grid[i].completed = data.goals[i];
            touched.add(i);
        }
    }

    for(const row of data.targetRows) {
        if(!targetRows.includes(row)) {
            for(let i = row * 5; i < (row + 1) * 5; i++) {
                touched.add(i);
            }
            targetRows.push(row);
        }
    }
    for(const row of targetRows) {
        if(!data.targetRows.includes(row)) {
            for(let i = row * 5; i < (row + 1) * 5; i++) {
                touched.add(i);
            }
            targetRows.splice(targetRows.indexOf(row), 1);
        }
    }
    
    for(const col of data.targetCols) {
        if(!targetCols.includes(col)) {
            for(let i = col; i < 25; i+=5) {
                touched.add(i);
            }
            targetCols.push(col);
        }
    }
    for(const col of targetCols) {
        if(!data.targetCols.includes(col)) {
            for(let i = col; i < 25; i+=5) {
                touched.add(i);
            }
            targetCols.splice(targetCols.indexOf(col), 1);
        }
    }
    
    for(const i of touched) {
        const y = Math.floor(i / 5);
        const x = i % 5;

        updateCell(result.grid[i], cells[y][x]);
    }
}