import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// register new users
export const registerUser = async (req, res) => {

    const { email, password, firstname, lastname } = req.body;

    // Validate required fields
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ message: "Please provide all required fields: email, password, firstname, lastname" });
    }

    try {
        const oldUser = await UserModel.findOne({ email });

        if (oldUser) {
            return res.status(400).json({ message: "This User already exists!" })
        }

        const salt = await bcrypt.genSalt(10);
        let pass = password.toString();
        const hashedPass = await bcrypt.hash(pass, parseInt(salt));

        const newUser = new UserModel({
            email,
            password: hashedPass,
            firstname,
            lastname
        });

        const user = await newUser.save();

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Login users

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    try {
        const user = await UserModel.findOne({ email: email });

        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            if (!validity) {
                return res.status(400).json({ message: "Incorrect email or password!" });
            } else {
                const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
                return res.status(200).json({ user, token });
            }
        } else {
            return res.status(404).json({ message: "User not found!" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}