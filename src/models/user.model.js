import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 12;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		rut: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
		},
		verified: {
			type: Boolean,
			required: true,
			default: false,
		},
		code: {
			type: String,
			required: false,
			select: false,
		},
		blocked: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

/**
 * Pre save user
 * Generate HASH Password if password isModified
 */
userSchema.pre("save", function (next) {
	const user = this;

	// hash the password if it has been modified (or new)
	if (!user.isModified("password")) {
		return next();
	}

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				return next(err);
			}

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

/**
 * Compare password with the current hashed password
 * @param {string} candidatePassword - Cantidate password to check
 * @returns {boolean}
 */
async function comparePassword(candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password);
}

/**
 * Set user.verified = true and remove the user.code
 */
function setVerified() {
	this.code = null;
	this.verified = true;
	return this.save();
}

userSchema.methods = {
	comparePassword,
	setVerified,
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
