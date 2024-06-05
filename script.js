const baseAPIURL = 'https://jsonplaceholder.typicode.com/posts'
let posts = []

const postListHTML = document.getElementById('postList')

const handleFormSubmit=()=> {
    const postTitleInput = document.getElementById('postTitle')
    const postBodyInput = document.getElementById('postBody')

    if(postTitleInput.value.trim() == '' || postBodyInput.value.trim() == '') {
        alert('Ambos campos son obligatorios')
        return
    }

    fetch(baseAPIURL, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitleInput.value,
            body: postBodyInput.value,
            id: 0,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    })
        .then(res => res.json())
        .then(data => {
            posts.push(data) // Unshift won't work, but push does work, somehow?
            renderPosts()
            postTitleInput.value = ''
            postBodyInput.value = ''
        })
        .catch(err => console.log(err))

    getData()
}

function getData() {
    fetch(baseAPIURL)
        .then(res => res.json())
        .then(data => { 
            posts = data
            renderPosts()
        }).catch(err => console.error(err))
}
getData()

function renderPosts() {
    postListHTML.innerHTML = ''
    posts.forEach((post, i) => {
        if (i > 95) { // This particular if statement prevents the rendering of 100 posts into the page, rendering only 5 pulled from the API + any amount of new posts the user creates
            const postToAppend = document.createElement('div')
            postToAppend.classList.add('postItem')

            postToAppend.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.body}</p>
            <button onclick="showEditMenu(${post.id})">Editar</button>
            <button onclick="deletePost(${post.id})">Borrar</button>
            
            <div id="editForm-${post.id}" class="editForm" style="display: none">
                <label for="editTitle-${post.id}">Título: </label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required></input>

                <label for="editBody-${post.id}">Mensaje: </label>
                <textarea id="editBody-${post.id}" required rows="8">${post.body}</textarea>

                <button onclick="updatePost(${post.id})">Update</button>
            </div>
            `

            postListHTML.appendChild(postToAppend)
        }
    })
}

function showEditMenu(postId) {
    const editForm = document.getElementById(`editForm-${postId}`)
    editForm.style.display = 'block'
}

function updatePost(postId) {
    const editTitle = document.getElementById(`editTitle-${postId}`)
    const editBody = document.getElementById(`editBody-${postId}`)

    fetch(`${baseAPIURL}/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: postId,
            title: editTitle.value,
            body: editBody.value,
            userId: 1
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .then(res => res.json())
        .then(data => {
            const postIndex = posts.findIndex(post => post.id == data.id)
            if (postIndex != -1) {
                posts[postIndex] = data
                renderPosts()
            } else alert('Hubo un error al actualizar la información del posteo, refresque la página e inténtelo de nuevo')
        })
        .catch(err => console.error(err))
}

function deletePost(postId) {
    fetch(`${baseAPIURL}/${postId}`, ({
        method: 'DELETE'
    }))
    .then(res => {
        if(res.ok) {
            posts = posts.filter(post => post.id != postId)
            renderPosts()
        } else alert('Hubo un error al borrar el posteo, refresque la página e inténtelo de nuevo')
    })
    .catch(err => console.error(err))
}