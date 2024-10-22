import * as path from 'path'
import { fileURLToPath } from 'url'
import sharp from "sharp";
import { generateSVG } from './utils.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_PATH = path.join(
    __dirname,
    './template.png'
);

export const generateStandingsPng = async (standings, week) => {
    const template = await sharp(TEMPLATE_PATH);
    const overlays = [];

    console.log("picture loaded");
    standings.forEach((roster, index) => {
        const nameSvg = generateSVG(roster.display_name);
        const winsSvg = generateSVG(roster.wins.toString());
        const lossesSvg = generateSVG(roster.losses.toString());
        const payoutSvg = generateSVG(roster.payout.toString());
        const pointsSvg = generateSVG(roster.points.toString());
        const weekSvg = generateSVG(week.toString(), 120);

        const y = 587 + 102 * index;

        const nameOverlay = {
            input: nameSvg,
            top: y,
            left: 250
        };

        const winsOverlay = {
            input: winsSvg,
            top: y,
            left: 643,
        };

        const lossesOverlay = {
            input: lossesSvg,
            top: y,
            left: 737,
        };

        const payoutOverlay = {
            input: payoutSvg,
            top: y,
            left: 813,
        };

        const pointsOverlay = {
            input: pointsSvg,
            top: y,
            left: 915
        };

        const weekOverlay = {
            input: weekSvg,
            top: 215,
            left: 905
        }

        overlays.push(nameOverlay);
        overlays.push(winsOverlay);
        overlays.push(lossesOverlay);
        overlays.push(payoutOverlay);
        overlays.push(pointsOverlay);
        overlays.push(weekOverlay)
    });

    await template.composite([
        ...overlays
    ]).toFile(`output/standings-week-${week}.png`);
}