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

    const listElement = document.getElementById("link-list")

    linksList.forEach(linkJson => {
        const aElement = document.createElement("a")
        aElement.innerHTML = linkJson.name 
        aElement.href = linkJson.href 

        listElement.appendChild(aElement)
    });
}

addEventListener("load", handleLoad);

function handleAddLink(e) {
    const button = e.target;
    const editMode = button.innerHTML === "+";
    const inputHidden = !editMode;

    const refInput = document.getElementById("linkRef");
    const nameInput = document.getElementById("linkName");

    refInput.hidden = inputHidden;
    nameInput.hidden = inputHidden;

    if (editMode) {
        button.innerHTML = "Save";
    } else {
        button.innerHTML = "+";

        const listElement = document.getElementById("link-list");

        const aElement = document.createElement("a");
        aElement.innerHTML = nameInput.value;
        aElement.href = refInput.value;

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "-";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = function() {
            handleDeleteLink(aElement, refInput.value, nameInput.value);
        };

        const linkContainer = document.createElement("div");
        linkContainer.classList.add("link-container"); 

        linkContainer.appendChild(aElement);
        linkContainer.appendChild(deleteButton);

        listElement.appendChild(linkContainer);

        const linkJson = {
            href: refInput.value,
            name: nameInput.value,
        };
        linksList.push(linkJson);

        localStorage.setItem("links-list", JSON.stringify(linksList));
    }
}


function handleDeleteLink(aElement, linkHref, linkName) {
    aElement.parentNode.remove();

    const index = linksList.findIndex(link => link.href === linkHref && link.name === linkName);

    if (index !== -1) {
        linksList.splice(index, 1);
        localStorage.setItem("links-list", JSON.stringify(linksList));
    }
}

