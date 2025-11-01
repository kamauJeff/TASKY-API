import {type Request, type Response, type NextFunction} from 'express';

export function checkDetails(req: Request, res: Response, next: NextFunction) {
            const { firstName, lastName, userName, emailAddress, password} = req.body;
            if (!firstName) {
                res.status(400).json({message: "First Name is required"})
                return;
            }
            if (!lastName) {
                res.status(400).json({message: "Last Name is required"})
                return;
            }
            if (!userName) {
                res.status(400).json({message: "UserName is required"})
                return;
            }
            if (!emailAddress) {
                res.status(400).json({message: "Email Address is required"})
                return;
            }
            if (!password) {
                res.status(400).json({message: "First Name is required"})
                return;
            }
            next();
}