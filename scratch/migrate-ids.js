const fs = require("fs");
const path = require("path");

const mockDataPath = path.join(__dirname, "../frontend/src/data/mock-data.js");
let mockData = fs.readFileSync(mockDataPath, "utf8");

// Replace id: "X" to id: "X+1000" where X is 1 to 260
mockData = mockData.replace(/id:\s*"(\d+)"/g, (match, p1) => {
    const idNum = parseInt(p1, 10);
    if (idNum >= 1 && idNum <= 999) { // Safety check to prevent double mapping
        return `id: "${idNum + 1000}"`;
    }
    return match;
});

// Replace collegeId: "X" or collegeId: X
mockData = mockData.replace(/collegeId:\s*("?)(\d+)("?)/g, (match, quote1, p1, quote2) => {
    const idNum = parseInt(p1, 10);
    if (idNum >= 1 && idNum <= 999) {
        return `collegeId: ${quote1}${idNum + 1000}${quote2}`;
    }
    return match;
});

fs.writeFileSync(mockDataPath, mockData);
console.log("Updated mock-data.js");

const seoPath = path.join(__dirname, "../backend/routes/seoRoutes.js");
if (fs.existsSync(seoPath)) {
    let seoData = fs.readFileSync(seoPath, "utf8");
    seoData = seoData.replace(/id:\s*(\d+)/g, (match, p1) => {
        const idNum = parseInt(p1, 10);
        if (idNum >= 1 && idNum <= 999) {
            return `id: ${idNum + 1000}`;
        }
        return match;
    });
    fs.writeFileSync(seoPath, seoData);
    console.log("Updated seoRoutes.js");
} else {
    console.log("seoRoutes.js not found at " + seoPath);
}

