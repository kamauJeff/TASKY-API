import {type Request, type Response, type NextFunction} from 'express';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient(); //initializing PrismaClient


export async function checkUsernameAndEmailAddress(req:Request, res: Response, next: NextFunction) {
            try {
                const { userName, emailAddress} = req.body;
                const userWithEmailAddress = await client.user.findUnique({
                    where: {emailAddress}
                })
                if (userWithEmailAddress) {
                    res.status(400).json({message: "The EmailAddress you provided is already associated with an account"});
                    return;
   
                }
                const userWithUserName = await client.user.findUnique({
                    where: {userName}
                })
                if (userWithUserName) {
                    res.status(400).json({message: "The Username you provided is already associated with an account"});
                    return;
                }
                next();
                
            } catch (error) {
                console.log("Mddleware error:", error);
                
                res.status(500).json({message: "Something went wrong"});
                
            }
    
}