import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please provide a full name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Please provide a company name'],
            trim: true,
        },
        source: {
            type: String,
            required: [true, 'Please provide a lead source'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'converted'],
            default: 'new',
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
