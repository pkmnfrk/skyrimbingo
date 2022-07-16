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

app.get("/data/:level/:seed/:uniquifier", async (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const uniquifier = req.params.uniquifier;
    const key = `${level}/${seed}/${uniquifier}`;

    res.send(await getData(key));
});

app.get("/data/:level/:seed/:uniquifier/subscribe", async (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const uniquifier = req.params.uniquifier;
    const key = `${level}/${seed}/${uniquifier}`;

    const cb = (message) => {
        // console.log(host, "received message:", message);
        res.write("data: " + message + "\n\n");
    };

    notifications.subscribe(key, cb);

    res.status(200);
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();
    
    res.write("retry: 10000\n\n");

    res.on("close", () => {
        notifications.unsubscribe(key, cb);
    });
});

app.post("/data/:level/:seed/:uniquifier", async (req, res) => {
    const level = req.params.level;
    const seed = req.params.seed;
    const uniquifier = req.params.uniquifier;
    const key = `${level}/${seed}/${uniquifier}`;

    const data = await getData(key);

    if("goal" in req.body) {
        if(!validateNumber(res, req.body, "goal") || !validateNumber(res, req.body, "value")) {
            return;
        }
        if(!data.goals[req.body.goal]) {
            data.goals[req.body.goal] = {};
        }
        
        data.goals[req.body.goal][req.body.player] = req.body.value;
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

    // console.log(host, "sending message");

    await Promise.all([
        setData(key, data),
        notifications.send(key, JSON.stringify(data)),
    ])

    res.status(200);
    res.send({ok: true});

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
            targetRows: [],
            targetCols: [],
        };
        await setData(key, d);
        return d;
    }

    return JSON.parse(d);
}

async function setData(key, data) {
    await redisClient.set(key, JSON.stringify(data), {
        EX: 60 * 60 * 48 // 48 hour expiry
    })
}