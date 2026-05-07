# TOP-File-Uploader

**TOP-File-Uploader** (also known as File Space) is a full-stack personal file hosting and management application, inspired by services like Google Drive. It was built as a capstone project for [The Odin Project's Node.js curriculum](https://www.theodinproject.com/lessons/nodejs-file-uploader).

This application allows users to create accounts, authenticate securely, and manage their own files and folders in a structured repository. Users can upload various types of files (images, documents, etc.), organize them into folders, rename them, view file details, and safely delete them.

**Live Preview:** [File Space](https://file-space.onrender.com/)

> ⚠️ **Note:** This project is hosted on a free Render tier. Due to cold starts, the page may take up to 50 seconds to load initially. Please be patient!

---

## 📸 Screenshots

## HomePage

![Homepage](/public/images/homepage.webp)

![Information displayed in the homepage explaining the page functionalities](/public/images/homepage2.webp)

## Log In and Sign Up

![Log In form](/public/images/login.webp)

![Sign Up form](/public/images/signup.webp)

## Files View

![Page showing the files of the user that is logged in](/public/images/filesview.webp)

![Option menu that opens when the user right clicks a file or folder](/public/images/options.webp)

## Add File

![Add file form](/public/images/addfile.webp)

## Add Folder

![Add folder form](/public/images/addfolder.webp)

## Delte File/Folder

![Warning that appear before deleting a file](/public/images/delete.webp)

## Rename

![Form to rename a file or folder](/public/images/rename.webp)

## More Info

## ![Modal that displays extra information of the selected file or folder](/public/images/moreinfo.webp)

## 🛠 Built With

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, CSS
- **Database & ORM:** PostgreSQL, Prisma
- **Authentication:** Passport.js, express-session (with Prisma session store)
- **File Uploads & Storage:** Multer, Cloudinary
- **Deployment:** Render

## ✨ Features

- **User Authentication:** Secure sign up, log in, and log out functionality.
- **File Management:** Upload files with automatic size and extension tracking.
- **Folder System:** Create, read, update, and delete folders, including nested sub-folders.
- **Media Storage:** Files are securely uploaded to and served from Cloudinary.
- **Privacy:** Users only have access to their own files and folders.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js installed
- A local or cloud PostgreSQL database
- A free Cloudinary account

## 👤 Author

- Website: [pabloperezweb.com](http://pabloperezweb.com)
- GitHub: [@yaoming16](https://github.com/yaoming16)
