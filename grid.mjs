import { goals } from "./goals.mjs?v=1649707570775";

function* shuffleArray(rng, array, take, filter) {
    const tempArray = [...array];
    const ret = [];
    if(!take) {
        take = array.length;
    }

    while(tempArray.length && take > 0) {
        const ix = Math.floor(rng() * tempArray.length);
        const item = tempArray.splice(ix, 1)[0];

        yield item;
    }
}

function pickValue(rng, goal, level) {
    let value;
    let difficulty;

    const step = goal.stepvalue || 1;
    const min = goal.minvalue / step;
    
    const max = goal.maxvalue / step;
    const spread = max - min;

    value = Math.floor(rng() * spread);

    if(level === "easy") { // roll twice and take lower
        const again = Math.floor(rng() * spread);
        if(again < value) {
            value = again;
        }
    } else if(level === "hard") { // roll twice and take higher
        const again = Math.floor(rng() * spread);
        if(again > value) {
            value = again;
        }
    }

    const perc = value / spread;
    difficulty = goal.mindifficulty + Math.round(perc * (goal.maxdifficulty - goal.mindifficulty));

    value += min;
    value *= step;

    return [value, difficulty];
}

function createGoalItem(rng, goal, level) {
    const mindifficulty = level === "hard" ? 3 : 0;
    const maxdifficulty = level === "easy" ? 3 : 9999;

    if(goal.mindifficulty > maxdifficulty) {
        return null;
    }

    if(goal.maxdifficulty < mindifficulty) {
        return null;
    }

    let value = 0;
    let difficulty = goal.mindifficulty
    

    if(goal.minvalue !== goal.maxvalue) {
        let tries = 100;
        do {
            tries--;
            if(tries === 1) {
                debugger;
            }
            [value, difficulty] = pickValue(rng, goal, level);
        } while(tries > 0 && (difficulty < mindifficulty || difficulty > maxdifficulty));
        
        if(tries <= 0) {
            return null;
        }
    }
    return {
        goal: goal.goal,
        note: goal.note,
        value,
        difficulty,
        completed: 0,
        incremental: goal.incremental,
    };
}


export function makeGrid(seed, width, height, level) {
    const rng = new Math.seedrandom(seed);

    const grid = [];

    let filter = null;
    let x = 0, y = 0;
    for(const goal of shuffleArray(rng, goals, filter)) {
        if(grid.length >= width * height) {
            break;
        }
        
        const item = createGoalItem(rng, goal, level);
        if(item) {
            item.x = x;
            item.y = y;
            grid.push(item);

            x += 1;
            if(x >= width) {
                x = 0;
                y += 1;
            }
        }
    }

    return grid;
}