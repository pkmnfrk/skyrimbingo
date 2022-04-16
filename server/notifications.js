
class Notifications {
    constructor(redisClient) {
        this.redisMain = redisClient;
        this.redisSubscription = redisClient.duplicate();
        this.subscriptions = {};
    }

    async start() {
        await this.redisSubscription.connect();
        await this.redisSubscription.subscribe("update", (message) => {
            const [key, body] = message.split("\r\n");

            let list = this.subscriptions[key];
            if(list) {
                list = [...list];
            
                for(const cb of list) {
                    cb(body);
                }
            }
        });
    }

    async send(key, body) {
        const message = `${key}\r\n${body}`;
        await this.redisMain.publish("update", message);
    }

    subscribe(key, cb) {
        if(!this.subscriptions[key]) {
            this.subscriptions[key] = [];
        }

        this.subscriptions[key].push(cb);
    }

    unsubscribe(key, cb) {
        if(!this.subscriptions[key]) {
            return;
        }

        const ix = this.subscriptions[key].indexOf(cb);
        if(ix !== -1) {
            this.subscriptions[key].splice(ix, 1);
        }

        if(!this.subscriptions[key].length) {
            delete this.subscriptions[key];
        }

    }
}

module.exports = Notifications;