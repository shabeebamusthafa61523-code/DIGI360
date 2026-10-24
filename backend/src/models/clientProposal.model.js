import mongoose from 'mongoose';

const clientProposalSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false,
    index: true
  },
  proposalNumber: {
    type: String,
    required: true,
    trim: true
  },
  // Customizable Proposal Title / Type (e.g. "DIGITAL MARKETING PROPOSAL")
  title: {
    type: String,
    default: 'DIGITAL MARKETING PROPOSAL',
    trim: true
  },
  proposalType: {
    type: String,
    default: 'DIGITAL MARKETING',
    trim: true
  },
  preparedBy: {
    type: String,
    default: 'DIGI 360 SOLUTIONS',
    trim: true
  },
  agencyLogo: {
    type: String,
    default: '/logo2.png'
  },
  useAgencyLogoImage: {
    type: Boolean,
    default: true
  },
  // Client branding
  clientName: {
    type: String,
    trim: true
  },
  clientLogo: {
    type: String,
    default: ''
  },
  useLogoImage: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Declined'],
    default: 'Draft'
  },
  issueDate: {
    type: String
  },
  validUntil: {
    type: String
  },
  totalCost: {
    type: String,
    default: 'Rs 13,200',
    trim: true
  },

  // Content Sections
  campaignGoal: {
    type: String,
    default: ''
  },
  objectives: [{
    title: { type: String, trim: true },
    description: { type: String, trim: true }
  }],
  platforms: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  services: [{
    title: { type: String, trim: true },
    description: { type: String, trim: true }
  }],
  planDeliverables: {
    type: String,
    default: ''
  },
  termsAndConditions: [{
    type: String,
    trim: true
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export { clientProposalSchema };
export default clientProposalSchema;
