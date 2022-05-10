import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface LogsAttrs {
    title: string;
    description: number;
    startsAt: string;
    expiresAt: string;
    user: { id: string };

}

interface LogsDoc extends mongoose.Document {
    title: string;
    description: string;
    startsAt: string;
    expiresAt: string;
    version: number;
    user: { id: string };
}

interface LogsModel extends mongoose.Model<LogsDoc> {
    build(attrs: LogsAttrs): LogsDoc;
}

const logsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    startsAt: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: String,
        required: true,
    },
    user: {
        id: {
            type: String,
            required: true,
        },
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

logsSchema.set('versionKey', 'version');
logsSchema.plugin(updateIfCurrentPlugin);


logsSchema.statics.build = (attrs: LogsAttrs) => {
    return new Logs(attrs);
};

const Logs = mongoose.model<LogsDoc, LogsModel>('Logs',logsSchema);

export default Logs;
