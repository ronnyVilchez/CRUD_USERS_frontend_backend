import multer from 'multer'

const storage = multer.memoryStorage()
export const createImg = multer({ storage })
