import express from "express";
import path from "path";
import userModel from "./models/user.js";
import multer from "multer";
import crypto from 'crypto'

const app = express();

const __dirname = path.resolve();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// for multer we need to setup the storage, multer is used as a middleware

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/files");//destination or the path of the file where the uploaded file is going to be stored
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, bytes) => {
      const fn = bytes.toString("hex") + path.extname(file.originalname);// generate a random name for everysingle file so that if any file with same name is being uploaded then it wont be replace the previous file but will have a new file name as newfile
      //path.extname():this function is use to take out the extension of the file(Using file.orignalname) and then added it to the new file name
      cb(null, fn);
    });
  },
});
  
  
const upload = multer({ storage });//it needs to be kept just after storage before any route, iy will be used as a middleware

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/readuser", async (req, res) => {
  let usersData = await userModel.find();
  res.render("seeuser", { usersData: usersData });
  console.log(usersData);
});

app.post("/create", async (req, res) => {
  const { name, email, imageurl } = req.body;
  let user = await userModel.create({
    name,
    email,
    imageurl,
  });
  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  let deletedUser = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/readuser");
});

app.get("/edit/:id", async (req, res) => {
  let data = await userModel.findOne({ _id: req.params.id });
  console.log(req.body);
  res.render("edit", { data: data });
});

app.post("/edit/:id", async (req, res) => {
  const { name, email, imageurl } = req.body;

  let user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, imageurl },
    { new: true }
  );
  res.redirect("/readuser");
  console.log(user);
});

app.get("/upload", (req, res) => {
  res.render("testMulter");
});

app.post("/upload", upload.single('file'),(req, res) => {
  // console.log(req.body) //req.body contains the values of the text fields of the form
  // console.log(req.file)//req.file contains the files uploaded via the form.
  console.log(req.file)
});

app.listen(3000);
