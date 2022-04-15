const path = require("path");
const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

const redisClient = redis.createClient({
    url: "redis://redis",
});

/**
 * @type {Object.<string, {goals: number[], targetRows: number[], targetCols: number[]}>}
 */
const data = {}; 

const host = process.env.HOSTNAME;

app.use(express.static(path.join(__dirname, "..", "static")));
app.use(express.json());

app.get("/data/:level/:seed", (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const key = `${level}/${seed}`;

    res.send(getData(key));
});

app.get("/data/:level/:seed/subscribe", async (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const key = `${level}/${seed}`;

    const subscriber = redisClient.duplicate();

    await subscriber.connect();

    await subscriber.subscribe(key, (message) => {
        console.log(host, "received message:", message);
        res.write("data: " + message + "\n\n");
    });

    res.status(200);
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();
    
    res.write("retry: 10000\n\n");

    res.on("close", () => {
        subscriber.quit().catch(e => {
            console.error("Error while ending subscription", e);
        });
    });
});

app.post("/data/:level/:seed", (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const key = `${level}/${seed}`;

    const data = getData(key);

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

    //notifyListeners(key);
    console.log(host, "sending message");
    redisClient.publish(key, JSON.stringify(data));

});

function validateNumber(res, obj, key) {
    if(typeof obj[key] !== "number") {
        res.status(400);
        res.send({ok: false, field: key, message: "Expected number"})
        return false;
    }
    return true;
}

app.on("error", (e) => {
    console.error("Error", e);
})

redisClient.connect().then(() => {
    app.listen(port, "0.0.0.0", () => {
        console.log("Server started");
    });
}).catch(e => {
    console.error("Error connecting to redis", e);
});



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