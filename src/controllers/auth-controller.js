import { Router } from "express";

import { authService } from "../services/auth-service.js";
import { getErrorMessage } from "../utils/getError.js";

const authController = Router();

authController.get('/register', (req, res) => {
    res.render('register');
})

authController.post('/register', async (req, res) => {
    const formData = req.body;
    try {
        const token = await authService.register(formData);
        res.cookie('auth', token);
        res.redirect('/');

    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.render('register', { username: formData.username, email: formData.email, error: errorMessage});
    }
});

authController.get('/login', (req, res) => {
    res.render('login');
});

authController.post('/login', async (req, res) => {
    const formData = req.body;

    try {
        const token = await authService.login(formData);
        res.cookie('auth', token);
        res.redirect('/');
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.render('login', { email: formData.email, error: errorMessage });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
})



export default authController;