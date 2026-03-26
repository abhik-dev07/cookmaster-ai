import Joi from "joi";

const validateRecipe = (req, res, next) => {
  const schema = Joi.object({
    recipeName: Joi.string().required().max(255),
    description: Joi.string().max(1000),
    ingredients: Joi.alternatives().try(Joi.array(), Joi.string()),
    steps: Joi.alternatives().try(Joi.array(), Joi.string()),
    calories: Joi.number().integer().min(0),
    cookTime: Joi.number().integer().min(0),
    serveTo: Joi.number().integer().min(1),
    imagePrompt: Joi.string().max(1000),
    category: Joi.string().max(100),
    recipeImage: Joi.string().optional(),
    userEmail: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        status: 400,
      },
    });
  }
  next();
};

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required().max(255),
    picture: Joi.string().uri().optional(),
    credits: Joi.number().integer().min(0).optional(),
    pref: Joi.alternatives()
      .try(Joi.object(), Joi.allow(null))
      .optional()
      .default({}),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        status: 400,
      },
    });
  }
  next();
};

const validateUserFavorite = (req, res, next) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().required(),
    recipeId: Joi.number().integer().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        status: 400,
      },
    });
  }
  next();
};

export { validateRecipe, validateUser, validateUserFavorite };
