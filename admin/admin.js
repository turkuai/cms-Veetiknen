// Admin Panel JavaScript

// Global variables to store current data
let articles = [];
let customLinks = [];

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadFooterData();
    loadLogoData();
    loadLinksData();
    loadArticlesData();
});

// ============== LOGO FUNCTIONS ==============

// Load logo data
async function loadLogoData() {
    try {
        const response = await fetch('../api.php?action=load_logo');
        if (response.ok) {
            const logoData = await response.json();
            
            if (logoData.type === 'image') {
                document.getElementById('logoImage').src = '../' + logoData.path;
                document.getElementById('logoImage').style.display = 'block';
                document.getElementById('logoText').style.display = 'none';
            } else {
                document.getElementById('logoText').innerText = logoData.text;
                document.getElementById('logoImage').style.display = 'none';
                document.getElementById('logoText').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading logo:', error);
    }
}

// Handle logo edit button click
function handleLogoEdit() {
    const logoInput = document.getElementById('logoInput');
    logoInput.click();
}

// Handle logo image upload
async function handleLogoImageUpload() {
    const logoInput = document.getElementById('logoInput');
    
    if (logoInput.files && logoInput.files[0]) {
        const formData = new FormData();
        formData.append('logoFile', logoInput.files[0]);
        
        try {
            const response = await fetch('../api.php?action=save_logo', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    loadLogoData(); // Reload logo
                }
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
        }
    }
}

// ============== FOOTER FUNCTIONS ==============

// Load footer data
async function loadFooterData() {
    try {
        const response = await fetch('../api.php?action=load_footer');
        if (response.ok) {
            const footerData = await response.json();
            
            // Update displayed footer text
            document.getElementById('companyName').innerText = footerData.companyName;
            document.getElementById('companyDesc').innerText = footerData.companyDesc;
            document.getElementById('companyCopyright').innerText = footerData.companyCopyright;
            
            // Update hidden input fields
            document.getElementById('companyNameInput').value = footerData.companyName;
            document.getElementById('companyDescInput').value = footerData.companyDesc;
            document.getElementById('companyCopyrightInput').value = footerData.companyCopyright;
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Handle footer edit button click
function handleFooterEdit() {
    const companyNameInput = document.getElementById('companyNameInput');
    const companyDescInput = document.getElementById('companyDescInput');
    const companyCopyrightInput = document.getElementById('companyCopyrightInput');
    const companyName = document.getElementById('companyName');
    const companyDesc = document.getElementById('companyDesc');
    const companyCopyright = document.getElementById('companyCopyright');
    
    if (companyNameInput.hidden) {
        // Switch to edit mode
        companyNameInput.hidden = false;
        companyDescInput.hidden = false;
        companyCopyrightInput.hidden = false;
        companyName.hidden = true;
        companyDesc.hidden = true;
        companyCopyright.hidden = true;
        event.target.innerText = "Save";
    } else {
        // Save changes
        saveFooterData();
        
        // Switch back to display mode
        companyNameInput.hidden = true;
        companyDescInput.hidden = true;
        companyCopyrightInput.hidden = true;
        companyName.hidden = false;
        companyDesc.hidden = false;
        companyCopyright.hidden = false;
        event.target.innerText = "Edit";
    }
}

// Save footer data
async function saveFooterData() {
    const footerData = {
        companyName: document.getElementById('companyNameInput').value,
        companyDesc: document.getElementById('companyDescInput').value,
        companyCopyright: document.getElementById('companyCopyrightInput').value
    };
    
    try {
        const response = await fetch('../api.php?action=save_footer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(footerData)
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                loadFooterData(); // Reload footer data
            }
        }
    } catch (error) {
        console.error('Error saving footer:', error);
    }
}

// ============== LINKS FUNCTIONS ==============

// Load links data
async function loadLinksData() {
    try {
        const response = await fetch('../api.php?action=load_links');
        if (response.ok) {
            const data = await response.json();
            customLinks = data.links || [];
            renderCustomLinks();
        }
    } catch (error) {
        console.error('Error loading links:', error);
    }
}

// Render custom links in the admin panel
function renderCustomLinks() {
    const linkList = document.getElementById('link-list');
    
    // Clear existing links but keep the add button and input fields
    const addButton = linkList.querySelector('button');
    const linkRef = document.getElementById('linkRef');
    const linkName = document.getElementById('linkName');
    
    linkList.innerHTML = '';
    linkList.appendChild(linkRef);
    linkList.appendChild(linkName);
    linkList.appendChild(addButton);
    
    // Add each custom link with edit/delete options
    customLinks.forEach((link, index) => {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'link-container';
        
        const nameElement = document.createElement('span');
        nameElement.innerText = link.name;
        nameElement.style.marginRight = '10px';
        
        const urlElement = document.createElement('a');
        urlElement.href = link.href;
        urlElement.innerText = link.href;
        urlElement.target = '_blank';
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => removeLink(index);
        
        linkContainer.appendChild(nameElement);
        linkContainer.appendChild(urlElement);
        linkContainer.appendChild(deleteButton);
        
        linkList.appendChild(linkContainer);
    });
}

// Handle "Add Link" button click
function handleAddLink(event) {
    const linkRef = document.getElementById('linkRef');
    const linkName = document.getElementById('linkName');
    
    if (linkRef.hidden) {
        // Show input fields
        linkRef.hidden = false;
        linkName.hidden = false;
        event.target.innerText = "Save";
    } else {
        // Save new link
        if (linkRef.value && linkName.value) {
            customLinks.push({
                href: linkRef.value,
                name: linkName.value
            });
            
            saveLinks();
            
            // Clear inputs
            linkRef.value = '';
            linkName.value = '';
            
            // Hide input fields
            linkRef.hidden = true;
            linkName.hidden = true;
            event.target.innerText = "+";
        }
    }
}

// Remove link at specified index
function removeLink(index) {
    customLinks.splice(index, 1);
    saveLinks();
}

// Save all links to server
async function saveLinks() {
    try {
        const response = await fetch('../api.php?action=save_links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ links: customLinks })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                loadLinksData(); // Reload links
            }
        }
    } catch (error) {
        console.error('Error saving links:', error);
    }
}

// ============== ARTICLES FUNCTIONS ==============

// Load articles data
async function loadArticlesData() {
    try {
        const response = await fetch('../api.php?action=load_articles');
        if (response.ok) {
            const data = await response.json();
            articles = data.articles || [];
            renderArticles();
        }
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// Render articles in the admin panel
function renderArticles() {
    const adminArticles = document.getElementById('adminArticles');
    
    if (articles.length === 0) {
        // Show message when no articles exist
        adminArticles.innerHTML = `
            <div class="empty-articles">
                <h2>No Articles Yet</h2>
                <p>Click the "Add New Article" button below to create your first article.</p>
            </div>
        `;
        return;
    }
    
    // Clear existing articles
    adminArticles.innerHTML = '';
    
    // Add each article with edit/delete options
    articles.forEach((article, index) => {
        const articleElement = document.createElement('div');
        articleElement.className = 'admin-article';
        
        let articleContent = `
            <div class="article-header">
                <h2>${article.title}</h2>
                <div class="article-actions">
                    <button onclick="editArticle(${index})">Edit</button>
                    <button onclick="deleteArticle(${index})">Delete</button>
                </div>
            </div>
            <div class="article-content">
                <p>${article.content}</p>
            </div>
        `;
        
        if (article.image) {
            articleContent += `
                <div class="article-image">
                    <img src="../${article.image}" style="max-width: 300px;">
                </div>
            `;
        }
        
        articleElement.innerHTML = articleContent;
        adminArticles.appendChild(articleElement);
    });
}

// Add a new blank article
function addNewArticle() {
    const adminArticles = document.getElementById('adminArticles');
    
    // Create a form for the new article
    const articleForm = document.createElement('div');
    articleForm.className = 'admin-article';
    articleForm.innerHTML = `
        <h2>New Article</h2>
        <div class="form-group">
            <label for="article-title">Title:</label>
            <input type="text" id="article-title" required>
        </div>
        <div class="form-group">
            <label for="article-content">Content:</label>
            <textarea id="article-content" rows="6" required></textarea>
        </div>
        <div class="form-group">
            <label for="article-image">Image:</label>
            <input type="file" id="article-image" accept="image/*">
        </div>
        <div class="form-actions">
            <button onclick="saveNewArticle()">Save</button>
            <button onclick="cancelArticleEdit()">Cancel</button>
        </div>
    `;
    
    adminArticles.innerHTML = '';
    adminArticles.appendChild(articleForm);
}

// Save a new article
async function saveNewArticle() {
    const title = document.getElementById('article-title').value;
    const content = document.getElementById('article-content').value;
    const imageInput = document.getElementById('article-image');
    
    if (!title || !content) {
        alert('Please fill in both title and content fields.');
        return;
    }
    
    // Create new article object
    const newArticle = {
        title: title,
        content: content
    };
    
    // Handle image upload if provided
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            newArticle.image = e.target.result; // Base64 image data
            
            // Add article and save
            articles.push(newArticle);
            await saveArticles();
        };
        
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // Add article without image and save
        articles.push(newArticle);
        await saveArticles();
    }
}

// Edit an existing article
function editArticle(index) {
    const article = articles[index];
    const adminArticles = document.getElementById('adminArticles');
    
    // Create edit form
    const editForm = document.createElement('div');
    editForm.className = 'admin-article';
    
    let formHTML = `
        <h2>Edit Article</h2>
        <div class="form-group">
            <label for="edit-title">Title:</label>
            <input type="text" id="edit-title" value="${article.title}" required>
        </div>
        <div class="form-group">
            <label for="edit-content">Content:</label>
            <textarea id="edit-content" rows="6" required>${article.content}</textarea>
        </div>
        <div class="form-group">
            <label for="edit-image">New Image:</label>
            <input type="file" id="edit-image" accept="image/*">
        </div>
    `;
    
    if (article.image) {
        formHTML += `
            <div class="current-image">
                <p>Current Image:</p>
                <img src="../${article.image}" style="max-width: 300px;">
                <button onclick="removeArticleImage(${index})">Remove Image</button>
            </div>
        `;
    }
    
    formHTML += `
        <div class="form-actions">
            <button onclick="saveArticleEdit(${index})">Save</button>
            <button onclick="cancelArticleEdit()">Cancel</button>
        </div>
    `;
    
    editForm.innerHTML = formHTML;
    
    adminArticles.innerHTML = '';
    adminArticles.appendChild(editForm);
}

// Save edited article
async function saveArticleEdit(index) {
    const title = document.getElementById('edit-title').value;
    const content = document.getElementById('edit-content').value;
    const imageInput = document.getElementById('edit-image');
    
    if (!title || !content) {
        alert('Please fill in both title and content fields.');
        return;
    }
    
    // Update article
    articles[index].title = title;
    articles[index].content = content;
    
    // Handle image upload if provided
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            articles[index].image = e.target.result; // Base64 image data
            await saveArticles();
        };
        
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // Save without changing image
        await saveArticles();
    }
}

// Remove image from article
function removeArticleImage(index) {
    articles[index].image = null;
    editArticle(index); // Refresh edit form
}

// Delete an article
function deleteArticle(index) {
    if (confirm('Are you sure you want to delete this article?')) {
        articles.splice(index, 1);
        saveArticles();
    }
}

// Cancel article edit/creation
function cancelArticleEdit() {
    renderArticles();
}

// Save all articles to server
async function saveArticles() {
    try {
        const response = await fetch('../api.php?action=save_articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ articles: articles })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                loadArticlesData(); // Reload articles
            }
        }
    } catch (error) {
        console.error('Error saving articles:', error);
    }
}