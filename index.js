const submitBtn = document.getElementById("submit-button");
const nameInput = document.getElementById("name");
const memberList = document.getElementById("member-list");

const minNameLength = 2;

//creates div element to append to the member-list
function createNameDiv(name) {
    const div = document.createElement("div");
    div.innerHTML = name;
    div.className = "member-item";
    return div;
}
//clears member-list before filling it to avoid data redundancy
function clearListDisplay(HTMLlist) {
    while (HTMLlist.firstChild) HTMLlist.removeChild(HTMLlist.firstChild);
}
//displays every argonautes names
function displayData(data) {
    clearListDisplay(memberList);
    for (let i = 0; i < data.length; i++) {
        const child = createNameDiv(data[i].nom);
        memberList.appendChild(child);
    }
}
//verifies if the argonautes in registration process is alredy on the list
async function checkRedundancy(name) {
    let result = await fetch("/api/getMembers")
        .then((response) => response.json())
        .then((data) => {
            console.log(data, name);
            for (let i = 0; i < data.length; i++) {
                if (data[i].nom == name) return true;
            }
            return false;
        });
    return result;
}
//adds new argonaute to DB then displays DB
function addMember() {
    const name = nameInput.value;
    fetch("/api/addMember", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
        }),
    })
        .then((response) => response.json())
        //returns every names inside the database to display them dynamically
        .then((data) => displayData(data));

    //clears name input once member added
    nameInput.value = "";
}

//checks to see if a string contains only accpeted characters
function isValidFormat(string) {
    const validChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM- ";
    for (let i = 0; i < string.length; i++) {
        for (let j = 0; j < validChars.length; j++) {
            if (string[i] == validChars[j]) break;
            if (j + 1 == validChars.length) return false;
        }
    }
    return true;
}

submitBtn.onclick = function () {
    const name = nameInput.value;
    if (name.length < minNameLength) return alert("name too short");
    if (!isValidFormat(name))
        return alert(
            "the argonaute's name can only contain letters, spaces and hyphens"
        );
    checkRedundancy(name).then((isRedundant) => {
        if (isRedundant) alert("argonaute already on the list");
        else addMember();
    });
};

addEventListener("keydown", (key) => {
    if (key.keyCode == 13) submitBtn.click();
});

//initializes the display of the argonautes in the database
(function initializeDisplay() {
    fetch("/api/getMembers")
        .then((response) => response.json())
        .then((data) => displayData(data));
})();
