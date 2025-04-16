import db from "./database/db.js";
import app from "./src/app.js";

db.sync()

app.listen(3000, () => console.log('App started'))