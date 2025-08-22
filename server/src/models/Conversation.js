import mongoose from 'mongoose';
const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // removed index: true
}, { timestamps: true });

// Keep ONLY one of the following lines. Recommended to keep this:
ConversationSchema.index({ participants: 1 });

export default mongoose.model('Conversation', ConversationSchema);
