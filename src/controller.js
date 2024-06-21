import { pool } from './config/db.js'
import fs from 'node:fs/promises'

/* ---------------FRONTEND----------------------- */
export const html = async (req, res) => {
  const html = await fs.readFile('./public/index.html', 'utf-8')
  res.status(200).send(html)
}

export const css = async (req, res) => {
  const css = await fs.readFile('./public/main.css')
  res.status(200).send(css)
}

export const js = async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/javascript' })
  const css = await fs.readFile('./public/main.js')
  res.send(css)
}

/* ---------------------BACKEND------------------------ */
export const allUser = async (req, res) => {
  const [users] = await pool.query('SELECT * FROM users')
  res.status(200).json(users)
}

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const profile_picture = req.file
    if (!name || !email || !role) { return res.status(400).json({ message: 'Faltan algunos datos de usuario' }) }
    const [result] = await pool.execute('iNSERT INTO users (name, email,password, role,profile_picture) VALUES (?,?,?,?,?)', [name, email, password, role, profile_picture.buffer])
    if (result.affectedRows !== 1 && !result.insertId) {
      return res.status(500).json({ message: 'Error al crear el usuario' })
    }
    res.status(201).json({ message: 'Usuario agregado' })
  } catch (error) {
    return res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, password, role } = req.body
    const profile_picture = req.file

    let query = 'UPDATE users SET'
    const params = []

    if (name) {
      query += ' name=?,'
      params.push(name)
    }

    if (email) {
      query += ' email=?,'
      params.push(email)
    }
    if (password) {
      query += ' password=?,'
      params.push(password)
    }

    if (role) {
      query += ' role=?,'
      params.push(role)
    }

    if (profile_picture) {
      query += ' profile_picture=?,'
      params.push(profile_picture.buffer)
    }
    query = query.slice(0, -1)
    query += ' WHERE id_user=?'
    params.push(id)

    const [result] = await pool.execute(query, params)

    if (result.affectedRows !== 1) {
      return res.status(500).json({ message: 'No se puso actualizar el usuario' })
    }
    res.json({ message: 'Usuario actualizado con exito' })
  } catch (error) {
    return res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  const [result] = await pool.execute('DELETE FROM users WHERE id_user = ?', [id])

  if (result.affectedRows === 1) {
    return res.json({ mesage: 'Usuario eliminado' })
  }
  return res.status(500).json({ message: 'No se pudo eliminar el usuario' })
}
