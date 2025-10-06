import { getImagesByQuery } from "./js/pixabay-api.js";
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const searchBtn = document.querySelector('button[type="submit"]');
const searchInput = document.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector(".load-more");

let currentPage = 1;
let currentQuery = "";
const perPage = 15;
let totalHits = 0;

form.addEventListener("submit", onSubmit);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSubmit(event) {
    event.preventDefault();
    const userQuery = searchInput.value.trim();

    if (!userQuery) {
        iziToast.error({
            message: "❌ Search field cannot be empty!",
            color: "red",
            position: "topRight",
            messageSize: "18",
            icon: false,
            progressBar: false,
        });
        return;
    }



    currentQuery = userQuery;
    currentPage = 1;

    clearGallery();
    hideLoadMore();
    showLoader();
    searchBtn.disabled = true;

    try {
        const data = await getImagesByQuery(currentQuery, currentPage, perPage);
        totalHits = data.totalHits;

        if (!data.hits.length) {
            iziToast.error({
                message:
                    "❌ Sorry, there are no images matching your search query. Please try again!",
                color: "red",
                position: "topRight",
            });
            return;
        }

        createGallery(data.hits);

        if (currentPage * perPage < totalHits) {
            showLoadMore();
        }

    } catch (error) {
        iziToast.error({
            message: "❌ Network Error",
            color: "red",
            position: "topRight",
        });
    } finally {
        form.reset();
        hideLoader();
        searchBtn.disabled = false;
    }
}

async function onLoadMore() {
    currentPage += 1;

    showLoader();
    hideLoadMore();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage, perPage);
        createGallery(data.hits);

        smoothScroll();

        const totalLoaded = currentPage * perPage;
        if (totalLoaded >= totalHits) {
            hideLoadMore();
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "topRight",
                color: "blue",
            });
        } else {
            showLoadMore();
        }
    } catch (error) {
        iziToast.error({
            message: "❌ Error loading more images!",
            color: "red",
            position: "topRight",
        });
    } finally {
        hideLoader();
    }
}

// 🔹 Допоміжні функції
function showLoadMore() {
    loadMoreBtn.classList.remove("hidden");
}
function hideLoadMore() {
    loadMoreBtn.classList.add("hidden");
}

// 🔹 Плавне прокручування
function smoothScroll() {
    const galleryItem = document
        .querySelector(".gallery .list-item")
        ?.getBoundingClientRect();

    if (galleryItem) {
        const height = galleryItem.height;
        window.scrollBy({
            top: height * 2,
            behavior: "smooth",
        });
    }
}
