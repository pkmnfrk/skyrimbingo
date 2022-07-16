const fs = require("fs");

const files = fs.readdirSync("./static");
const now = Date.now();

let replacement = ".$1?v=" + now + '"';

if(process.argv[2] == "undo") {
    replacement = ".$1\"";
}

for(const file of files) {
    if(file.endsWith(".mjs") || file.endsWith(".html")) {
        let text = fs.readFileSync(`./static/${file}`, "utf-8");

        text = text.replace(/\.(css|mjs)(?:\?v=\d+)?"/g, replacement);

        fs.writeFileSync(`./static/${file}`, text, "utf-8");
    }   
}

