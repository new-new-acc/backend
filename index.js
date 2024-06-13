const express = require('express')
const mongoose = require("mongoose")
const dotenv = require('dotenv').config()
const cors = require('cors')
const authController = require('./controllers/authController')
const blogController = require('./controllers/blogController')
const multer = require('multer')
const app = express()

// подключение в БД МОНГО
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, () => console.log('Подключение к монго успешно'))

// маршрутизация
app.use('/images', express.static('public/images'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/blog', blogController)


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images')
    },
    filename: function(req, file, cb){
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage: storage
})

app.post('/upload', upload.single("image"), async(req, res) => {
    return res.status(200).json({msg: "Картинка загружена"})
})

// запуск сервера
app.listen(process.env.PORT, () => console.log('Сервер запустился'))