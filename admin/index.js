let editHeadingMode = false;
let editFooterMode = false;
let editingArticle = null;

function getArticles() {
    const savedArticles = localStorage.getItem("articles");
    return savedArticles ? JSON.parse(savedArticles) : [];
}

function saveArticles(articles) {
    localStorage.setItem("articles", JSON.stringify(articles));
}

function handleLogoEdit() {
    editHeadingMode = !editHeadingMode;

    const logoTextElement = document.getElementById("logoText");
    const logoImageElement = document.getElementById("logoImage");
    const logoInput = document.getElementById("logoInput");

    if (!editHeadingMode) {
        const logo = logoImageElement.src || logoTextElement.innerHTML;
        localStorage.setItem("logo", logo);
    }

    logoTextElement.hidden = editHeadingMode;
    logoImageElement.hidden = editHeadingMode;
    logoInput.hidden = !editHeadingMode;

    document.getElementById("logoButton").innerHTML = editHeadingMode ? "Save" : "Edit";
}

function handleLogoImageUpload() {
    const inputElement = document.getElementById("logoInput");
    const logoImageElement = document.getElementById("logoImage");
    const logoTextElement = document.getElementById("logoText");

    const file = inputElement.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            logoImageElement.src = event.target.result;
            logoImageElement.style.display = 'block';
            logoTextElement.hidden = true; 
        };
        reader.readAsDataURL(file);
    }
}

function addNewArticle() {
    const articles = getArticles();
    const newArticle = {
        id: Date.now(),
        title: "New Article Title",
        content: "Write your content here...",
        image: null
    };
    
    articles.push(newArticle);
    saveArticles(articles);
    renderArticles(); 
}

function renderArticle(article, index) {
    const container = document.createElement("article");
    container.id = `article-${article.id}`;
    container.className = "admin-article";
    
    container.innerHTML = `
        <div class="article-header">
            <h2>${article.title}</h2>
            <div class="article-actions">
                <button onclick="editArticle(${article.id})">Edit</button>
                <button onclick="deleteArticle(${article.id})">Delete</button>
            </div>
        </div>
        <div class="content">
            <p>${article.content}</p>
            ${article.image ? 
                `<div class="image-container">
                    <img src="${article.image}" style="max-width: 100%; height: auto;">
                </div>` : 
                '<div class="image-placeholder">No image</div>'
            }
        </div>
    `;
    
    return container;
}

function editArticle(articleId) {
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    const container = document.getElementById(`article-${articleId}`);
    if (!container) return;
    
    editingArticle = articleId;
    
    container.innerHTML = `
        <div class="article-edit-form">
            <div class="form-group">
                <label for="edit-title-${articleId}">Title:</label>
                <input type="text" id="edit-title-${articleId}" value="${article.title}">
            </div>
            <div class="form-group">
                <label for="edit-content-${articleId}">Content:</label>
                <textarea id="edit-content-${articleId}" rows="5">${article.content}</textarea>
            </div>
            <div class="form-group">
                <label for="edit-image-${articleId}">Image:</label>
                <input type="file" id="edit-image-${articleId}" accept="image/*">
                ${article.image ? 
                    `<div class="current-image">
                        <img src="${article.image}" style="max-width: 200px; max-height: 150px;">
                        <button type="button" onclick="removeArticleImage(${articleId})">Remove Image</button>
                    </div>` : ''
                }
            </div>
            <div class="form-actions">
                <button type="button" onclick="saveArticleChanges(${articleId})">Save</button>
                <button type="button" onclick="cancelArticleEdit(${articleId})">Cancel</button>
            </div>
        </div>
    `;
    
    const imageInput = document.getElementById(`edit-image-${articleId}`);
    if (imageInput) {
        imageInput.addEventListener('change', function(event) {
            handleArticleImageUpload(event, articleId);
        });
    }
}

function handleArticleImageUpload(event, articleId) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const articles = getArticles();
        const articleIndex = articles.findIndex(a => a.id === articleId);
        if (articleIndex !== -1) {
            const currentImage = document.querySelector(`#article-${articleId} .current-image`);
            if (currentImage) {
                currentImage.innerHTML = `
                    <img src="${e.target.result}" style="max-width: 200px; max-height: 150px;">
                    <button type="button" onclick="removeArticleImage(${articleId})">Remove Image</button>
                `;
            } else {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'current-image';
                imageContainer.innerHTML = `
                    <img src="${e.target.result}" style="max-width: 200px; max-height: 150px;">
                    <button type="button" onclick="removeArticleImage(${articleId})">Remove Image</button>
                `;
                document.getElementById(`edit-image-${articleId}`).parentNode.appendChild(imageContainer);
            }d
        }
    };
    reader.readAsDataURL(file);
}

function removeArticleImage(articleId) {
    const currentImage = document.querySelector(`#article-${articleId} .current-image`);
    if (currentImage) {
        currentImage.remove();
    }
}

function saveArticleChanges(articleId) {
    const titleInput = document.getElementById(`edit-title-${articleId}`);
    const contentInput = document.getElementById(`edit-content-${articleId}`);
    const imageInput = document.getElementById(`edit-image-${articleId}`);
    
    if (!titleInput || !contentInput) return;
    
    const articles = getArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) return;
    
    articles[articleIndex].title = titleInput.value;
    articles[articleIndex].content = contentInput.value;
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            articles[articleIndex].image = e.target.result;
            saveArticles(articles);
            renderArticles();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const currentImage = document.querySelector(`#article-${articleId} .current-image`);
        if (!currentImage && articles[articleIndex].image) {
            articles[articleIndex].image = null;
        }
        saveArticles(articles);
        renderArticles();
    }
    
    editingArticle = null;
}

