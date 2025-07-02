"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeClient = makeFakeClient;
function makeFakeClient(override = {}) {
    return Object.assign({ id: 'any_client_id', name: 'John Doe', email: 'john.doe@example.com', created_at: new Date(), updated_at: new Date() }, override);
}
