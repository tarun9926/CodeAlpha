const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");   
const searchInput = document.querySelector(".search-box input");


const apikey ="fh1kYMp2GxKPmNU4pV3mXmhGwpOqxXoZL6e6kkSgIsEDtp9M4Da5YD6Z";
const perPage = 20;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) =>{
    //converting receiveed img to blob , creating its download link , & downloading it
   fetch(imgURL).then(res => res.blob()).then(file =>{
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
   }).catch(() => alert("Failed to download image!"));
}


const generateHTML = (images) =>{
    imagesWrapper.innerHTML += images.map(img=>
        `<li class="card">
                <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                       <i class="material-symbols-outlined" >
                      photo_camera
                        </i>
                            
                        
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImg('${img.src.large2x}')">
                    <span class="material-symbols-outlined">
                       download
                       </span>
                        </button>
                </div>
            </li>`
    ).join("");
}
const getImages = (apiURL) =>{
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL,{
      headers: { Authorization: apikey}  
    }).then(res =>res.json()).then(data =>{
      // console.log(data);
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("field to load images!"));
}

const loadMoreImages = () =>{
    currentPage++;//increament current by 1
    //if search term has some value then call API with tern else call default API
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`: apiURL;
    getImages(apiURL);
}   
const loadSearchImages = (e) =>{
    if(e.target.value === "") return searchTerm = null;
    //if pressed key is Enter , update the current page , search term & call the getImages
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click",loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
// closeBtn.addEventListener("click", hideLightbox);