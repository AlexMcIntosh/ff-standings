import { getLeagueUsers, getRosters } from "./sleeper.js";
import { getAndSortPtsAscMatchupForWeek } from "./utils.js";
import { calcPayout } from "./utils.js";
import Yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = Yargs(hideBin(process.argv)).parse()
const LEAGUE_ID = "1124850847474282496";

if (!argv.week) {
    console.log("Missing argument --week");
}
else {
    await main(argv.week);
}

async function main(week) {
    const currWeek = week;

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
    
    for(let i = 1; i <= currWeek; i++) {
        const sortedMatchups = await getAndSortPtsAscMatchupForWeek(LEAGUE_ID, i);
        sortedMatchups.forEach((matchup, index) => {
            if(rosterMap.has(matchup.roster_id)) {
                const roster = rosterMap.get(matchup.roster_id);
                const points = index + (roster?.points ?? 0);
                rosterMap.set(matchup.roster_id, {
                    ...roster,
                    points
                })
            }
        });
    }
    
    const finalStandings = [];
    rosterMap.forEach((roster) => {
        finalStandings.push(roster);
    });
    
    finalStandings.sort((a, b) => {
        return b.points - a.points;
    });
    
    finalStandings.forEach((team) => {
        console.log(team);
    });
};