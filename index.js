import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";

import PartnerRoute from "./routes/PartnerRoute.js";
import UserRoute from "./routes/UserRoute.js";
import BlogRoute from "./routes/BlogRoute.js";
import EmployeeRoute from "./routes/EmployeeRoute.js";
import ExternalEmployeeRoute from "./routes/ExternalEmployeeRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import GalleryRoute from "./routes/GalleryRoute.js";
import FAQRoute from "./routes/FAQRoute.js";
import InboxRoute from "./routes/InboxRoute.js";
import MatelRoute from "./routes/MatelRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async()=>{
//     await db.sync();
// })();

/* MIDDLEWARE */
app.use(cors({
    //mengizinkan frontend untuk mengirim request/cookie ke server 
    credentials: true,
    //domain yang diizinkan
    origin: process.env.CLIENT_URL,
}));

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));


app.use(UserRoute);
app.use(BlogRoute);
app.use(EmployeeRoute);
app.use(ExternalEmployeeRoute);
app.use(PartnerRoute);
app.use(AuthRoute);
app.use(GalleryRoute);
app.use(FAQRoute);
app.use(InboxRoute);
app.use(MatelRoute);

//membuat tabel session
// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});