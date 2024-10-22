import { getLeagueMatchups } from "./sleeper.js";
import TextToSVG from "text-to-svg";

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

export const generateSVG = (text, fontSize = 30) => {
    const textToSVG = TextToSVG.loadSync("fonts/Tomorrow/Tomorrow-Medium.ttf");
	try {
		const svg = textToSVG.getSVG(text, {
			fontSize,
			anchor: 'top',
			attributes: { fill: 'white' },
		})
		return Buffer.from(svg)
	} catch (err) {
		console.error('Error generating SVG:', err)
		throw err
	}
}
