"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = clientRoutes;
function clientRoutes(app, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { clientController } = options;
        app.post('/clients', clientController.create.bind(clientController));
        app.get('/clients/:id', clientController.findById.bind(clientController));
        app.put('/clients/:id', clientController.update.bind(clientController));
        app.delete('/clients/:id', clientController.delete.bind(clientController));
    });
}
