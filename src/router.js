import { Router } from "express";
import homeController from "./controllers/home-controller.js";
import authController from "./controllers/auth-controller.js";
import computersController from "./controllers/computers-controller.js";

const router = Router();

router.use(homeController);
router.use(authController)
router.use('/computers', computersController);

router.get('*', (req, res) => {
    res.render('404');
})

export default router;