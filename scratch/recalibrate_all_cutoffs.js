const fs = require('fs');
const path = require('path');

const mockDataPath = path.resolve(__dirname, '../frontend/src/data/mock-data.js');
const m = require(mockDataPath);

let content = fs.readFileSync(mockDataPath, 'utf8');

// 1. Finely tuned EAPCET Base CSE OC Male Cutoff Rank Formula
function getBaseCSECutoff(rating, tier) {
    // Determine tier if not defined
    const t = tier || (rating >= 4.5 ? 1 : rating >= 4.0 ? 2 : 3);
    
    if (rating >= 4.7) {
        // JNTUH, OUCE
        return Math.round(500 + (5.0 - rating) * 2000); 
    }
    if (rating >= 4.5) {
        // CBIT, VNR, Vasavi, BVRIT, GNITS, KMIT
        return Math.round(1500 + (4.7 - rating) * 10000); 
    }
    if (rating >= 4.3) {
        // GRIET, MGIT, MJCET, Vardhaman, IARE, KMEC
        return Math.round(4000 + (4.5 - rating) * 15000); 
    }
    if (rating >= 4.1) {
        // CMR, Sreyas, Geethanjali, VBIT, VJIT, MLRIT
        return Math.round(8000 + (4.3 - rating) * 40000); 
    }
    if (rating >= 3.9) {
        // CMREC, Lords, Methodist, Nawab Shah Alam
        return Math.round(18000 + (4.1 - rating) * 70000); 
    }
    if (rating >= 3.6) {
        return Math.round(32000 + (3.9 - rating) * 100000); 
    }
    return Math.round(55000 + (3.6 - rating) * 120000); 
}

const BRANCH_MULTIPLIERS = {
    "CSE": 1.0,
    "CSE (AI & ML)": 1.15,
    "AI & DS": 1.15,
    "CSE (Cyber Security)": 1.2,
    "Data Science": 1.2,
    "IT": 1.3,
    "ECE": 1.5,
    "EEE": 2.5,
    "CIVIL": 3.2,
    "MECH": 3.5
};

const CAT_MULTIPLIERS = {
    "OC": { Male: 1.0, Female: 1.12 },
    "EWS": { Male: 1.2, Female: 1.3 },
    "BC-A": { Male: 2.5, Female: 2.8 },
    "BC-B": { Male: 1.6, Female: 1.8 },
    "BC-C": { Male: 1.8, Female: 2.0 },
    "BC-D": { Male: 1.7, Female: 1.9 },
    "BC-E": { Male: 2.2, Female: 2.5 },
    "SC": { Male: 4.0, Female: 4.5 },
    "ST": { Male: 5.0, Female: 5.5 }
};

// 2. Generate EAPCET branch cutoffs block for all colleges
let block = '';

for (const c of m.colleges) {
    const isWomenOnly = c.type === 'women' || c.name.toLowerCase().includes('women');
    const baseCSE = getBaseCSECutoff(c.rating || 4.0, c.tier);

    block += `  // ================= ${c.name.split(' (')[0]} (ID: ${c.id}) =================\n`;
    block += `  collegeId = "${c.id}";\n`;
    block += `  collegeName = "${c.name.split(' (')[0]}";\n\n`;

    for (const [branch, bMult] of Object.entries(BRANCH_MULTIPLIERS)) {
        block += `  addBranch("${branch}", {\n`;
        for (const [cat, gMults] of Object.entries(CAT_MULTIPLIERS)) {
            // Male cutoff calculation
            let mEnd = Math.round(baseCSE * bMult * gMults.Male);
            const maxMaleRank = (cat === 'SC' || cat === 'ST') ? 140000 : 120000;
            if (mEnd > maxMaleRank) mEnd = maxMaleRank;
            let mStart = Math.round(mEnd * 0.6);

            // Female cutoff calculation
            let fEnd = Math.round(baseCSE * bMult * gMults.Female);
            const maxFemaleRank = (cat === 'SC' || cat === 'ST') ? 145000 : 125000;
            if (fEnd > maxFemaleRank) fEnd = maxFemaleRank;
            let fStart = Math.round(fEnd * 0.6);

            if (isWomenOnly) {
                block += `    "${cat}": { Male: [0, 0], Female: [${fStart}, ${fEnd}] },\n`;
            } else {
                block += `    "${cat}": { Male: [${mStart}, ${mEnd}], Female: [${fStart}, ${fEnd}] },\n`;
            }
        }
        block += `  });\n\n`;
    }
}

// 3. Perform surgical search & replace in mock-data.js
const startMarker = '  // ================= JNTU =================';
const endMarker = '  // ================= SORT =================';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found! Start:', startIndex, 'End:', endIndex);
    process.exit(1);
}

const newContent = content.slice(0, startIndex) + block + content.slice(endIndex);

fs.writeFileSync(mockDataPath, newContent, 'utf8');
console.log('Successfully recalibrated EAPCET cutoffs for all colleges!');
