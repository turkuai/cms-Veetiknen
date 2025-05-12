let editHeadingMode = false;
let editFooterMode = false;

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