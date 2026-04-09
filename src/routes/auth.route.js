import express from 'express';

/** @typedef {import('../controllers/auth.controller.js').AuthController} AuthController*/

/**
 * 
 * @param {*} AuthController 
 * @returns 
 */
export const authRouter = (
    /** @type {AuthController}*/ 
    AuthController)=>{
    const router = express.Router();

    router.get('/login', AuthController.loginPage);

    router.post('/api/v1/login', AuthController.verifyUserAndPassword);

    return router
}