import express from 'express';

export const authRouter = (AuthController)=>{
    const router = express.Router();

    router.get('/login', AuthController.loginPage);

    router.post('/api/v1/login', AuthController.verifyUserAndPassword);

    return router
}