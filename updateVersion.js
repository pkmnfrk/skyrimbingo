const fs = require("fs");

const files = fs.readdirSync("./static");
const now = Date.now();

for(const file of files) {
    if(file.endsWith(".mjs") || file.endsWith(".html")) {
        let text = fs.readFileSync(`./static/${file}`, "utf-8");
        text = text.replace(/\?v=\d+/g, "?v=" + now);
        fs.writeFileSync(`./static/${file}`, text, "utf-8");
    }
}