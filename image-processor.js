import * as path from 'path'
import { fileURLToPath } from 'url'
import sharp from "sharp";
import { generateSVG } from './utils.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_PATH = path.join(
    __dirname,
    './newTemplate.png'
);

export const generateStandingsPng = async (standings, week) => {
    const template = await sharp(TEMPLATE_PATH);
    const overlays = [];

    console.log("picture loaded");
    standings.forEach((roster, index) => {
        const name = generateSVG(roster.display_name);
        const wins = generateSVG(roster.wins.toString());
        const losses = generateSVG(roster.losses.toString());
        const payout = generateSVG(roster.payout.toString());
        const points = generateSVG(roster.points.toString());

        const y = 587 + 102 * index;

        const nameOverlay = {
            input: name,
            top: y,
            left: 250
        };

        const winsOverlay = {
            input: wins,
            top: y,
            left: 643,
        };

        const lossesOverlay = {
            input: losses,
            top: y,
            left: 737,
        };

        const payoutOverlay = {
            input: payout,
            top: y,
            left: 813,
        };

        const pointsOverlay = {
            input: points,
            top: y,
            left: 915
        };

        overlays.push(nameOverlay);
        overlays.push(winsOverlay);
        overlays.push(lossesOverlay);
        overlays.push(payoutOverlay);
        overlays.push(pointsOverlay);
    });

    await template.composite([
        ...overlays
    ]).toFile(`output/standings-week-${week}.png`);
}