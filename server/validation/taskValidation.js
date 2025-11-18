 
// server/validation/taskValidation.js
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).required(),
  dueDate: Joi.date().optional().allow(null, ''),
  progress: Joi.string().valid('not-started', 'in-progress', 'completed').optional(),
});
const validateTaskCreation = (req, res, next) => {
  const { error } = taskSchema.validate(req.body, { abortEarly: false, context: { isUpdate: false } });
if (error) {
    return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });
  }
  next();
};
const validateTaskUpdate = (req, res, next) => {
// Updated schema to allow updating title, description, and progress.
const updateSchema = Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().min(1).optional(),
    dueDate: Joi.date().optional().allow(null, ''),
    progress: Joi.string().valid('not-started', 'in-progress', 'completed').optional(),
  }).min(1).messages({
    'object.min': 'At least one field (title, description, dueDate, or progress) is required for update.',
  });

  const { error } = updateSchema.validate(req.body);
if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};
module.exports = { validateTaskCreation, validateTaskUpdate };
