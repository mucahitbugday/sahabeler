import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEditRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sahabeId: mongoose.Types.ObjectId;
  sahabeName: string;
  field: string;
  currentValue: string;
  proposedValue: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EditRequestSchema = new Schema<IEditRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sahabeId: {
      type: Schema.Types.ObjectId,
      ref: 'Sahabe',
      required: true,
    },
    sahabeName: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    currentValue: {
      type: String,
      required: true,
    },
    proposedValue: {
      type: String,
      required: true,
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    reviewNote: String,
  },
  {
    timestamps: true,
  }
);

EditRequestSchema.index({ status: 1 });
EditRequestSchema.index({ userId: 1 });

const EditRequest: Model<IEditRequest> = mongoose.models.EditRequest || mongoose.model<IEditRequest>('EditRequest', EditRequestSchema);

export default EditRequest;
