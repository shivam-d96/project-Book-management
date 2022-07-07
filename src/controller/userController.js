const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const validator = require("../Validator/validation")

const createUser = async function (req, res) {

    try {
        let { name, title, phone, email, password, address } = req.body


        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "No data found, please provide" })

        if (!validator.isValid(name))
            return res.status(400).send({ status: false, message: "user's name is required." })


        if (!validator.isValid(email))
            return res.status(400).send({ status: false, message: "email id is required." })

        if (!validator.isValidEmail(email))
            return res.status(400).send({ status: false, message: "Please provide a valid email e.g. example@example.com" })

        const usedEmail = await userModel.findOne({ email })
        if (usedEmail)
            return res.status(400).send({ status: false, message: "Email id already exists. Please use another email id." })

        if (!validator.isValid(phone)) return res.status(400).send({ status: false, message: " phone no is required." })

        if (!validator.isValidMobile(phone)) return res.status(400).send({ status: false, message: "Please provide a valid phone number (must be in 10 digit)" })

        const usedPhone = await userModel.findOne({ phone })
        if (usedPhone)
            return res.status(400).send({ status: false, message: "mobile number already exists. Please provide another mobile number" })



        if (!validator.isValid(title))
            return res.status(400).send({ status: false, message: "title is required...!" })
        if (!validator.isValidTitle(title))
            return res.status(400).send({ status: false, message: "Invalid request parameters in the title, It should be Mr, Mrs, Miss" })


        if (!validator.isValid(password))
            return res.status(400).send({ status: false, message: "password is required...!" })

        if (!validator.isValidPassword(password))
            return res.status(400).send({ status: false, message: "enter password between 8-15 range,and it should contain one uppercase ,one lowercase and one special character" })

        if (Object.keys(address).length == 0) {
            return res.status(400).send({ status: false, message: "please enter city ,street, pincode" })
        }
        if (address.city) {
            if (!validator.isValid(address.city)) {
                return res.status(400).send({ status: false, message: "please enter valid city name" })
            }
            //address.city = address.city;
        }
        if (address.street) {
            if (!validator.isValid(address.street)) {
                return res.status(400).send({ status: false, message: "please enter valid street name" })
            }
            //address.street = addresstreet;
        }
        if (address.pincode) {
            re = /^[0-9]{1,6}$/
            if (!re.test(address.pincode)) {
                return res.status(400).send({ status: false, message: "please enter valid pincode" })
            }
            //address.pincode = pincode;
        }
        let userData = {}
        if (Object.keys(address).length == 0) {
            userData = { name, title, phone, email, password }
        } else userData = { name, title, phone, email, password, address }

        const createData = await userModel.create(userData);

        res.status(201).send({ status: true, message: "user created successfully", data: createData });


    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

const userLogin = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "please enter emailId and password" })
        }
        let userName = req.body.email;
        if (!userName)
            return res
                .status(400)
                .send({ status: false, message: 'please enter emailId' });

        let password = req.body.password;
        if (!password)
            return res
                .status(400)
                .send({ status: false, message: 'please enter password' });

        let finduser = await userModel.findOne({
            email: userName,
            password: password,
        });
        if (!finduser)
            return res.status(404).send({
                status: false,
                message: 'Email or Password is not valid',
            });

            let token = jwt.sign(
                {
                    userId: finduser._id.toString(),
                    // iat: Math.floor(Date.now()/1000),
                    // ext: Math.floor(Date.now()/1000)+1*60*60 
                },
                "projectGroup69-3"               
            );
        res.setHeader('x-api-key', token);
        res.status(200).send({ status: true, token: token });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

module.exports.createUser = createUser
module.exports.userLogin = userLogin;