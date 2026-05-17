const fs = require("fs");
const path = require("path");

const map = {
    "1001": "1060",
    "1002": "1106",
    "1003": "1023",
    "1004": "1149",
    "1005": "1141",
    "1006": "1046",
    "1007": "1087",
    "1008": "1020",
    "1009": "1021",
    "1010": "1045"
};

// Create a reverse map to do swaps
const fullMap = {};
for (const [k, v] of Object.entries(map)) {
    fullMap[k] = v;
    fullMap[v] = k;
}

const mockDataPath = path.join(__dirname, "../frontend/src/data/mock-data.js");
let mockData = fs.readFileSync(mockDataPath, "utf8");

// Replace id: "X" 
mockData = mockData.replace(/id:\s*"(\d+)"/g, (match, p1) => {
    if (fullMap[p1]) {
        return `id: "${fullMap[p1]}"`;
    }
    return match;
});

// Replace collegeId: "X" or collegeId: X
mockData = mockData.replace(/collegeId:\s*("?)(\d+)("?)/g, (match, quote1, p1, quote2) => {
    if (fullMap[p1]) {
        return `collegeId: ${quote1}${fullMap[p1]}${quote2}`;
    }
    return match;
});

fs.writeFileSync(mockDataPath, mockData);
console.log("Updated mock-data.js");

const seoPath = path.join(__dirname, "../backend/routes/seoRoutes.js");
if (fs.existsSync(seoPath)) {
    let seoData = fs.readFileSync(seoPath, "utf8");
    seoData = seoData.replace(/id:\s*(\d+)/g, (match, p1) => {
        if (fullMap[p1]) {
            return `id: ${fullMap[p1]}`;
        }
        return match;
    });
    fs.writeFileSync(seoPath, seoData);
    console.log("Updated seoRoutes.js");
}

