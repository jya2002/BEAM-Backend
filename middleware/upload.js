const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '..', 'uploads', folderName);

      // Ensure directory exists
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  // Allow only image files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = createUpload;

