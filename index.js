import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // מאפשר שימוש ב-DELETE ו-PUT בפורמים
app.set("view engine", "ejs");

let list = []; // רשימת הפוסטים

app.get("/", (req, res) => {
  res.render("index", { lists: list }); // שולח את הרשימה לדף הראשי
});

// פונקציה לשמירה של פוסט חדש
function saveBlog(req, res, next) {
  const newPost = {
    id: list.length, // מגדיר ID ייחודי לפוסט
    title: req.body["title"],
    description: req.body["description"],
    tips: req.body["tips"]
  };

  if (newPost.title && newPost.description && newPost.tips) {
    list.push(newPost); // מוסיף את הפוסט החדש לרשימה
  }
  next();
}

app.post("/submit", saveBlog, (req, res) => {
  res.redirect("/"); // מפנה מחדש לדף הראשי במקום לרנדר מחדש
});

// מסלול למחיקת פוסט לפי ID
app.delete("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10); // מזהה הפוסט למחיקה
  list = list.filter(post => post.id !== postId); // מסנן את הפוסט עם ה-ID המתאים
  res.redirect("/"); // חזרה לדף הבית לאחר המחיקה
});


// מסלול GET עבור עריכת פוסט
app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10); // מזהה הפוסט לעריכה
  const post = list.find(p => p.id === postId); // מחפש את הפוסט לפי ID
  if (post) {
    res.render("partials/edit", { post }); // רינדור לדף העריכה עם הפוסט הקיים
  } else {
    res.redirect("/"); // במקרה שאין פוסט מתאים, מחזירים לדף הבית
  }
});

// מסלול POST לעדכון פוסט קיים
app.post("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = list.find(p => p.id === postId); // מחפש את הפוסט לפי ID
  if (post) {
    post.title = req.body["title"];
    post.description = req.body["description"];
    post.tips = req.body["tips"];
  }
  res.redirect("/"); // חזרה לדף הבית לאחר העדכון
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
