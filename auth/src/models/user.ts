import mongoose from 'mongoose';
import { PasswordHashAndCompare } from '../helpers/password';
// Interface to describe properties for creating a user
interface UserAttrs {
    email: string;
    password: string;
}

// Interface that describes that a User doc has.
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

// Interface that describe that a User model has.
interface UserModel extends mongoose.Model <UserDoc> {
    build(attrs: UserAttrs): UserDoc;
};


// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        },
        versionKey: false,
    }
});

//Middleware function for mongoose + normal function so 'this' refers to doc, not whole file.
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await PasswordHashAndCompare.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

// Adding the build static function to replace new User (mongoose official docs)
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

// <UserDoc, UserModel> first generic returns the Doc, second generic returns UserModel. Order is important!
const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export default User;