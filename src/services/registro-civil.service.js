import axios from "axios";
import { BASE_URL, APIKEY } from "./__mocks__/registro-civil.service.mocks.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

/**
 * Fetches criminal records for a given RUT.
 * @param {string} rut - User RUT
 * @returns {Promise<boolean>} - Returns true if criminal records exist, false otherwise.
 */
async function getCriminalRecords(rut) {
    try {
        const response = await axiosInstance.get(`/person/${rut}/criminal_records`, {
            headers: {
				'X-API-Key': apiKey,
			  },
        });
        const { quantity } = response.data;
        return quantity > 0;
    } catch (error) {
        console.error("Error fetching criminal records:", error);
        return false;
    }
}

export { getCriminalRecords };