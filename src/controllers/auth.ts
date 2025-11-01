import {type Request, type Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';


const client = new PrismaClient(); //initializing PrismaClient
export const register = async function(req: Request, res: Response){
    try {
        const { firstName, lastName, userName, emailAddress, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 11);
        await client.user.create({ // inserts data in the db and this method returns a promise which is consumed using async and await.
            data: {
                firstName,
                lastName,
                userName,
                emailAddress,                 
                password: hashedPassword
            }
        })
        res.status(201).json({message: "Account created successfully"})
    } catch (error) {
        // console.error("Registration error:", error);
        res.status(500).json({message: "Something went wrong"});
        
    }

}

export const login = async function(req:Request, res: Response) {
    try {
        //1. get the identifier and password
        const {identifier, password} = req.body;
        //2. get the user whose username and email address match the identifier
        const user = await client.user.findFirst({
            where: {
                OR: [{emailAddress: identifier}, {userName: identifier}]
            }
        })
        //3. if we don't find a user - wrong login credentials
        if (!user) {
            res.status(400).json({message: "Wrong login credentials"})
            return;            
        }
        // res.send("Logging you in shortly..")
        //4. if we find a user, compare the user password with the given password
         const passwordMatch = await bcrypt.compare(password, user.password);
        //5. if the passwords don't match - wrong login credentials
         if (!passwordMatch) {
            res.status(400).json({message: "Wrong login credentials"})
            return; 
         }
        //6. if they match -login success = prepare payload
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            userName: user.userName,
        }
        //7. generate a token and send it to the client as a cookie 
        const token= jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn: '14d' })
        res.status(200).cookie("authToken", token).json(payload);

    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
        
    }
    
}

export const logout = function (req:Request, res: Response) {
    try {
        res.send(200).clearCookie("authToken").json({message: "Successfully logged out"})
        
    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
        
    }
    
}