import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
    captionPosition: "bottom",
});

export function createGallery(images) {
    const markup = images
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) => `
      <li class="list-item">
        <a href="${largeImageURL}" class="item-img-link">
          <img class="gallery-img" src="${webformatURL}" alt="${tags}" />
        </a>
        <div class="img-info-wrap">
          <div class="img-info"><p>Likes</p><p>${likes}</p></div>
          <div class="img-info"><p>Views</p><p>${views}</p></div>
          <div class="img-info"><p>Comments</p><p>${comments}</p></div>
          <div class="img-info"><p>Downloads</p><p>${downloads}</p></div>
        </div>
      </li>`
        )
        .join("");

    gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
}

export function clearGallery() {
    gallery.innerHTML = "";
}

export function showLoader() {
    loader.classList.add("visible");
}

export function hideLoader() {
    loader.classList.remove("visible");
}
