import axios from "axios";

const client = axios.create({
    baseURL: "https://api.sleeper.app/v1/"
})

export const getLeagueMatchups = async (leagueId, week) => {
    const uri = `league/${leagueId}/matchups/${week}`;

    try {
        const response = await client.get(uri);
        return response.data;
    }
    catch(e) {
        console.log("Failed to get league scores", e);
    }
}

export const getLeagueUsers = async (leagueId) => {
    const uri = `league/${leagueId}/users`;

    try {
        const response = await client.get(uri);
        return response.data;
    }
    catch(e) {
        console.log("Failed to get league users", e);
    }
}

export const getRosters = async (leagueId) => {
    const uri =`league/${leagueId}/rosters`;

    try {
        const response = await client.get(uri);
        return response.data;
    }
    catch {
        console.log("Failed to get rosters", e);
    }
}