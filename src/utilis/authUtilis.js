const bcrypt = require( 'bcryptjs');
const prepareUserData = (reqBody) => {
    const {
        firstName,
        lastName,
        middleName,
        age,
        email,
        password,
        gender,
        isPremium,
        photoUrl,
        about,
        hobbies
    } = reqBody;

    const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: parseInt(age, 10),
        email: email.toLowerCase().trim(),
        password: password, // Will be hashed separately
        gender: gender.toLowerCase(),
        isPremium: isPremium || false,
        photoUrl: photoUrl || undefined,
        about: about ? about.trim() : undefined,
        hobbies: hobbies || []
    };
    if (middleName) {
        userData.middleName = middleName.trim();
    }

    return userData;
};
const validateUserData = (userData) => {
    const errors = [];

    if (userData.age < 18 || userData.age > 120) {
        errors.push('Age must be between 18 and 120');
    }

    if (!['male', 'female', 'other'].includes(userData.gender)) {
        errors.push('Invalid gender value');
    }

    
    if (userData.hobbies.length > 20) {
        errors.push('Cannot have more than 20 hobbies');
    }

    return errors;
};
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};
const createUserResponse = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        age: user.age,
        email: user.email,
        gender: user.gender,
        isPremium: user.isPremium,
        photoUrl: user.photoUrl,
        about: user.about,
        hobbies: user.hobbies,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};
const validateLoginCredentials = async (email, password) => {
    const errors = [];

    if (!email || !password) {
        errors.push('Email and password are required');
        return errors;
    }
    return errors;
};
const comparePassword=async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
const generateAccessToken=(userId, email)=>{
 const payload = {
        userId,
        email,
        type: 'access'
    };
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'utsavkumarjhaformindia';
    const options = {
        expiresIn: '15m'  
    };
    return jwt.sign(payload, secret, options);
}
const generateRefreshToken=(userId, email)=>{
  const payload = {
        userId,
        email,
        type: 'refresh'
    };
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'utsavkumarjhaformindia';
    const options = {
        expiresIn: '7d'
    };
    return jwt.sign(payload, secret, options);
}
const generateTokens = (userId, email) => {
    const accessToken = generateAccessToken(userId, email);
    const refreshToken = generateRefreshToken(userId, email);
    return { accessToken, refreshToken };
};
module.exports = { prepareUserData ,validateUserData, hashPassword ,createUserResponse,validateLoginCredentials,comparePassword,generateTokens};