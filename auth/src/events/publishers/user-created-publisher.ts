import { UserCreatedEvent, Publisher, Subjects } from "@cgestione/fl-common";

export default class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
};