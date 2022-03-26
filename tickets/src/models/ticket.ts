import mongoose from 'mongoose';
import {Password} from "../services/password";

// An interface that describes the properties
// that are required to create a new Ticket
interface TicketAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
    email: string;
    password: string;
}

const ticketSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;

            delete ret._id;
            delete ret.__v;
        },
        versionKey: false
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export {Ticket};