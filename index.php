<?php
// Include the utility functions
// require_once 'utils.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Layout</title>
    <link rel="stylesheet" href="styles.css">
</head>
<script>
    async function loadData() {
        try {
            // Load logo
            const logoResponse = await fetch('api.php?action=load_logo');
            if (logoResponse.ok) {
                const logoData = await logoResponse.json();
                const logoElement = document.getElementById("logo");
                
                if (logoData.type === 'image') {
                    logoElement.innerHTML = `<img src="${logoData.path}" style="max-height: 100px;">`;
                } else {
                    logoElement.textContent = logoData.text;
                }
            }

            // Load footer info
            const footerResponse = await fetch('api.php?action=load_footer');
            if (footerResponse.ok) {
                const footerData = await footerResponse.json();
                
                if (footerData.companyName) {
                    document.getElementById("companyName").innerText = footerData.companyName;
                }
                if (footerData.companyDesc) {
                    document.getElementById("companyDesc").innerText = footerData.companyDesc;
                }
                if (footerData.companyCopyright) {
                    document.getElementById("companyCopyright").innerText = footerData.companyCopyright;
                }
            }

            // Load custom links
            const linksResponse = await fetch('api.php?action=load_links');
            if (linksResponse.ok) {
                const linksData = await linksResponse.json();
                const listElement = document.querySelector(".links2");
                
                linksData.links.forEach(link => {
                    const aElement = document.createElement("a");
                    aElement.innerText = link.name;
                    aElement.href = link.href;
                    listElement.appendChild(aElement);
                });
            }

            // Load articles
            const articlesResponse = await fetch('api.php?action=load_articles');
            if (articlesResponse.ok) {
                const articlesData = await articlesResponse.json();
                const articleContainer = document.getElementById("articles");
                
                if (articlesData.articles.length > 0) {
                    articleContainer.innerHTML = '';
                    
                    articlesData.articles.forEach((article) => {
                        const articleElement = document.createElement("article");

                        articleElement.innerHTML = `
                            <h2>${article.title}</h2>
                            <div class="content">
                                <p>${article.content}</p>
                                ${article.image ? `<img src="${article.image}" style="max-width:100%;">` : ""}
                            </div>
                        `;

                        articleContainer.appendChild(articleElement);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    addEventListener("load", loadData);
</script>

<body>
    <header>
        <div class="logo" id="logo">LOGO</div>
        <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="admin/index.php">Admin</a>
        </nav>
    </header>

    <main id="articles">
        <article>
            <h2>Welcome to our Blog</h2>
            <div class="content">
                <p>This is a sample article. Log in to the admin panel to add, edit or delete articles.</p>
                <p>You can access the admin panel by clicking the Admin link in the navigation bar.</p>
            </div>
        </article>
    </main>

    <footer>
        <div class="company-info">
            <h3 id="companyName">Your company's name</h3>
            <p id="companyDesc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p id="companyCopyright">© 2024, Company's name. All rights reserved.</p>
        </div>

        <div class="links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="admin/index.php">Admin</a>
        </div>
        <div class="links2">
            <!-- Custom links will be added here by JavaScript -->
        </div>
    </footer>
    
</body>
</html>