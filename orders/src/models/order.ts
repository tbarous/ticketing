import mongoose from 'mongoose';

interface OrderAttrs {
    userId: string,
    status: string,
    expiresAt: Date,
    ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string,
    status: string,
    expiresAt: Date,
    ticket: TicketDoc
}

const orderSchema = new mongoose.Schema({
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
            delete ret.password;
            delete ret.__v;
        },
        versionKey: false
    }
});

orderSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));

        this.set("password", hashed);
    }

    done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export {Order};