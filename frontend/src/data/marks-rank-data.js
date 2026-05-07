// TG EAPCET Normalization Marks vs Rank Band Data
// Source: Official TG EAPCET 2026 Convener Disclaimer

export const marksRankData = {
  2025: [
    { minMarks: 80, maxMarks: 160, engRankLow: 1, engRankHigh: 2613, agRankLow: 1, agRankHigh: 2726 },
    { minMarks: 75, maxMarks: 79.99, engRankLow: 2614, engRankHigh: 3995, agRankLow: 2727, agRankHigh: 4628 },
    { minMarks: 70, maxMarks: 74.99, engRankLow: 3996, engRankHigh: 6104, agRankLow: 4629, agRankHigh: 7182 },
    { minMarks: 65, maxMarks: 69.99, engRankLow: 6105, engRankHigh: 9226, agRankLow: 7183, agRankHigh: 10536 },
    { minMarks: 60, maxMarks: 64.99, engRankLow: 9227, engRankHigh: 14418, agRankLow: 10537, agRankHigh: 15011 },
    { minMarks: 55, maxMarks: 59.99, engRankLow: 14419, engRankHigh: 24028, agRankLow: 15012, agRankHigh: 21744 },
    { minMarks: 50, maxMarks: 54.99, engRankLow: 24029, engRankHigh: 44121, agRankLow: 21745, agRankHigh: 32151 },
    { minMarks: 45, maxMarks: 49.99, engRankLow: 44122, engRankHigh: 82343, agRankLow: 32152, agRankHigh: 46572 },
    { minMarks: 40, maxMarks: 44.99, engRankLow: 82344, engRankHigh: 135462, agRankLow: 46573, agRankHigh: 61764 },
  ],
  2024: [
    { minMarks: 80, maxMarks: 160, engRankLow: 1, engRankHigh: 3706, agRankLow: 1, agRankHigh: 4435 },
    { minMarks: 75, maxMarks: 79.99, engRankLow: 3707, engRankHigh: 5459, agRankLow: 4436, agRankHigh: 7012 },
    { minMarks: 70, maxMarks: 74.99, engRankLow: 5460, engRankHigh: 8076, agRankLow: 7013, agRankHigh: 10756 },
    { minMarks: 65, maxMarks: 69.99, engRankLow: 8077, engRankHigh: 12047, agRankLow: 10757, agRankHigh: 15531 },
    { minMarks: 60, maxMarks: 64.99, engRankLow: 12048, engRankHigh: 18355, agRankLow: 15532, agRankHigh: 21633 },
    { minMarks: 55, maxMarks: 59.99, engRankLow: 18356, engRankHigh: 29789, agRankLow: 21634, agRankHigh: 30061 },
    { minMarks: 50, maxMarks: 54.99, engRankLow: 29790, engRankHigh: 53970, agRankLow: 30062, agRankHigh: 42065 },
    { minMarks: 45, maxMarks: 49.99, engRankLow: 53971, engRankHigh: 102397, agRankLow: 42066, agRankHigh: 57758 },
    { minMarks: 40, maxMarks: 44.99, engRankLow: 102398, engRankHigh: 164862, agRankLow: 57759, agRankHigh: 73390 },
  ],
};

export function predictRankFromMarks(marks, stream) {
  const results = [];
  
  for (const [year, bands] of Object.entries(marksRankData)) {
    const band = bands.find(b => marks >= b.minMarks && marks <= b.maxMarks);
    if (band) {
      const isEng = stream === 'engineering';
      results.push({
        year: parseInt(year),
        rankLow: isEng ? band.engRankLow : band.agRankLow,
        rankHigh: isEng ? band.engRankHigh : band.agRankHigh,
        marksRange: `${band.minMarks} and above`,
      });
    }
  }

  // Predicted (average of both years)
  if (results.length === 2) {
    let avgLow = Math.round((results[0].rankLow + results[1].rankLow) / 2);
    let avgHigh = Math.round((results[0].rankHigh + results[1].rankHigh) / 2);

    // Rounding to 'round figures' to look like an estimate
    const roundToFigure = (val) => {
      if (val <= 1) return 1;
      if (val < 5000) return Math.round(val / 100) * 100;
      if (val < 20000) return Math.round(val / 500) * 500;
      return Math.round(val / 1000) * 1000;
    };

    results.push({
      year: 2026,
      rankLow: roundToFigure(avgLow),
      rankHigh: roundToFigure(avgHigh),
      marksRange: results[0].marksRange,
      isPredicted: true,
    });
  }

  return results;
}
