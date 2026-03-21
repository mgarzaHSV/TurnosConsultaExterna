import express from 'express';

export const mainRouter = (MainController)=>{
    const router = express.Router();
    

    router.get("/", MainController.getMain);


    return router;
}