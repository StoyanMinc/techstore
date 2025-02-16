import { Router } from "express";
import computerService from "../services/computers-service.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const homeController = Router();

homeController.get('/', async (req, res) => {
    const computers = await computerService.getLatest();
    res.render('home', { computers });
});

homeController.get('/about', (req, res) => {
    res.render('about');
});

homeController.get('/profile', isAuth, async (req, res) => {
    const { username, email, _id } = req.user;
    try {
        const userOffers = await computerService.getUserComputers(_id);
        const preferredComputers = await computerService.getPrefferdComputers(_id);
        res.render('profile', { userOffers, preferredComputers, username, email });
    } catch (error) {
        res.setError(error.message);
        res.redirect('/404')
    }
});

export default homeController;