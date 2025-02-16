import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import router from './router.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { tempData } from './middlewares/tempDataMiddleware.js';

const app = express();

// TODO :

//* update
//* error handling

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/exam');
    console.log('Connect to DB');
} catch (error) {
    console.log(error.message);
}

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        setTitle(title){
            this.pageTitle = title
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve('src/views'));

app.use(express.static('src/public'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}))
app.use(authMiddleware);
app.use(tempData);
app.use(router);

app.listen(3000, () => console.log('Server is listening on http://localhost:3000...'));