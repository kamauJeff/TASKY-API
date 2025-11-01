import express, {type Request, type Response, type NextFunction} from 'express';

import dotenv from 'dotenv';
import {register, login, logout} from './controllers/auth.ts'; 
import {checkDetails} from './middlewares/checkDetails.ts';
import {checkUsernameAndEmailAddress} from './middlewares/checkUsernameAndEmailAddress.ts'
import {checkPasswordStrength} from './middlewares/checkPasswordStrength.ts';

const app = express(); //initializing express
dotenv.config();
app.use(express.json()) // middleware that makes express understand line 13

// setting up default endpoint or the home route  
app.get("/", (_req, res) => {
    res.status(200).send("<h1>Welcome to Tasky API</h1>")
})


app.post('/auth/register', checkDetails, checkUsernameAndEmailAddress, checkPasswordStrength, register);
app.post('/auth/login', login);
app.post('/auth/login', logout);




//setting the server to listen to requests
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`App is live at: http://localhost:${PORT}`);     
});