
const mongoose = require('mongoose');

// Define the user schema with validations 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    middleName: {
        type: String,
        required: false, 
        trim: true,
        maxlength: [50, 'Middle name cannot exceed 50 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        max: [120, 'Age cannot exceed 120']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
   password: {
  type: String,
  required: function () {
    return !this.isGoogle;  // required only if not Google
  },
  validate: {
    validator: function (v) {
      if (this.isGoogle) return true;
      // else enforce min length
      return v && v.length >= 8;
    },
    message: 'Password must be at least 8 characters long'
  },
  maxlength: [128, 'Password cannot exceed 128 characters']
},
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female', 'other'],
            message: 'Gender must be male, female, or other'
        }
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    photoUrl: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'
    },
    about: {
        type: String,
        maxlength: [500, 'About section cannot exceed 500 characters'],
        trim: true
    },
    hobbies: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return v.length <= 20;
            },
            message: 'Cannot have more than 20 hobbies'
        }
    },
     isGoogle: { type: Boolean, default: false },
     googleId: { type: String, default: '' },
     passwordResetToken: { type: String },
     passwordResetExpires: { type: Date },
    refreshToken: {
        type: String,
        default: null
    },
    refreshTokenExpiresAt: {
        type: Date,
        default: null
    },
    refreshTokens: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        deviceInfo: {
            type: String,
            default: 'unknown'
        }
    }]
}, {
    timestamps: true
});
// Add indexes for performance
userSchema.index({  email: { type: String, unique: true, required: true } }); // Unique index on email
userSchema.index({ firstName: 1, lastName: 1 });
module.exports = mongoose.model('User', userSchema);