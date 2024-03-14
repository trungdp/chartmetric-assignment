const input = [
  {
    id: 1293487,
    name: "KCRW", // radio station callsign
    tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }],
  },
  {
    id: 12923,
    name: "KQED",
    tracks: [
      { timestp: "2021-04-09", trackName: "Savage" },
      { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
    ],
  },
  {
    id: 4,
    name: "WNYC",
    tracks: [
      { timestp: "2021-04-09", trackName: "Captain Hook" },
      { timestp: "2021-04-08", trackName: "Captain Hook" },
      { timestp: "2021-04-07", trackName: "Captain Hook" },
    ],
  },
];


const transform = (input) => {
  // Step 1: Efficiently aggregate track plays by date and track name
  const playsByDate = {};
  input.forEach((station) => {
    station.tracks.forEach((track) => {
      if (!playsByDate[track.timestp]) {
        playsByDate[track.timestp] = { totalSpins: 0, tracks: {} };
      }
      if (!playsByDate[track.timestp].tracks[track.trackName]) {
        playsByDate[track.timestp].tracks[track.trackName] = 0;
      }
      playsByDate[track.timestp].tracks[track.trackName] += 1;
      playsByDate[track.timestp].totalSpins += 1;
    });
  });

  // Step 2: Convert playsByDate to an array and sort by date
  const dates = Object.keys(playsByDate);
  dates.sort(); // Sort dates in ascending order

  // Step 3: Format the sorted data into the desired output
  const data = dates.map((date) => {
    const dateInfo = playsByDate[date];
    let tooltipString = ""; // Build a string to display in the tooltip
    for (let trackName in dateInfo.tracks)
      tooltipString += `, ${trackName} (${dateInfo.tracks[trackName]})`;
    const tooltip = tooltipString.substring(2); // Remove leading comma and space
    return { x: date, y: dateInfo.totalSpins, tooltip };
  });

  return data;
}

console.log(transform(input));
