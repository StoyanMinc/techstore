import { Router } from "express";

import computerService from "../services/computers-service.js";
import { getErrorMessage } from "../utils/getError.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const computersController = Router();

computersController.get('/', async (req, res) => {

    try {
        const computers = await computerService.getAll();
        res.render('catalog', { computers });
    } catch (error) {
        res.redirect('/404');
    }
});

computersController.get('/create', isAuth, (req, res) => {
    res.render('create');
});

computersController.post('/create', async (req, res) => {
    const formData = req.body;

    const userId = req.user._id;

    formData.price = Number(formData.price);
    formData.owner = userId;
    try {
        await computerService.create(formData);
        res.redirect('/computers')
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.render('create', { formData, error: errorMessage });
    }
});

computersController.get('/:computerId/details', async (req, res) => {
    const { computerId } = req.params;
    const userId = req.user?._id;
    try {
        const computer = await computerService.getOne(computerId);
        const isOwner = computer.owner == userId;
        const isPrefered = !!computer.preferredList.find(id => id == userId);
        res.render('details', { computer, isOwner, isPrefered })
    } catch (error) {
        res.redirect('/404');
    }
});

computersController.get('/:computerId/edit', isAuth, async (req, res) => {
    const { computerId } = req.params;
    try {
        const computer = await computerService.getOne(computerId);
        if (computer.owner.toString() !== req.user._id) {
            res.setError('You can\'t edit foreign offers!')
            return res.redirect(`/computers/${computerId}/details`);
        }

        res.render('edit', { computer });
    } catch (error) {
        res.redirect('/404');
    }
});

computersController.post('/:computerId/edit', isAuth, async (req, res) => {
    const formData = req.body;
    const { computerId } = req.params
    try {
        await computerService.update(computerId, req.user._id, formData);
        res.redirect(`/computers/${computerId}/details`);
    } catch (error) {
        // const errorMessage = getErrorMessage(error);
        // res.render('edit', { computer: formData, error: errorMessage });
        console.log(error.message)
    }
});

computersController.get('/:computerId/prefer', isAuth, async (req, res) => {
    const { computerId } = req.params;
    const userId = req.user._id;

    try {
        await computerService.addPrefer(computerId, userId);
        res.redirect(`/computers/${computerId}/details`);
    } catch (error) {
        console.log(error.message);
    }
});

computersController.get('/:computerId/delete', isAuth, async (req, res) => {
    const userId = req.user._id;
    const { computerId } = req.params;

    try {
        await computerService.deleteComputer(computerId, userId);
        res.redirect('/computers');
    } catch (error) {
        if (error.message === 'Not Owner') {
            return res.redirect('/login');
        }
        res.redirect('/404');
    }
});


export default computersController;