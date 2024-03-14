const determineWeight = async (id, daysAgo) => {
  const countsQuery =
    QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
      id,
      8,
      4,
      daysAgo
    );
  const counts = await snowflakeClientExecuteQuery(countsQuery);
  const [highCount, mediumCount] = counts.map((count) => count?.count || 0);
  return highCount ? 8 : mediumCount ? 4 : 1;
};

const fetchArtistInsights = async (id, limit, weight, daysAgo) => {
  const insightsQuery =
    QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
      id,
      limit * 10,
      weight,
      daysAgo
    );
  const insightsResults = await snowflakeClientExecuteQuery(insightsQuery);
  return filterResults(insightsResults);
};

const formatInsights = async (sfResult, limit, weight) => {
  const formattedResults = await Promise.all(sfResult.map(formatInsight));
  return formattedResults
    .filter((result) => result !== null)
    .slice(0, limit + (10 - weight) * 200);
};

const convertToNewsFormat = async (formattedResults, newsFormat) => {
  return Promise.all(
    formattedResults.map(async (result) => {
      const news = await insightToNews(result);
      return newsFormat ? news : result;
    })
  );
};

const getArtistInsights = async (query) => {
  try {
    const { id, limit, weight: initialWeight, daysAgo, newsFormat } = query;

    // Determine the weight if it's not defined
    const weight =
      initialWeight !== undefined
        ? initialWeight
        : await determineWeight(id, daysAgo);

    const insightsResults = await fetchArtistInsights(id, limit, weight, daysAgo);
    const formattedResults = await formatInsights(insightsResults, limit, weight);
    const insights = await convertToNewsFormat(formattedResults, newsFormat);

    return newsFormat ? { insights, weight } : insights;
  } catch (error) {
    console.error("Error getting artist insights:", error);
    throw error;
  }
};

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

// function getArtistInsights(query) {
//   const { id, limit, weight, daysAgo, newsFormat } = query;
//   const countPromise =
//     weight !== undefined
//       ? Promise.resolve()
//       : snowflakeClientExecuteQuery(
//           QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
//             id,
//             8, // high weight
//             4, // medium weight
//             daysAgo
//           )
//         );
//   return countPromise.then((counts) => {
//     if (weight === undefined) {
//       const high = counts[0]?.count;
//       const medium = counts[1]?.count;
//       weight = weight
//         ? weight
//         : high
//         ? 8 // high weight
//         : medium
//         ? 4 // medium weight
//         : 1; // low weight
//     }
//     return snowflakeClientExecuteQuery(
//       QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
//         id,
//         limit * 10,
//         weight,
//         daysAgo
//       )
//     )
//       .then((sfResult) => filterResults(sfResult))
//       .then((filteredResult) => {
//         return Promise.map(filteredResult, (result) => {
//           return formatInsight(result);
//         });
//       })
//       .then((result) => {
//         result = result.filter((e) => e != null);
//         result = result.slice(0, limit + (10 - weight) * 200);
//         return result;
//       })
//       .then((results) => {
//         const newss = Promise.map(results, (result) => {
//           const news = insightToNews(result);
//           return newsFormat ? news : result;
//         });
//         return newss;
//       })
//       .then((insights) => {
//         return newsFormat ? { insights, weight } : insights;
//         // return insights;
//       });
//   });
// }
