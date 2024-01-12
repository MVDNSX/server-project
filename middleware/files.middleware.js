const multer = require('multer')
const uuid = require('uuid')

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, './dishImage')
  },
  filename: (req, file, cb) => {
    cb(null, uuid.v4() + '.png')
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png') {
    cb(null, true)
  }else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 4
}

module.exports = multer({
  storage,
  fileFilter,
  limits

})