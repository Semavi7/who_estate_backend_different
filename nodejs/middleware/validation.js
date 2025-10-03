const Joi = require('joi');

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta adresi gereklidir'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Şifre en az 6 karakter olmalıdır',
    'any.required': 'Şifre gereklidir'
  })
});

// User creation validation schema
const createUserSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'İsim gereklidir'
  }),
  surname: Joi.string().required().messages({
    'any.required': 'Soyisim gereklidir'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta adresi gereklidir'
  }),
  phonenumber: Joi.number().required().messages({
    'number.base': 'Telefon numarası sayı olmalıdır',
    'any.required': 'Telefon numarası gereklidir'
  })
});

// Property creation validation schema
const createPropertySchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Başlık gereklidir'
  }),
  description: Joi.string().required().messages({
    'any.required': 'Açıklama gereklidir'
  }),
  price: Joi.number().required().messages({
    'number.base': 'Fiyat sayı olmalıdır',
    'any.required': 'Fiyat gereklidir'
  }),
  gross: Joi.number().required().messages({
    'number.base': 'Brüt alan sayı olmalıdır',
    'any.required': 'Brüt alan gereklidir'
  }),
  net: Joi.number().required().messages({
    'number.base': 'Net alan sayı olmalıdır',
    'any.required': 'Net alan gereklidir'
  }),
  propertyType: Joi.string().required().messages({
    'any.required': 'Emlak tipi gereklidir'
  }),
  listingType: Joi.string().required().messages({
    'any.required': 'İlan tipi gereklidir'
  })
});

// Message creation validation schema
const createMessageSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'İsim gereklidir'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta adresi gereklidir'
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Telefon numarası gereklidir'
  }),
  message: Joi.string().required().messages({
    'any.required': 'Mesaj gereklidir'
  })
});

// Validation middleware
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateCreateProperty = (req, res, next) => {
  const { error } = createPropertySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateCreateMessage = (req, res, next) => {
  const { error } = createMessageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateCreateUser,
  validateCreateProperty,
  validateCreateMessage
};