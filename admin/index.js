let editHeadingMode = false;
let editFooterMode = false;
let editArticleTitleMode = false;
let editArticleTitleMode2 = false;
let editArticleContentMode = false;
let editArticleContentMode2 = false;

function handleHeadingEdit() {
    console.log("handleHeadingEdit", editHeadingMode);

    editHeadingMode = !editHeadingMode;
    console.log("after change", editHeadingMode);

    const headingElement = document.getElementById("logo");
    const inputElement = document.getElementById("logoInput");

    if (!editHeadingMode) {
        const logo = inputElement.value;
        headingElement.innerHTML = logo;
        localStorage.setItem("logo", logo);
    }

    headingElement.hidden = editHeadingMode;
    inputElement.hidden = !editHeadingMode;
    document.getElementById("logoButton").innerHTML = editHeadingMode ? "Save" : "Edit";
}

function handleTitleEdit() {
    console.log("handleTitleEdit", editArticleTitleMode);

    editArticleTitleMode = !editArticleTitleMode;
    console.log("after change", editArticleTitleMode);

    const TitleElement = document.getElementById("ArticleTitle");
    const inputTitle = document.getElementById("TitleInput");

    if (editArticleTitleMode) {
        inputTitle.value = TitleElement.textContent;
    } else {
        const Title = inputTitle.value;
        TitleElement.textContent = Title;
        localStorage.setItem("Title", Title);
    }

    TitleElement.hidden = editArticleTitleMode;
    inputTitle.hidden = !editArticleTitleMode;
    document.getElementById("TitleButton").innerHTML = editArticleTitleMode ? "Save" : "Edit";
}

function handleTitleEdit2 () {
    console.log("handleTitleEdit", editArticleTitleMode2);

    editArticleTitleMode2 = !editArticleTitleMode2;
    console.log("after change", editArticleTitleMode2);

    const TitleElement2 = document.getElementById("ArticleTitle2");
    const inputTitle2 = document.getElementById("TitleInput2");

    if (editArticleTitleMode2) {
        inputTitle2.value = TitleElement2.textContent;
    } else {
        const Title2 = inputTitle2.value;
        TitleElement2.textContent = Title2;
        localStorage.setItem("Title2", Title2);
    }

    TitleElement2.hidden = editArticleTitleMode2;
    inputTitle2.hidden = !editArticleTitleMode2;
    document.getElementById("TitleButton2").innerHTML = editArticleTitleMode2 ? "Save" : "Edit";
}

function handleContentEdit() {
    console.log("handleContentEdit", editArticleContentMode);

    editArticleContentMode = !editArticleContentMode;
    console.log("after change", editArticleContentMode);

    const ContentElement = document.getElementById("ArticleContent1")
    const inputContent = document.getElementById("ContentInput1")

    if (editArticleContentMode) {
        inputContent.value = ContentElement.textContent;
    } else {
        const Content = inputContent.value;
        ContentElement.textContent = Content;
        localStorage.setItem("Content", Content)
    }
    ContentElement.hidden = editArticleContentMode;
    inputContent.hidden = !editArticleContentMode;
    document.getElementById("ContentButton1").innerHTML = editArticleContentMode ? "Save" : "Edit";
}

function handleContentEdit2() {
    console.log("handleContentEdit2", editArticleContentMode2);

    editArticleContentMode2 = !editArticleContentMode2;
    console.log("after change", editArticleContentMode2);

    const contentElement = document.getElementById("ArticleContent2");
    const inputElement = document.getElementById("ContentInput2");

    if (editArticleContentMode2) {
        inputElement.value = contentElement.textContent;
    } else {
        const newContent = inputElement.value;
        contentElement.textContent = newContent;
        localStorage.setItem("Content2", newContent);
    }

    contentElement.hidden = editArticleContentMode2;
    inputElement.hidden = !editArticleContentMode2;

    document.getElementById("ContentButton2").innerHTML = editArticleContentMode2 ? "Save" : "Edit";
}

