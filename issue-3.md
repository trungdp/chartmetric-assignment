# Coding Exercise: Async Function Refactor

The following function `getArtistInsights` accepts a `query` object and then proceeds to execute a series of requests.

This function was written a long time ago, and we would like to refactor it to an `async/await` style (instead of its current state of chained `.then` calls).

Additionally, it uses the `[bluebird` library](http://bluebirdjs.com/docs/api-reference.html) which adds some methods to `Promise`. Since we want to deprecate this library, we would also like to replace any bluebird-specific method calls (such as `Promise.map`), with the standard `[Promise` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

**Objectives:**

- Rewrite the function below in `async/await` style.
- Replace any non-standard `Promise` API methods (such as `Promise.map`) with equivalent code.
- **Bonus:** For a better coding style, feel free to make any modifications to comply with [Airbnb styling guide](https://airbnb.io/javascript/).

**What we will evaluate:**

- Readable, maintainable, and performant code.
- Bonus for any improvement in coding style.

I**nformation about helper functions and other variables:**

- `snowflakeClientExecuteQuery` : Accepts a string that represents a valid SQL query. Returns a Promise that resolves to an array of objects. One object for each row returned by the query and one object property for each table column.


```javascript

Promise.resolve([
  {
    colA: ...,
    colB: ...,
    ...
  },
  { ... },
  ...
])
```

- The functions `filterResults`, `insightToNews`, and `formatInsight` make minor modifications to the accepted input. No need to be concerned about their actual processing. Be mindful of the accepted input for each of them. Some may accept an array of objects, while others accept only objects:
    - `filterResults`: Accepts and returns an array of objects.
    - `insightToNews`: Accepts an object and returns a Promise that resolves to an object.
    - `formatInsight`: Accepts an object and returns a Promise that resolves to an object.
- `QUERIES` is a nested object where each property is a SQL template (a string) or a method that returns a SQL query (a string).


```javascript

/**
 * these are defined in an external queries file but 
 * added here as a comment for additional context
 *
 * QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS

module.exports {
 ...
 GET_INSIGHTS_COUNT: (cm_artist, highWeight, mediumWeight, daysAgo) => `
      SELECT COUNT(*) as "count"
      FROM chartmetric.analytics.cm_artist_insights ai
      JOIN chartmetric.analytics.cm_artist_insights_weight aiw ON ai.target = aiw.target AND ai.type = aiw.type
      WHERE cm_artist = ${cm_artist}
      AND weight >= ${highWeight}
      AND timestp >= current_date - ${daysAgo}
      UNION
      SELECT COUNT(*) as "count"
      FROM chartmetric.analytics.cm_artist_insights ai
      JOIN chartmetric.analytics.cm_artist_insights_weight aiw ON ai.target = aiw.target AND ai.type = aiw.type
      WHERE cm_artist = ${cm_artist}
      AND weight >= ${mediumWeight}
      AND timestp >= current_date - ${daysAgo}
      `,
 GET_ARTIST_INSIGHTS: (cm_artist, limit, weight, daysAgo) => `
      WITH insights AS (
        SELECT ai.*, aiw.weight
        FROM chartmetric.analytics.cm_artist_insights ai
        JOIN chartmetric.analytics.cm_artist_insights_weight aiw ON ai.target = aiw.target AND ai.type = aiw.type
        WHERE cm_artist = ${cm_artist}
        AND weight >= ${weight}
        AND timestp >= current_date - ${daysAgo}
        ORDER BY timestp DESC, weight DESC
        LIMIT ${limit}
      )
      , artist AS (
        SELECT 
            DISTINCT i.cm_artist, 
            t.image_url AS artist_url
        from insights i
        JOIN raw_data.cm_artist t ON i.cm_artist = t.id
       )
      , track as (
        SELECT 
            DISTINCT i.cm_track, 
            t.image_url AS track_url
        FROM insights i
        JOIN raw_data.cm_track t ON i.cm_track = t.id
       )
      , album AS (
        SELECT 
            DISTINCT i.cm_album, 
            t.image_url AS album_url
        FROM insights i
        JOIN raw_data.cm_album t ON i.cm_album = t.id
       )
      SELECT i.* , 
          album.album_url, 
          track.track_url, 
          artist.artist_url
      FROM insights i
      LEFT JOIN album ON i.cm_album = album.cm_album
      LEFT JOIN track ON i.cm_track = track.cm_track
      LEFT JOIN artist ON i.cm_artist = artist.cm_artist
      `,
 ...
};

*/


function getArtistInsights(query) {
  const { id, limit, weight, daysAgo, newsFormat } = query;
  const countPromise =
    weight !== undefined
      ? Promise.resolve()
      : snowflakeClientExecuteQuery(
          QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
            id,
            8, // high weight
            4, // medium weight
            daysAgo
          )
        );
  return countPromise.then(counts => {
    if (weight === undefined) {
      const high = counts[0]?.count;
      const medium = counts[1]?.count;
      weight = weight
        ? weight
        : high
        ? 8 // high weight
        : medium
        ? 4 // medium weight
        : 1; // low weight
    }
    return snowflakeClientExecuteQuery(
      QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
        id,
        limit * 10,
        weight,
        daysAgo
      )
    )
      .then(sfResult => filterResults(sfResult))
      .then(filteredResult => {
        return Promise.map(filteredResult, result => {
          return formatInsight(result);
        });
      })
      .then(result => {
        result = result.filter(e => e != null);
        result = result.slice(0, limit + (10 - weight) * 200);
        return result;
      })
      .then(results => {
        const newss = Promise.map(results, result => {
          const news = insightToNews(result);
          return newsFormat ? news : result;
        });
        return newss;
      })
      .then(insights => {
        return newsFormat ? { insights, weight } : insights;
        // return insights;
      });
  });
}
```