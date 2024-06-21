const userList = document.querySelector('.userList')

// Create Users

const formCreate = document.querySelector('.formCreate')
const divCreate = document.querySelector('.create')
const btAdd = document.querySelector('.btAdd')
const nameCreate = document.querySelector('#nameCreate')
const emailCreate = document.querySelector('#emailCreate')
const passwordCreate = document.querySelector('#passwordCreate')
const roleCreate = document.querySelector('#roleCreate')
const profile_pictureCreate = document.querySelector('#profile_pictureCreate')
const closeBtCreate = document.querySelector('.closeBtCreate')

// Edit User

const divUpdate = document.querySelector('.update')
const formUpdate = document.querySelector('.formUpdate')
const nameUpdate = document.querySelector('#nameUpdate')
const emailUpdate = document.querySelector('#emailUpdate')
const passwordUpdate = document.querySelector('#passwordUpdate')
const roleUpdate = document.querySelector('#roleUpdate')
const profile_pictureUpdate = document.querySelector('#profile_pictureUpdate')
const closeBtUpdate = document.querySelector('.closeBtUpdate')

// Delete User

const divDelete = document.querySelector('.divDelete')
const btDeleteUser = document.querySelector('.btDeleteUser')
const overlay = document.querySelector('.overlay')
const closeBt = document.querySelector('.closeBt')

async function fetchUser () {
  const fish = await fetch('/userData')
  const user = await fish.json()
  userList.innerHTML = ''

  user.forEach(user => {
    const { id_user, name, email, role, profile_picture } = user
    const base64Image = arrayBufferToBase64(profile_picture.data)
    const body =
      `<tr class="list" > 
            <td id="id_user">${id_user}</td>
            <td id="name">${name}</td>
            <td id="email">${email}</td>
            <td id="role">${role}</td>
            <td id="imagen"><img src="${base64Image} " alt="Profile Picture" ></td>
            <td>
                <div class="btActions"><button value="${id_user}" class="btEdit" >Edit</button><button
                value="${id_user}"  class="btDelete">Delete</button></div>
            </td>
        </tr>`
    userList.innerHTML += body
  })
}

function arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:image/jpeg;base64,${btoa(binary)}`
}

fetchUser()

btAdd.addEventListener('click', () => {
  divCreate.style.display = 'flex'
})

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault()
  divCreate.style.display = 'none'
  const formData = new FormData()
  formData.append('name', nameCreate.value)
  formData.append('email', emailCreate.value)
  formData.append('password', passwordCreate.value)
  formData.append('role', roleCreate.value)
  formData.append('imagen', profile_pictureCreate.files[0])
  await fetch('/api/user', {
    method: 'POST',
    body: formData

  })
  formCreate.reset()
  fetchUser()
}
)

closeBtCreate.addEventListener('click', () => {
  divCreate.style.display = 'none'
})

userList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btEdit')) {
    divUpdate.style.display = 'flex'
    id_user = e.target.value
    formUpdate.setAttribute('data-id', id_user)
  }
})

formUpdate.addEventListener('submit', async (e) => {
  e.preventDefault()
  divUpdate.style.display = 'none'
  const formData = new FormData()
  formData.append('name', nameUpdate.value)
  formData.append('email', emailUpdate.value)
  formData.append('password', passwordUpdate.value)
  formData.append('role', roleUpdate.value)
  formData.append('imagen', profile_pictureUpdate.files[0])
  const id_user = formUpdate.getAttribute('data-id')
  await fetch(`/api/user/${id_user}`, {
    method: 'PATCH',
    body: formData
  })
  formUpdate.reset()
  fetchUser()
})

closeBtUpdate.addEventListener('click', () => {
  divUpdate.style.display = 'none'
})

userList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btDelete')) {
    overlay.style.display = 'flex'
    divDelete.style.display = 'block'
    id_user = e.target.value
    btDeleteUser.setAttribute('data-id', id_user)
  }
})

btDeleteUser.addEventListener('click', async () => {
  overlay.style.display = 'none'
  divDelete.style.display = 'none'
  const id_user = btDeleteUser.getAttribute('data-id')
  await fetch(`/api/user/${id_user}`, {
    method: 'DELETE'
  })

  fetchUser()
})

closeBt.addEventListener('click', () => {
  overlay.style.display = 'none'
  divDelete.style.display = 'none'
})
