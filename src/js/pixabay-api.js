import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "52629848-261c53034f3f85396bd8026ef";

export async function getImagesByQuery(query, page = 1, perPage = 15) {
    try {
        const { data } = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page,
                per_page: perPage,
            },
        });
        return data;
    } catch (error) {
        console.error("Pixabay API error:", error);
        throw error;
    }
}