"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let errorCode = 'INTERNAL_ERROR';
        let message = 'An unexpected error occurred';
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resp = exceptionResponse;
            errorCode = resp.code || resp.error || this.getErrorCodeFromStatus(status);
            message = resp.message || message;
        }
        else if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            errorCode = this.getErrorCodeFromStatus(status);
        }
        this.logger.error(`${request.method} ${request.url} - ${status} [${errorCode}]: ${message}`, exception.stack);
        response.status(status).json({
            data: null,
            error: {
                code: errorCode,
                message,
            },
        });
    }
    getErrorCodeFromStatus(status) {
        switch (status) {
            case 400:
                return 'VALIDATION_FAILED';
            case 401:
                return 'UNAUTHORIZED';
            case 403:
                return 'FORBIDDEN';
            case 404:
                return 'USER_NOT_FOUND';
            case 409:
                return 'DUPLICATE_FACE';
            case 422:
                return 'INVALID_EMBEDDING_DIMENSION';
            case 500:
                return 'DATABASE_ERROR';
            case 503:
                return 'SERVICE_UNAVAILABLE';
            default:
                return 'INTERNAL_ERROR';
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map