const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

let allWorks = [];

async function getWorks() {
    const response = await fetch(urlWorks); 
    allWorks = await response.json();       
    displayWorks(allWorks);                    
}

function displayWorks(works) {    
    const gallery = document.querySelector(".gallery");
    
    gallery.innerHTML = ""; 

    works.forEach((work) => {
        const figure = document.createElement("figure");         
        const img = document.createElement("img");               
        const figcaption = document.createElement("figcaption"); 

        img.src = work.imageUrl;      
        img.alt = work.title;         
        figcaption.innerText = work.title; 

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}

async function getCategories() {
    const response =  await fetch (urlCategories)
    const categories = await response.json()
    displayFilters(categories)
}

function displayFilters(categories) {
    const filtersContainer = document.querySelector(".filters");

    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("filter-btn");
    filtersContainer.appendChild(allButton);

    allButton.addEventListener("click", () => {
        displayWorks(allWorks)    
    });

    categories.forEach((category) => {
        const button = document.createElement("button");        
        button.innerText = category.name; 
        button.classList.add("filter-btn");

        filtersContainer.appendChild(button);

        button.addEventListener("click", () => {
            const filteredWorks = allWorks.filter((work) => {
                return work.categoryId === category.id; 
            });
            displayWorks(filteredWorks);    
        });
    }); 
}

getWorks();
getCategories();
