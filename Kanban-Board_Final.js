// INITIALIZATION

const listsOptions = document.querySelectorAll(".list .options");
const itemLists = document.querySelectorAll(".list-items");

for (let i = 0; i < itemLists.length; i++) {
  let sp = document.createElement("div");
  sp.setAttribute("class", "space");
  sp.setAttribute("ondragover", `allowDrop(event)`);
  sp.setAttribute("ondrop", `onDrop(event)`);
  sp.setAttribute("id", i); //id of 'space'-class div element is the listId
  itemLists[i].appendChild(sp);
}

let itemNum = 0;
let listItems = [];

const addButtons = document.querySelectorAll(".add-button");

// clone delete button from html file and delete that original button
const deleteButtons = document.querySelectorAll(".delete-button");
let deleteButton = deleteButtons[0];
let deleteButtonClone;
deleteButtons[0].remove();

let newestItem = null;

let editing = false;
let currentItemId = 0;

let newestItemAutodeleted = false;

let currentListId;
let lastListId;

// ADDING, DELETING, AND EDITING

function add(listId) {
  if (listId != null && currentListId != null && listId != currentListId)
    done(currentListId);
  lastListId = currentListId;
  currentListId = listId;
  if (
    newestItemAutodeleted ||
    (newestItem != null && newestItem.textContent != "") ||
    !addButtons[listId].classList.contains("adding")
  ) {
    editing = true;
    const newItem = document.createElement("div");
    newItem.setAttribute("class", "list-item");
    newItem.setAttribute("contenteditable", "true");
    newItem.setAttribute("draggable", "true");
    newItem.setAttribute("ondragstart", `drag(event)`);
    newItem.setAttribute("onclick", `edit(${itemNum}, ${listId})`);
    newItem.setAttribute("id", itemNum);
    itemNum++;
    listItems.push(newItem);

    itemLists[listId].appendChild(newItem);

    let sp = document.createElement("div");
    sp.setAttribute("class", "space");
    sp.setAttribute("ondragover", `allowDrop(event)`);
    sp.setAttribute("ondrop", `onDrop(event)`);
    sp.setAttribute("id", listId);
    itemLists[listId].appendChild(sp);

    newItem.focus();
    newestItem = newItem;
    newestItemAutodeleted = false;
    addButtons[listId].classList.add("adding");
    addButtons[listId].textContent = "+ Add Item ";
    deleteButtonClone = deleteButton;
    deleteButtonClone.setAttribute("onclick", `del(${listId})`);
    listsOptions[listId].appendChild(deleteButtonClone);
  } else {
    newestItem.focus();
  }
}

function del(listId) {
  if (editing) {
    listItems[currentItemId].classList.remove("list-item");
    listItems[currentItemId].setAttribute("contenteditable", "false");
    listItems[currentItemId].textContent = "";
    listItems[currentItemId].nextSibling.remove();
    done(listId);
  }
  addButtons[listId].classList.remove("adding");
  addButtons[listId].classList.add("add-button");
  deleteButtonClone.remove();
}

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.target.blur();
    if (e.target.textContent == "") e.target.remove();
    done(-1);
  }
});

//save ids of the items to delete. No need to add.
function edit(itemId, listId) {
  lastListId = currentListId;
  currentListId = listId;
  if (listId != lastListId) {
    done(lastListId);
  }

  console.log(lastListId);
  console.log(listId);
  if (listItems[itemId] != newestItem) {
    if (newestItem.textContent == "") newestItem.remove();
    newestItemAutodeleted = true;
  }
  addButtons[listId].classList.add("adding");
  addButtons[listId].textContent = "+ Add Item ";
  deleteButtonClone = deleteButton;
  deleteButtonClone.setAttribute("onclick", `del(${listId})`);
  listsOptions[listId].appendChild(deleteButtonClone);
  currentItemId = itemId;
  editing = true;
}

function done(listId) {
  if (newestItem.textContent == "") {
    newestItem.nextSibling.remove();
    newestItem.remove();
  }
  if (listId == -1) listId = currentListId;
  addButtons[listId].classList.remove("adding");
  addButtons[listId].classList.add("add-button");
  addButtons[listId].textContent = "+ Add an Item ";
  deleteButtonClone.remove();
  newestItem.blur();
  editing = false;
}

// DRAG AND DROP

//REFERENCES: 
//  https://www.w3schools.com/html/html5_draganddrop.asp
//  https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib

function drag(e) {
  if (editing) return;
  e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e) {
  if (editing) return;
  e.preventDefault();
}

function onDrop(e) {
  if (editing) return;
  e.preventDefault();
  let data = e.dataTransfer.getData("text");
  let elem = document.getElementById(data);
  elem.nextSibling.remove();
  let sp = document.createElement("div");
  sp.setAttribute("class", "space");
  sp.setAttribute("ondragover", `allowDrop(event)`);
  sp.setAttribute("ondrop", `onDrop(event)`);
  sp.setAttribute("id", e.target.id);

  elem.setAttribute("onclick", `edit(${elem.id}, ${e.target.id})`);

  e.target.parentNode.insertBefore(sp, e.target.nextSibling);
  e.target.parentNode.insertBefore(elem, e.target.nextSibling);
}
