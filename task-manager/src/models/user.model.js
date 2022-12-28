const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const saltRounds = 10;
const secret = "adsfafl4a65d4d65a46a";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter correct email.")
            }
        }
    },
    age: {
        type: Number,
        default: 13,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('You can enter password as part of a password.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

},

    {
        timestamps: true
    }
);



userSchema.virtual('tasks', {
    foreignField: 'userId',
    localField: '_id',
    ref: 'Task'
})



// verify the login credentials 
userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return { status: 404 };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return { status: 401 };
    }
    else {
        return { status: 200, user };
    }
}


userSchema.methods.generateToken = async function () {
    const user = this;
    const jwtToken = await jsonwebtoken.sign(
        { id: user._id },
        secret
    );
    user.tokens = user.tokens.concat({ token: jwtToken });
    await user.save();
}


userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();


    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
}




// Hash password before saving it at the database
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, saltRounds)
    }

    next()
});


const User = mongoose.model('User', userSchema);

module.exports = User;