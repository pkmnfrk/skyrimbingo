const path = require("path");
const express = require("express");

const app = express();
const port = 3000;

/**
 * @type {Object.<string, {goals: number[], targetRows: number[], targetCols: number[]}>}
 */
const data = {};

const listeners = {};

app.use(express.static(path.join(__dirname, "..", "static")));
app.use(express.json());

app.get("/data/:level/:seed", (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const key = `${level}/${seed}`;

    let time = parseInt(req.query.time, 10);

    if(time !== 0 && time < 1000) {
        time = 1000;
    }
    if(time > 60000) {
        time = 60000;
    }
    let timeout = null;

    const cb = () => {
        if(timeout) {
            clearTimeout(timeout);
        }
        removeListener(key, cb);
        res.send(getData(key));
    };

    if(time) {
        timeout = setTimeout(() => {
            cb();
        }, time);

        addListener(key, cb);
    } else {
        cb();
    }
});

app.get("/data/:level/:seed/subscribe", (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const key = `${level}/${seed}`;

    res.status(200);
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();
    
    res.write("retry: 10000\n\n");

    const cb = () => {
        res.write("data: " + JSON.stringify(getData(key)) + "\n\n");
        // console.log("Sent event");
    };    

    res.on("close", () => {
        removeListener(key, cb);
    })

    addListener(key, cb);
});

app.post("/data/:level/:seed", (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const key = `${level}/${seed}`;

    const data = getData(key);

    
    /*
    {
        "goal": 4,
        "value": 1,
    }
    */

    if("goal" in req.body) {
        if(!validateNumber(res, req.body, "goal") || !validateNumber(res, req.body, "value")) {
            return;
        }
        data.goals[req.body.goal] = req.body.value;
    } else if("targetRow" in req.body) {
        if(!validateNumber(res, req.body, "targetRow") || !validateNumber(res, req.body, "value")) {
            return;
        }
        const ix = data.targetRows.indexOf(req.body.targetRow);
        if(req.body.value && ix === -1) {
            data.targetRows.push(req.body.targetRow);
        } else if(!req.body.value && ix !== -1) {
            data.targetRows.splice(ix, 1);
        }
    } else if("targetCol" in req.body) {
        if(!validateNumber(res, req.body, "targetCol") || !validateNumber(res, req.body, "value")) {
            return;
        }
        const ix = data.targetCols.indexOf(req.body.targetCol);
        if(req.body.value && ix === -1) {
            data.targetCols.push(req.body.targetCol);
        } else if(!req.body.value && ix !== -1) {
            data.targetCols.splice(ix, 1);
        }
    }

    res.status(200);
    res.send({ok: true});

    notifyListeners(key);

});

function validateNumber(res, obj, key) {
    if(typeof obj[key] !== "number") {
        res.status(400);
        res.send({ok: false, field: key, message: "Expected number"})
        return false;
    }
    return true;
}


app.listen(port, "0.0.0.0", () => {
    console.log("Server started");
});

app.on("error", (e) => {
    console.error("Error", e);
})

function getData(key) {
    if(!data[key]) {
        data[key] = {
            goals: [],
            targetRows: [],
            targetCols: [],
        }
    }

    return data[key];
}

function addListener(key, cb) {
    if(!listeners[key]) {
        listeners[key] = [];
    }

    // console.log("Adding listener for", key);

    listeners[key].push(cb);
}

function removeListener(key, cb) {
    if(!listeners[key]) {
        listeners[key] = [];
    }

    const ix = listeners[key].indexOf(cb);
    if(ix !== -1) {
        // console.log("Removing listener for", key);
        listeners[key].splice(ix, 1);
    }
}

function notifyListeners(key) {
    if(!listeners[key]) {
        return;
    }

    for(const l of listeners[key]) {
        process.nextTick(l);
    }
}