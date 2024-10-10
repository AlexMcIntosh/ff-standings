import { getLeagueMatchups } from "./sleeper.js";

export const calcPayout = (wins) => {
    const payout = 25;
    return wins * payout;
}

export const getAndSortPtsAscMatchupForWeek = async (leagueId,week) => {
    const matchupForWeek = await getLeagueMatchups(leagueId, week);

    // sort matchups in descending order by points
    matchupForWeek.sort((a, b) => {
        return a.points - b.points;
    });

    return matchupForWeek;
};