function cancelArticleEdit(articleId) {
    editingArticle = null;
    renderArticles();
}

function deleteArticle(articleId) {
    if (confirm("Are you sure you want to delete this article?")) {
        const articles = getArticles();
        const updatedArticles = articles.filter(article => article.id !== articleId);
        saveArticles(updatedArticles);
        renderArticles();
    }
}

function renderArticles() {
    const articles = getArticles();
    const container = document.getElementById('adminArticles');
    
    container.innerHTML = '';
    
    if (articles.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-articles';
        emptyMessage.textContent = 'No articles yet. Click the button below to add your first article.';
        container.appendChild(emptyMessage);
    } else {
        articles.forEach((article, index) => {
            container.appendChild(renderArticle(article, index));
        });
    }
}

function handleFooterNote() {
    editFooterMode = !editFooterMode;

    const name = document.getElementById("companyName");
    const desc = document.getElementById("companyDesc");
    const copyright = document.getElementById("companyCopyright");

    const nameInput = document.getElementById("companyNameInput");
    const descInput = document.getElementById("companyDescInput");
    const copyrightInput = document.getElementById("companyCopyrightInput");

    if (editFooterMode) {
        nameInput.value = name.textContent;
        descInput.value = desc.textContent;
        copyrightInput.value = copyright.textContent;
    } else {
        name.textContent = nameInput.value;
        desc.textContent = descInput.value;
        copyright.textContent = copyrightInput.value;

        localStorage.setItem("companyName", nameInput.value);
        localStorage.setItem("companyDesc", descInput.value);
        localStorage.setItem("companyCopyright", copyrightInput.value);
    }

    name.hidden = editFooterMode;
    desc.hidden = editFooterMode;
    copyright.hidden = editFooterMode;

    nameInput.hidden = !editFooterMode;
    descInput.hidden = !editFooterMode;
    copyrightInput.hidden = !editFooterMode;

    document.querySelector(".company-info button").innerHTML = editFooterMode ? "Save" : "Edit";
}

function handleAddLink(e) {
    const button = e.target;
    const isEditing = button.innerHTML === "+";
    const refInput = document.getElementById("linkRef");
    const nameInput = document.getElementById("linkName");

    refInput.hidden = !isEditing;
    nameInput.hidden = !isEditing;

    if (isEditing) {
        button.innerHTML = "Save";
    } else {
        button.innerHTML = "+";

        const linkJson = {
            href: refInput.value,
            name: nameInput.value,
        };
        
        const linksList = getLinksList();
        linksList.push(linkJson);
        saveLinksList(linksList);
        
        renderLink(linkJson);
        
        refInput.value = "";
        nameInput.value = "";
    }
}

function getLinksList() {
    const savedLinks = localStorage.getItem("links-list");
    return savedLinks ? JSON.parse(savedLinks) : [];
}

function saveLinksList(linksList) {
    localStorage.setItem("links-list", JSON.stringify(linksList));
}

function renderLink(linkJson) {
    const listElement = document.getElementById("link-list");

    const linkContainer = document.createElement("div");
    linkContainer.classList.add("link-container");

    const aElement = document.createElement("a");
    aElement.textContent = linkJson.name;
    aElement.href = linkJson.href;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => {
        handleDeleteLink(linkContainer, linkJson);
    };

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.onclick = () => {
        handleEditLink(linkContainer, linkJson);
    };

    linkContainer.appendChild(aElement);
    linkContainer.appendChild(editButton);
    linkContainer.appendChild(deleteButton);
    listElement.appendChild(linkContainer);
}

function handleDeleteLink(container, linkJson) {
    container.remove();

    const linksList = getLinksList();
    const index = linksList.findIndex(
        link => link.href === linkJson.href && link.name === linkJson.name
    );
    
    if (index !== -1) {
        linksList.splice(index, 1);
        saveLinksList(linksList);
    }
}

function handleEditLink(container, linkJson) {
    container.innerHTML = "";

    const nameInput = document.createElement("input");
    const hrefInput = document.createElement("input");
    nameInput.value = linkJson.name;
    hrefInput.value = linkJson.href;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.onclick = () => {
        const updatedLink = {
            name: nameInput.value,
            href: hrefInput.value,
        };

        const linksList = getLinksList();
        const index = linksList.findIndex(
            link => link.href === linkJson.href && link.name === linkJson.name
        );
        
        if (index !== -1) {
            linksList[index] = updatedLink;
            saveLinksList(linksList);

            container.innerHTML = "";
            renderLink(updatedLink);
        }
    };

    container.appendChild(nameInput);
    container.appendChild(hrefInput);
    container.appendChild(saveButton);
}

function handleLoad() {
    const logo = localStorage.getItem("logo");
    if (logo) {
        const logoImageElement = document.getElementById("logoImage");
        const logoTextElement = document.getElementById("logoText");
        
        if (logo.includes("data:image")) {
            logoImageElement.src = logo;
            logoImageElement.style.display = 'block';
            logoTextElement.hidden = true;
        } else {
            logoTextElement.textContent = logo;
            logoImageElement.style.display = 'none';
        }
    }

    const companyName = localStorage.getItem("companyName");
    const companyDesc = localStorage.getItem("companyDesc");
    const companyCopyright = localStorage.getItem("companyCopyright");

    if (companyName) {
        document.getElementById("companyName").textContent = companyName;
    }
    if (companyDesc) {
        document.getElementById("companyDesc").textContent = companyDesc;
    }
    if (companyCopyright) {
        document.getElementById("companyCopyright").textContent = companyCopyright;
    }

    const linksList = getLinksList();
    linksList.forEach(renderLink);
    
    renderArticles();
}

window.addEventListener("load", handleLoad);