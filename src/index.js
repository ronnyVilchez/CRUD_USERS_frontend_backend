import express from 'express'
import { PORT } from './config/config.js'
import morgan from 'morgan'
import { allUser, createUser, deleteUser, editUser, js, css, html } from './controller.js'
import { createImg } from './multer.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use(express.static('public'))

app.get('/user', html)
app.get('/main.css', css)
app.get('/main.js', js)

app.get('/userData', allUser)

app.post('/api/user', createImg.single('imagen'), createUser)
app.patch('/api/user/:id', createImg.single('imagen'), editUser)
app.delete('/api/user/:id', deleteUser)

app.listen(PORT, () => console.log('Servidor levantado'))
