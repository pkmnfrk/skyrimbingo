import {makeGrid} from "./grid.mjs?1";

let param = window.location.search;

if(param && param.indexOf("?") === 0) {
    param = param.substring(1);
}

let [level, seed] = param.split("/");

if(!level) {
    level = "normal";
}
if(!/^\d+$/.test(seed)) {
    seed = Math.floor(Math.random() * 1000000000) + 1;
    seed = seed.toString();
}

window.history.replaceState({}, "", "?" + level + "/" + seed);

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

document.getElementById("board_small").addEventListener("click", () => resizeBoard("small"));
document.getElementById("board_medium").addEventListener("click", () => resizeBoard("medium"));
document.getElementById("board_large").addEventListener("click", () => resizeBoard("large"));

// alert(JSON.stringify(grid));

/**
 * 
 * @param {object} goal 
 * @param {Element} div 
 * @param {MouseEvent} ev 
 */
function onCellMouseUp(goal, div, ev) {
    ev.preventDefault();
    if(div.timer) {
        console.log("Clearing timer");
        clearTimeout(div.timer);
        div.timer = null;
    }
    if(div.locked) {
        div.locked = false;
        return;
    }

    if(goal.incremental) {
        if((!("button" in ev) || ev.button === 0) && goal.completed < goal.value) {
            goal.completed += 1;
        } else if(ev.button === 2 && goal.completed > 0) {
            goal.completed -= 1;
        }
    } else {
        goal.completed = goal.completed ? 0 : 1;
    }
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
    if(goal.incremental) {
        console.log("Setting timer");
        div.timer = setTimeout(() => {
            console.log("Timer fired");
            div.timer = null;
            div.locked = true;
            if(goal.completed > 0) {
                goal.completed -= 1;
            }
            updateCell(goal, div);
        }, 500);
    }
}

function onGoalMouseUp(isRow, i) {
    if(isRow) {
        if(targetRows.includes(i)) {
            targetRows.splice(targetRows.indexOf(i));
        } else {
            targetRows.push(i);
        }
        
        for(let x = 0; x < 5; x++) {
            updateCell(result.grid[5 * i + x], cells[i][x]);
        }
    } else {
        if(targetCols.includes(i)) {
            targetCols.splice(targetCols.indexOf(i));
        } else {
            targetCols.push(i);
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

function resizeBoard(size) {
    const grid = document.getElementById("grid");
    grid.classList.remove("large", "medium", "small");

    grid.classList.add(size);
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