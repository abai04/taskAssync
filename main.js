const API = "http://localhost:8000/contacts"
const list = document.querySelector(".list")

//Add
const addBtn = document.querySelector(".add-btn")

const addName = document.querySelector(".name-add")
const addSurname = document.querySelector(".surname-add")
const addPhoto = document.querySelector(".photo-add")
const addNumber = document.querySelector(".number-add")
const addEmail = document.querySelector(".email-add")



addBtn.addEventListener("click", addContact)

function emptyFields(){document.querySelectorAll("input").forEach(e => e.value = "")}

async function addContact(){
    if(!addName.value.trim()|| !addSurname.value.trim() || !addPhoto.value.trim() || !addNumber.value.trim()|| !addEmail.value.trim()){
        alert("Fill all Fields")
        return
    }
    let newContact = {name: addName.value, surname:addSurname.value, photo:addPhoto.value, number:addNumber.value, email:addEmail.value}
    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newContact)
        }) 
    } catch (error) {
        console.log(error);
    }
    emptyFields()
    getContacts()
}

async function getContacts(){
    try {
        let res = await fetch(API)
        let contacts = await res.json()
        render(contacts)
    } catch (error) {
        console.log(error);
    }
}
function render(contacts){
    list.innerHTML = ""
    contacts.forEach(contact => {
        list.innerHTML += `
        <li class = "list-group-item d-flex justify-content-between">
        <div>
        <img src = ${contact.photo}>
        <p>${contact.name}</p>
        <p>${contact.surname}</p>
        <p>${contact.number}</p>
        <p>${contact.email}</p>
        </div>
        <div>
        <button onclick = deleteContact(${contact.id}) class = "btn btn-danger">Delete</button>
        <button onclick = editContact(${contact.id}) class = "btn btn-warning" data-bs-toggle = "modal" data-bs-target = "#editContactModal">Edit</button>
        </div>       
        </li>`
    });
}
getContacts()

//Delete
async function deleteContact(id){
    await fetch(`${API}/${id}`, {
        method: "DELETE"
    })
    getContacts()
}

//Edit
const editBtn = document.querySelector(".edit-btn")
const editName = document.querySelector(".name-edit")
const editSurname = document.querySelector(".surname-edit")
const editPhoto = document.querySelector(".photo-edit")
const editNumber = document.querySelector(".number-edit")
const editEmail = document.querySelector(".email-edit")
let editedContactId = null

async function editContact(id){
    try {
        let res = await fetch(`${API}/${id}`)
        let contactToEdit = await res.json()
        editName.value = contactToEdit.name
        editSurname.value = contactToEdit.surname
        editPhoto.value = contactToEdit.photo
        editNumber.value = contactToEdit.number
        editEmail.value = contactToEdit.email
        editedContactId = id

    } catch (error) {
        console.log(error);
    }
}
editBtn.addEventListener("click", async()=>{
    try {
        let editedContact = {name: editName.value, surname:editSurname.value, photo:editPhoto.value, number:editNumber.value, email:editEmail.value}
        await fetch(`${API}/${editedContactId}`,{
            method: "PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(editedContact)
        })
    } catch (error) {
        console.log(error);
    }
    getContacts()
})