const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({});
const User = require("../models/user")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controllers/users")

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post( wrapAsync(userController.signup));

router
    .route("/login")
    .get( userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login);




router.get("/logout", userController.logout)

router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Logged in with Google!");
        const redirectUrl = req.session.redirectUrl || "/listings";
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);
    }
);


module.exports = router;
