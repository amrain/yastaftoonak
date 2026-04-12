const mongoose = require('mongoose');

const fatwaSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    age: { type: Number, required: true, min: 1 },
    gender: { type: String, enum: ['ذكر', 'أنثى'], required: true },
    location: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, default: '' },
    category: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'published', 'answered', 'draft', 'archived'],
      default: 'new',
    },
    wantsToPublish: { type: Boolean, default: true },
    email: { type: String, default: '' },
    answeredBy: { type: String, default: '' },
  },
  { timestamps: true },
);

fatwaSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    ret.date = ret.createdAt.toISOString().split('T')[0];
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Fatwa', fatwaSchema);
