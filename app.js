import express from "express";
import path from "path";
import userModel from "./models/user.js";


const app = express();

const __dirname = path.resolve();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
   res.redirect('/readuser')
  console.log(user);
});

app.get('/upload',(req,res)=>{
  res.render('testMulter')
})


app.post('/upload',(req,res)=>{
  // console.log(req.body) //req.body contains the values of the text fields of the form
 // console.log(req.file)//req.file contains the files uploaded via the form.
})

app.listen(3000);