function handleFooterNote() {
    editFooterMode = !editFooterMode;

    const name = document.getElementById("companyName");
    const desc = document.getElementById("companyDesc");
    const copyright = document.getElementById("companyCopyright");

    const nameInput = document.getElementById("companyNameInput");
    const descInput = document.getElementById("companyDescInput");
    const copyrightInput = document.getElementById("companyCopyrightInput");

    if (!editFooterMode) {
        name.innerHTML = nameInput.value;
        desc.innerHTML = descInput.value;
        copyright.innerHTML = copyrightInput.value;

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

const savedLinks = localStorage.getItem("links-list")

const linksList = savedLinks ? JSON.parse(savedLinks) : []

function handleLoad() {
    const logo = localStorage.getItem("logo");
    if (logo) {
        document.getElementById("logo").innerHTML = logo;
        document.getElementById("logoInput").value = logo;
    }

    const companyName = localStorage.getItem("companyName");
    const companyDesc = localStorage.getItem("companyDesc");
    const companyCopyright = localStorage.getItem("companyCopyright");

    if (companyName) {
        document.getElementById("companyName").innerHTML = companyName;
        document.getElementById("companyNameInput").value = companyName;
    }
    if (companyDesc) {
        document.getElementById("companyDesc").innerHTML = companyDesc;
        document.getElementById("companyDescInput").value = companyDesc;
    }
    if (companyCopyright) {
        document.getElementById("companyCopyright").innerHTML = companyCopyright;
        document.getElementById("companyCopyrightInput").value = companyCopyright;
    }

    const savedTitle = localStorage.getItem("Title");
    if (savedTitle) {
        document.getElementById("ArticleTitle").innerHTML = savedTitle;
        document.getElementById("TitleInput").value = savedTitle;
    }

    const savedTitle2 = localStorage.getItem("Title2");
    if (savedTitle) {
        document.getElementById("ArticleTitle2").innerHTML = savedTitle2;
        document.getElementById("TitleInput2").value = savedTitle2;
    }

    const savedContent = localStorage.getItem("Content");
    if (savedContent) {
        document.getElementById("ArticleContent1").innerHTML = savedContent;
        document.getElementById("ContentInput1").value = savedContent
    }

    const savedContent2 = localStorage.getItem("Content2");
    if (savedContent2) { 
        document.getElementById("ArticleContent2").textContent = savedContent2;
        document.getElementById("ContentInput2").value = savedContent2;
    }

    linksList.forEach(renderLink);
}
   
addEventListener("load", handleLoad);

function renderLink(linkJson) {
    const listElement = document.getElementById("link-list");

    const linkContainer = document.createElement("div");
    linkContainer.classList.add("link-container");

    const aElement = document.createElement("a");
    aElement.innerHTML = linkJson.name;
    aElement.href = linkJson.href;

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "-";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => {
        handleDeleteLink(linkContainer, linkJson);
    };

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.classList.add("edit-btn");
    editButton.onclick = () => {
        handleEditLink(linkContainer, linkJson);
    };

    linkContainer.appendChild(aElement);
    linkContainer.appendChild(editButton);
    linkContainer.appendChild(deleteButton);
    listElement.appendChild(linkContainer);
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
        linksList.push(linkJson);
        localStorage.setItem("links-list", JSON.stringify(linksList));
        renderLink(linkJson);
    }
}


function handleDeleteLink(container, linkJson) {
    container.remove();

    const index = linksList.findIndex(
        link => link.href === linkJson.href && link.name === linkJson.name
    );
    if (index !== -1) {
        linksList.splice(index, 1);
        localStorage.setItem("links-list", JSON.stringify(linksList));
    }
}

function handleEditLink(container, linkJson) {
    container.innerHTML = "";

    const nameInput = document.createElement("input");
    const hrefInput = document.createElement("input");
    nameInput.value = linkJson.name;
    hrefInput.value = linkJson.href;

    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save";
    saveButton.onclick = () => {
        const updatedLink = {
            name: nameInput.value,
            href: hrefInput.value,
        };

        const index = linksList.findIndex(
            link => link.href === linkJson.href && link.name === linkJson.name
        );
        if (index !== -1) {
            linksList[index] = updatedLink;
            localStorage.setItem("links-list", JSON.stringify(linksList));

            container.innerHTML = "";
            renderLink(updatedLink);
        }
    };

    container.appendChild(nameInput);
    container.appendChild(hrefInput);
    container.appendChild(saveButton);
}