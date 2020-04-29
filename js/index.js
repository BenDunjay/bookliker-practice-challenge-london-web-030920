document.addEventListener("DOMContentLoaded", function() {


const BASE_URL = "http://localhost:3000";
const BOOKS_URL = `${BASE_URL}/books/`;
const listPanel = document.querySelector('#list-panel')
const showPanel = document.querySelector('#show-panel')
const currentUser = {"id":1, "username":"pouros"}

const apiHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const get = (url) => {
    return fetch(url).then((resp) => resp.json());
  };

  const patch = (url, bookId, book) => {
    return fetch(url + bookId, {
      method: "PATCH",
      headers: apiHeaders,
      body: JSON.stringify( book),
    }).then((resp) => resp.json());
  };

  const API = {get, patch};

  const getBooks = () => {
      API.get(BOOKS_URL).then((books) =>
      books.forEach(book => renderBook(book)))
  }
  // render Book
  function renderBook(book){
    const bookUl = document.createElement('ul')
    const image = document.createElement('img')
    image.src = book.img_url
    bookUl.appendChild(image)
    listPanel.appendChild(bookUl)
    image.addEventListener('click', function(e){
        renderBookText(book)
    })

  }

  //render Book Text
function renderBookText(book){
    showPanel.innerHTML = ""
    const bookTitle = document.createElement('h2')
    bookTitle.innerHTML = book.title 
    const bookDesc = document.createElement('p')
    bookDesc.innerHTML = book.description
    const usernameList = document.createElement('ul')
    const likeButton = document.createElement('button')
    likeButton.innerText = "Like <3"

    // if book has users send them to be rendered at the renderUsers function
    if (book.users.length > 0){
        for (const bookUser of book.users){
            renderUsers(bookUser.username, usernameList)
        }
    }

    likeButton.addEventListener('click', function(e){
        handleUserList(book, usernameList)
    })

    showPanel.append(bookTitle, bookDesc, usernameList, likeButton)

}
// render Book Users
function renderUsers(username, usernameList){
    const userList = document.createElement('li')
    userList.innerHTML = username
    usernameList.appendChild(userList)
}

//add or remove user from the current list
function handleUserList(book, ul){
    if (!isUserIncluded(book)){
        book.users.push(currentUser)
        API.patch(BOOKS_URL, book.id, book).then((user) => {
            const li = document.createElement('li')
            li.innerHTML = currentUser.username
            li.id = `user-${currentUser.id}`
            ul.append(li)
            ul.nextSibling.innerText = "Unlike Me"
        })
    }
    else {
        book.users = book.users.filter(bookUser => bookUser.id !== currentUser.id)
        API.patch(BOOKS_URL, book.id, book).then((user) =>{
        const findLi = document.querySelector(`#user-${currentUser.id}`)
        findLi.remove()
        ul.nextSibling.innerText = "Like <3"
        })
        }
}

const isUserIncluded = (book) => 
{
    return book.users.find(bookUsr => bookUsr.id === currentUser.id)
}

getBooks()
});