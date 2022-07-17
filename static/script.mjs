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
if(!player) {
    player = "";
}

window.history.replaceState({}, "", `?${level}/${seed}/${uniqifier}${player ? "/" + encodeURIComponent(player) : ""}`);

//const result = await (await fetch("./grid?seed=" + seed + "&level=" + level)).json();

const result = {
    grid: makeGrid(seed, 5, 5, level),
    rules: {},
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

document.getElementById("enable_lockout").addEventListener("click", enableLockout);
document.getElementById("disable_lockout").addEventListener("click", disableLockout);


// alert(JSON.stringify(grid));


async function doRefresh() {
    const eventSource = new EventSource("./data/" + level + "/" + seed + "/" + uniqifier + "/subscribe");
    eventSource.addEventListener("message", (data) => {
        console.log("Got data", data);
        refreshData(JSON.parse(data.data));
    });
    eventSource.addEventListener("error", (e) => {
        console.error(e);
    })
    eventSource.addEventListener("open", (e) => {
        getData();
    });
}

//getData().then(doRefresh);
doRefresh();


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

    if(!(player in goal.completed)) {
        goal.completed[player] = 0;
    }

    if(goal.incremental) {
        if(!isNeg && goal.completed[player] < goal.value) {
            goal.completed[player] += 1;
        } else if(isNeg && goal.completed[player] > 0) {
            goal.completed[player] -= 1;
        }
    } else {
        if(isNeg) {
            goal.completed[player] = 0;
        } else {
            goal.completed[player] = 1;
        }
    }
    notifyGoal(result.grid.indexOf(goal), goal.completed[player]);
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
    window.location.assign(`?${level}/*/*${player ? "/" + player : ""}`);
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
        let myCount = goal.completed[player] ?? 0;
        let otherCount = otherPlayerCount(goal.completed);

        if(goal.incremental && goal.value > 1) {
            count = myCount + "/" + count;
            if(myCount >= goal.value) {
                div.classList.add("completed");
            }

            if(otherCount >= goal.value) {
                div.classList.add("other-completed");
            }
        } else {
            if(myCount) {
                div.classList.add("completed");
            }
            if(otherCount) {
                div.classList.add("other-completed");
            }
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

const notifyRequest = new Request("./data/" + level + "/" + seed + "/" + uniqifier , {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
})

async function notifyServer(body) {
    let retryInterval = 1500;
    for(let t = 0; t < 3; t++) {
        try {
            const request = new Request(notifyRequest, {
                body: JSON.stringify(body)
            });
            
            const result = await (await fetch(request)).json();

            if(!result.ok) {
                console.error(result);
            }
            return result;
        } catch(e) {
            console.error(e);
            await delay(retryInterval);
            retryInterval *= 2;
        }
    }
}

function delay(timeMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    })
}

function notifyGoal(i, value) {
    return notifyServer({
        goal: i,
        player,
        value,
    })
}

function notifyRule(rule, value) {
    return notifyServer({rule, value});
}


function notifyTargetRow(i, value) {
    return notifyServer({
        targetRow: i,
        player,
        value: value ? 1 : 0,
    });
}

function notifyTargetCol(i, value) {
    return notifyServer({
        targetCol: i,
        player,
        value: value ? 1 : 0,
    });
}

async function getData() {
    const data = await(await fetch("./data/" + level + "/" + seed + "/" + uniqifier + "?time=0")).json();
    await refreshData(data);
}

async function pollData() {
    const data = await(await fetch("./data/" + level + "/" + seed + "/" + uniqifier + "?time=60000")).json();
    await refreshData(data);
}

async function refreshData(data) {
    const touched = new Set();

    for(let i = 0; i < result.grid.length; i++) {
        if(data.goals[i] && !deepEquals(data.goals[i], result.grid[i].completed)) {
            result.grid[i].completed = data.goals[i];
            touched.add(i);
        }
    }

    const dataRows = data.targetRows[player] ?? [];
    for(const row of dataRows) {
        if(!targetRows.includes(row)) {
            for(let i = row * 5; i < (row + 1) * 5; i++) {
                touched.add(i);
            }
            targetRows.push(row);
        }
    }
    for(const row of targetRows) {
        if(!dataRows.includes(row)) {
            for(let i = row * 5; i < (row + 1) * 5; i++) {
                touched.add(i);
            }
            targetRows.splice(targetRows.indexOf(row), 1);
        }
    }
    
    const dataCols = data.targetCols[player] ?? [];
    for(const col of dataCols) {
        if(!targetCols.includes(col)) {
            for(let i = col; i < 25; i+=5) {
                touched.add(i);
            }
            targetCols.push(col);
        }
    }
    for(const col of targetCols) {
        if(!dataCols.includes(col)) {
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

    if(result.rules.lockout != data.rules.lockout) {
        document.getElementById("enable_lockout").style.display = data.rules.lockout ? "none" : "inline-block";
        document.getElementById("disable_lockout").style.display = data.rules.lockout ? "inline-block": "none";
    }

    result.rules = data.rules;
}

function otherPlayerCount(completed) {
    let c = 0;
    for(const p of Object.keys(completed)) {
        if(p === player) continue;
        if(completed[p] > c) {
            c = completed[p];
        }
    }
    return c;
}

function deepEquals(a, b) {
    if(a === b) return true;
    
    if(typeof a != typeof b) return false;

    if(a == null || b == null) {
        return false;
    }

    if(Array.isArray(a) && Array.isArray(b)) {
        if(a.length != b.length) return false;

        for(let i = 0; i < a.length; i++) {
            if(!deepEquals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }

    if(typeof a === "object") {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if(!deepEquals(keysA, keysB)) return false;

        for(const key of keysA) {
            if(!deepEquals(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }
}

function enableLockout() {
    notifyRule("lockout", true);
}

function disableLockout() {
    notifyRule("lockout", false);
}

