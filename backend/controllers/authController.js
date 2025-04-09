const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

// GENERATE ACCESS TOKEN
const accessTokenGenerate = (user) => {
    return jwt.sign(
        {
            id: user.id,
            admin: user.admin,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "30s" }
    );
};

// GENERATE REFRESH TOKEN
const refreshTokenGenerate = (user) => {
    return jwt.sign(
        {
            id: user.id,
            admin: user.admin,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    );
};

// TAKE REFRESH TOKEN
const requestRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You are not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
            console.log(err);
        }

        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = accessTokenGenerate(user);
        const newRefreshToken = refreshTokenGenerate(user);

        refreshTokens.push(newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
};

// REGISTER
const authRegister = async (req, res) => {
    const { fullname, username, email, phoneNumber, address, role, password } =
        req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await new User({
            fullname: fullname,
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            role: role,
            password: hashedPassword,
        });

        const user = await newUser.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

// LOGIN
const authLogin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).json("Wrong username");
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.status(404).json("Wrong password");
        }
        if (user && validPassword) {
            const accessToken = accessTokenGenerate(user);
            const refreshToken = refreshTokenGenerate(user);

            refreshTokens.push(refreshToken);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { password, ...others } = user._doc;

            res.status(200).json({ ...others, accessToken });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// LOGOUT
const userLogout = async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
        (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out");
};

module.exports = { authRegister, authLogin, requestRefreshToken, userLogout };
