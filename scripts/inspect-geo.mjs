import fs from "fs";
import path from "path";

const raw = JSON.parse(
  fs.readFileSync(path.join("scripts", "_sub.geojson"), "utf8"),
);

console.log("features:", raw.features.length);
console.log("sample:", raw.features[0]?.properties);
const names = raw.features.map((f) => f.properties.name).sort();
console.log("first 10 names:", names.slice(0, 10));
