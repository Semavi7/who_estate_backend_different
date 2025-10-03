const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: ''
  },
  phonenumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create default admin user on startup
userSchema.statics.createDefaultAdmin = async function() {
  const adminEmail = 'refiyederyaakgun@gmail.com';
  const adminExists = await this.findOne({ email: adminEmail });
  
  if (!adminExists) {
    const adminUser = new this({
      email: adminEmail,
      password: '337044',
      name: 'Refiye Derya',
      surname: 'Gürses',
      phonenumber: 5368100880,
      roles: 'admin'
    });
    await adminUser.save();
    console.log('Default admin user created');
  }
};

module.exports = mongoose.model('User', userSchema);