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
}

addEventListener("load", handleLoad);

function handleAddLink(e) {

    const button = e.target
    const editMode = button.innerHTML == "+"
    const inputHidden = !editMode

    const refInput = document.getElementById("linkRef")
    const nameInput = document.getElementById("linkName")
    
    refInput.hidden = inputHidden
    nameInput.hidden = inputHidden

    if (editMode) {
        button.innerHTML = "Save"
    } else {
        button.innerHTML = "+"

        // Here we save
        const listElement = document.getElementById("link-list")

        const aElement = document.createElement("a")
        aElement.innerHTML = nameInput.value 
        aElement.href = refInput.value 

        listElement.appendChild(aElement)

    }



}