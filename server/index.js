const path = require("path");
const express = require("express");
const redis = require("redis");
const Notifications = require("./notifications");

const app = express();
const port = 3000;

const redisHost = process.env.REDIS_HOST || "redis";

const redisClient = redis.createClient({
    url: `redis://${redisHost}`,
});

const notifications = new Notifications(redisClient);

const host = process.env.HOSTNAME;

app.use(express.static(path.join(__dirname, "..", "static")));
app.use(express.json());

app.get("/data/:level/:seed/:uniquifier/:player/subscribe", async (req, res) => {
    if(
        !validateEnum(res, req.params, "level", ["easy", "normal", "hard"]) ||
        !validateNumber(res, req.params, "seed") ||
        !validateNumber(res, req.params, "uniquifier") ||
        !validateExists(res, req.params, "player")
    ) {
        return;
    }

    const level = req.params.level;
    const seed = req.params.seed;
    const uniquifier = req.params.uniquifier;
    const player = req.params.player;
    const key = `${level}/${seed}/${uniquifier}`;

    

    const cb = async () => {
        // console.log(host, "received message:", message);
        const data = await getData(key);
        res.write("data: " + JSON.stringify(filterDataForPlayer(data, player)) + "\n\n");
    };

    notifications.subscribe(key, cb);

    res.status(200);
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();
    
    res.write("retry: 2000\n\n");

    res.on("close", () => {
        notifications.unsubscribe(key, cb);
    });
});

app.get("/data/:level/:seed/:uniquifier/:player", async (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const uniquifier = req.params.uniquifier;
    const player = req.params.player;
    const key = `${level}/${seed}/${uniquifier}`;

    res.send(filterDataForPlayer(await getData(key), player));
});

app.post("/data/:level/:seed/:uniquifier/:player", async (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const uniquifier = req.params.uniquifier;
    const player = req.params.player;
    const key = `${level}/${seed}/${uniquifier}`;

    const data = await getData(key);

    if("goal" in req.body) {
        if(!validateNumber(res, req.body, "goal") || !validateNumber(res, req.body, "value")) {
            return;
        }
        if(!data.goals[req.body.goal]) {
            data.goals[req.body.goal] = {};
        }

        data.goals[req.body.goal][player] = req.body.value;
    } else if("targetRow" in req.body) {
        if(!validateNumber(res, req.body, "targetRow") || !validateNumber(res, req.body, "value")) {
            return;
        }
        if(!data.targetRows[player]) {
            data.targetRows[player] = [];
        }

        toggleArrayItem(data.targetRows[player], req.body.targetRow, req.body.value);
    } else if("targetCol" in req.body) {
        if(!validateNumber(res, req.body, "targetCol") || !validateNumber(res, req.body, "value")) {
            return;
        }
        
        if(!data.targetCols[player]) {
            data.targetCols[player] = [];
        }

        toggleArrayItem(data.targetCols[player], req.body.targetCol, req.body.value);
    } else if("rule" in req.body) {
        if(!validateEnum(req, req.body, "rule", ["lockout"])) {
            return;
        } 

        data.rules[req.body.rule] = req.body.value;
    }

    // console.log(host, "sending message");

    await setData(key, data);

    res.status(200);
    res.send({ok: true});

    await notifications.send(key, "");

});

function validateNumber(res, obj, key) {
    if(typeof obj[key] !== "number" && parseInt(obj[key], 10).toString() != obj[key]) {
        res.status(400);
        res.send({ok: false, field: key, message: "Expected number"})
        return false;
    }
    return true;
}


function validateExists(res, obj, key) {
    if(!(key in obj)) {
        res.status(400);
        res.send({ok: false, field: key, message: "Expected value"})
        return false;
    }
    return true;
}

function validateEnum(res, obj, key, validValues) {
    if(typeof obj[key] !== "string" || validValues.indexOf(obj[key]) === -1) {
        res.status(400);
        res.send({ok: false, field: key, message: "Expected string from " + "[" + validValues.join(", ") + "]"})
        return false;
    }

    return true;
}

app.on("error", (e) => {
    console.error("Error", e);
})

redisClient.connect().then(async () => {
    await notifications.start();

    app.listen(port, "0.0.0.0", () => {
        console.log("Server started");
    });
}).catch(e => {
    console.error("Error connecting to redis", e);
});



async function getData(key) {
    let d = await redisClient.get(key);
    
    if(!d) {
        d = {
            goals: [],
            targetRows: {},
            targetCols: {},
            rules: {},
        };
        await setData(key, d);
        return d;
    }

    d = JSON.parse(d);
    if(Array.isArray(d.targetRows)) {
        d.targetRows = {};
    }
    if(Array.isArray(d.targetCols)) {
        d.targetCols = {};
    }
    if(!d.rules) {
        d.rules = {};
    }
    return d;
}

async function setData(key, data) {
    await redisClient.set(key, JSON.stringify(data), {
        EX: 60 * 60 * 48 // 48 hour expiry
    })
}

function toggleArrayItem(array, item, value) {
    const ix = array.indexOf(item);
    if(value && ix === -1) {
        array.push(item);
    } else if(!value && ix !== -1) {
        array.splice(ix, 1);
    }
}

function filterDataForPlayer(data, player) {
    return {
        goals: data.goals,
        targetCols: data.targetCols[player] ?? [],
        targetRows: data.targetRows[player] ?? [],
        rules: data.rules,
    }
}