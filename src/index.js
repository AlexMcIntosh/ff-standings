import { getLeagueMatchups, getLeagueUsers, getRosters } from "./sleeper.js";
import { calcPayout } from "./utils.js";

const LEAGUE_ID = "1124850847474282496";
const CURR_WEEK = 7;

const matchups = await getLeagueMatchups(LEAGUE_ID, 1);
const users = await getLeagueUsers(LEAGUE_ID);
const rosters = await getRosters(LEAGUE_ID);

const rosterMap = new Map();
const userMap = new Map();

users.forEach((user) => {
    userMap.set(user.user_id, { "display_name": user.display_name })
});

rosters.forEach((roster) => {
    // delete the co_owners
    if (roster.co_owners) {
        roster.co_owners.forEach((id) => {
            if (userMap.has(id)) {
                userMap.delete(id);
            }
        })
    }

    // roster may be a co owner roster but we dont want to populate the map with them
    if (userMap.has(roster.owner_id)) {
        const user = userMap.get(roster.owner_id);
        const { wins, losses } = roster.settings;
        const payout = calcPayout(wins);
        rosterMap.set(roster.roster_id, {
            wins,
            losses,
            payout,
            "display_name": user.display_name,
            "owner_id": roster.owner_id
        });
    }
});

// sort matchups in descending order by points
matchups.sort((a, b) => {
    return a.points - b.points;
});

matchups.forEach((matchup, index) => {
    if(rosterMap.has(matchup.roster_id)) {
        const roster = rosterMap.get(matchup.roster_id);
        const points = index + (roster?.points ?? 0);
        rosterMap.set(matchup.roster_id, {
            ...roster,
            points
        })
    }
});

rosterMap.forEach((roster) => {
    console.log(roster);
})