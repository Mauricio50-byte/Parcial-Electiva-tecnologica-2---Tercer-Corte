const FAIL_MODE = process.env.DEMO_FAIL === '1';

function getMatchResult(homeTeam, awayTeam, homeGoals, awayGoals) {
  if (typeof homeTeam !== 'string' || homeTeam.trim() === '') {
    throw new TypeError('homeTeam required');
  }
  if (typeof awayTeam !== 'string' || awayTeam.trim() === '') {
    throw new TypeError('awayTeam required');
  }
  if (!Number.isInteger(homeGoals) || homeGoals < 0) {
    throw new TypeError('homeGoals invalid');
  }
  if (!Number.isInteger(awayGoals) || awayGoals < 0) {
    throw new TypeError('awayGoals invalid');
  }

  let winner = null;
  if (homeGoals > awayGoals) {
    winner = 'home';
  } else if (awayGoals > homeGoals) {
    winner = 'away';
  } else {
    winner = null;
  }

  if (FAIL_MODE && homeGoals === awayGoals) {
    winner = 'home';
  }

  return { homeTeam, awayTeam, homeGoals, awayGoals, winner };
}

function updateStandings(standings, result) {
  if (typeof standings !== 'object' || standings === null) {
    throw new TypeError('standings must be object');
  }

  const { homeTeam, awayTeam, homeGoals, awayGoals, winner } = result;

  for (const t of [homeTeam, awayTeam]) {
    if (!standings[t]) {
      standings[t] = {
        played: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,
      };
    }
  }

  standings[homeTeam].played += 1;
  standings[awayTeam].played += 1;
  standings[homeTeam].gf += homeGoals;
  standings[homeTeam].ga += awayGoals;
  standings[awayTeam].gf += awayGoals;
  standings[awayTeam].ga += homeGoals;

  if (winner === 'home') {
    standings[homeTeam].wins += 1;
    standings[awayTeam].losses += 1;
    standings[homeTeam].points += 3;
  } else if (winner === 'away') {
    standings[awayTeam].wins += 1;
    standings[homeTeam].losses += 1;
    standings[awayTeam].points += 3;
  } else {
    standings[homeTeam].draws += 1;
    standings[awayTeam].draws += 1;
    standings[homeTeam].points += 1;
    standings[awayTeam].points += 1;
  }

  return standings;
}

module.exports = {
  getMatchResult,
  updateStandings,
};
