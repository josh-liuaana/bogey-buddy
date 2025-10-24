export const PROMPT = `
  Analyse the following golf round data and provide insights into the player's performance, extracting the requested fields:
  
  --- START OF GOLF DATA --- 
  {DATA_PLACEHOLDER} 
  --- END OF GOLF DATA --- 
`;

export const EXAMPLE_RESPONSE = `
  Based on the limited data from the first hole, your performance regarding direction and 
  distance to target was exceptionally strong. Your initial 7-iron tee shot landed straight
  and on target, setting up a successful approach. Similarly, your putt also registered as
  straight and on target, resulting in a birdie. With no misses recorded in terms of direction
  (e.g., left/right) or distance (e.g., long/short) for the shots detailed, these areas
  appear to be a significant strength in this round. To identify specific weaknesses, 
  more data from additional holes and shots would be beneficial, but this single-hole 
  analysis indicates excellent shot execution.`;

export const EXAMPLE_ANALYSIS_RESPONSE = {
  strengths: [
    "Exceptional power and accuracy with long irons, evidenced by a 285-yard 7-iron shot landing directly on the green.",
    "Clutch putting ability, demonstrated by holing a 4-foot putt to secure an eagle.",
    "High scoristrengthsng potential, achieving an impressive eagle on a par 4 early in the round.",
  ],
  weaknesses: [
    "Incomplete Round Data: The provided data only covers one fully played hole, which makes a comprehensive analysis of overall game consistency and various shot types impossible.",
    "Lack of Demonstrated Consistency: With only one complete hole, there is no evidence to assess the player's ability to maintain high performance across an entire round or adapt to different challenges.",
  ],
  summary:
    "The player demonstrated exceptional scoring ability and precision during the round, achieving an impressive eagle on the first hole. This was highlighted by an extraordinary 285-yard 7-iron shot landing directly on the green, followed by a confident 4-foot putt. However, with only one complete hole recorded, a comprehensive evaluation of overall game consistency and other aspects of performance is severely limited.",
};
