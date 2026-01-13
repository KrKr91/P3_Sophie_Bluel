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

getWorks();

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

getCategories();


// mode admin

function checkAdminMode() {
    
    const token = localStorage.getItem("token");

    if (token) {
        
        const loginLink = document.querySelector("nav ul li a[href='login.html']");
        if (loginLink) {
            loginLink.innerText = "logout";
            loginLink.href = "#"; 
            loginLink.addEventListener("click", () => {
                localStorage.removeItem("token");
                window.location.reload(); 
            });
        }

        const body = document.querySelector("body");
        const topBar = document.createElement("div");
        topBar.classList.add("edit-mode-bar"); 
        topBar.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> <span>Mode édition</span>';
        body.insertBefore(topBar, body.firstChild);

        const projectTitle = document.querySelector("#portfolio h2"); 
        
        if (projectTitle) {
            const editBtn = document.createElement("a");
            editBtn.classList.add("edit-btn"); 
            editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
            editBtn.href = "#";
            editBtn.addEventListener ("click", openModal);
            projectTitle.appendChild(editBtn); 
        }

        const filters = document.querySelector(".filters");
        if (filters) {
            filters.style.display = "none";
        }
    }
}

checkAdminMode();


// modal

const modal = document.getElementById("modal");
const modalGallery = document.querySelector(".modal-gallery");

async function openModal(e) {
    if (e) e.preventDefault();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    await generateModalGallery(); 
}

function closeModal(e) {
    if (e) e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
}

const closeBtn = document.querySelector(".close-modal");
if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
}

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});


// la gallerie

async function generateModalGallery() {
    modalGallery.innerHTML = ""; 
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json(); 
    
    works.forEach(work => {
        const figure = document.createElement("figure");
        
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        
        trashIcon.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?");
            if (confirmation) {
                deleteWork(work.id);
            }
        });
        
        figure.appendChild(img);       
        figure.appendChild(trashIcon); 
        
        modalGallery.appendChild(figure);
    });
}


// supp une photo

async function deleteWork(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        });

        if (response.ok) {
            generateModalGallery(); 
            getWorks();             
        } else {
            console.error("Erreur lors de la suppression");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

// ajout photo

const btnAddPhoto = document.querySelector(".btn-add-photo");
const modalStep1 = document.getElementById("modal-step-1");
const modalStep2 = document.getElementById("modal-step-2");
const arrowReturn = document.querySelector(".modal-return");
const previewImg = document.getElementById("preview-img");
const fileInput = document.getElementById("file");
const labelFile = document.querySelector(".upload-container label");
const iconFile = document.querySelector(".upload-container .icon-image");
const pFile = document.querySelector(".upload-container p");

btnAddPhoto.addEventListener("click", () => {
    modalStep1.style.display = "none";
    modalStep2.style.display = "block";
    arrowReturn.style.visibility = "visible";
});

arrowReturn.addEventListener("click", () => {
    modalStep1.style.display = "block";
    modalStep2.style.display = "none";
    arrowReturn.style.visibility = "hidden";
    resetForm(); 
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            
            labelFile.style.display = "none";
            iconFile.style.display = "none";
            pFile.style.display = "none";
        }
        
        reader.readAsDataURL(file);
    }
});

async function loadCategories() {
    const select = document.getElementById("category");
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    
    select.innerHTML = '<option value="" disabled selected></option>'; 
    
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        select.appendChild(option);
    });
}
loadCategories();

const formAddPhoto = document.getElementById("add-photo-form");

formAddPhoto.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("category", document.getElementById("category").value);

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}` 
            },
            body: formData
        });

        if (response.ok) {
            alert("Projet ajouté avec succès !");

            generateModalGallery(); 
            getWorks();             
            
            resetForm();      

            arrowReturn.click(); 
        } else {
            alert("Erreur lors de l'envoi du formulaire.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
});

function resetForm() {
    formAddPhoto.reset();
    previewImg.style.display = "none";
    labelFile.style.display = "block";
    iconFile.style.display = "block";
    pFile.style.display = "block";
    previewImg.src = "#";
}

// le bouton valider 

const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("file");
const submitButton = document.querySelector(".btn-submit-photo");

function checkForm() {
    if (imageInput.files[0] && titleInput.value !== "" && categorySelect.value !== "") {
        submitButton.classList.add("btn-valid");
    } else {
        submitButton.classList.remove("btn-valid");
    }
}

titleInput.addEventListener("input", checkForm);      
categorySelect.addEventListener("change", checkForm); 
imageInput.addEventListener("change", checkForm);