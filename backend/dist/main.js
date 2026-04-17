"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.use((0, express_1.json)({ limit: '100mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '100mb' }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 NestJS Backend running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map