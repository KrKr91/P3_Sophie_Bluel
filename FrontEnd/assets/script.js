const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

async function getWorks() {
    const response = await fetch(urlWorks); 
    const works = await response.json();    
    displayWorks(works);                    
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

getWorks();
