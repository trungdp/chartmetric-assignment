# Coding Exercise: JS Data Transformation

## Overview

Below, we have a sample API response of tracks played on different days across various radio stations. Each track object represents a single play of that track.

We want to graph the playcounts for each day in a vertical bar chart, where the x-axis represents the day, and the y-axis represents the cumulative radio plays of all tracks for that day. Further, when a user hovers over one of the bars, we want to display a tooltip that lists the different tracks that were played on that day across all radio stations, and the playcounts for each track.

## Sample API Response

```jsx
const response = [
  {
    id: 1293487,
    name: "KCRW",  // radio station callsign
    tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }]
  },
  {
    id: 12923,
    name: "KQED",
    tracks: [
      { timestp: "2021-04-09", trackName: "Savage" },
      { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" }
    ]
  },
  {
    id: 4,
    name: "WNYC",
    tracks: [
      { timestp: "2021-04-09", trackName: "Captain Hook" },
      { timestp: "2021-04-08", trackName: "Captain Hook" },
      { timestp: "2021-04-07", trackName: "Captain Hook" }
    ]
  }
];
```

## Desired Data Format

To pass this information into our charting library, we will need to reformat the data returned by our API response into a format our charting library can use.

The structure we are looking for is an array of objects, where each object has three properties:

```jsx
const data = [
 {
   x: day,           // day
   y: total_spins,   // total spins for all tracks on this day
   tooltip: formatted_tooltip
     // tooltip is a string value with the list of track names that 
     // were played that day followed with the number of times that 
		 // track was played in parenthensis, with different tracks
     // separated by commas
 },
 ...
];
```

**Expected output:**

```jsx
const data = [
 {
   x: '2021-04-07', 
   y: 1, 
   tooltip: 'Captain Hook (1)' 
 },
 { 
   x: '2021-04-08',
   y: 5,
   tooltip: 'Peaches (1), Savage (3), Captain Hook (1)'
 },
 {
   x: '2021-04-09',
   y: 3,
   tooltip: 'Savage (1), Savage (feat. Beyonce) (1), Captain Hook (1)'
 }
];
```

## Deliverables

- Vanilla JavaScript or Typescript code that will take the sample API response and transform it into the expected output as described above (no third-party libraries — we want to see your original code and the solution you come up with from scratch).
- There is no need to graph the output, we just want to see the expected output via `console.log()`
- Bonus points for clarity and elegance of your code and solution (when it makes sense, we like to see solutions that break the problem down into smaller pieces)



Public url for this exercise: [https://chartmetric.notion.site/Coding-Exercise-JS-Data-Transformation-5bf2861c55564135a362a31c732aa527](https://www.notion.so/Coding-Exercise-JS-Data-Transformation-5bf2861c55564135a362a31c732aa527?pvs=21)