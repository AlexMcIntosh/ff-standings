import { getLeagueMatchups, getLeagueUsers, getRosters } from "./sleeper.js";

const LEAGUE_ID = "1124850847474282496";

const matchups = await getLeagueMatchups(LEAGUE_ID, 1);
const userMap = new Map();
const users = await getLeagueUsers(LEAGUE_ID);
const rosters = await getRosters(LEAGUE_ID);

users.forEach((user, index) => {
    userMap.set(user.user_id, { "name": user.display_name })
});

// matchups.forEach((matchup, index) => {
//     console.log(matchup)
// });

rosters.forEach((roster, index) => {
    // delete the co_owners
    if (roster.co_owners) {
        roster.co_owners.forEach((id) => {
            userMap.delete(id);
        })
    }

    if (userMap.has(roster.owner_id)) {
        const value = userMap.get(roster.owner_id);
        const { wins, losses } = roster.settings;
        value.wins = wins;
        value.losses = losses;
        value.payout = wins * 25;
        userMap.set(roster.owner_id, value);
    }
})

userMap.forEach((value, key, map) => {
    console.log(value)
})
