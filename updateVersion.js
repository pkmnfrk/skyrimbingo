const fs = require("fs");

const files = fs.readdirSync(".");
const now = Date.now();

for(const file of files) {
    if(file.endsWith(".mjs") || file.endsWith(".html")) {
        let text = fs.readFileSync(file, "utf-8");
        text = text.replace(/\?v=\d+/g, "?v=" + now);
        fs.writeFileSync(file, text, "utf-8");
    }
}