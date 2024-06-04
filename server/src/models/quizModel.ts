import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript types
export interface OptionType {
  option: string;
  isCorrect: boolean;
  id: number;
}

export interface QuestionType {
  Questions: string;
  options: OptionType[];
  correctAnswer: string;
}

export interface QuizType extends Document {
  questionArray: QuestionType[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schemas
const optionSchema = new Schema<OptionType>({
  option: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  id: { type: Number, required: true },
});

const questionSchema = new Schema<QuestionType>({
  Questions: { type: String, required: true, unique: true },
  options: [optionSchema],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new Schema<QuizType>({
  questionArray: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update the updatedAt field on every save
quizSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Quiz = mongoose.model<QuizType>("Quiz", quizSchema);

export default Quiz;
