import { Router } from "express";
import { publicRouter } from "./public.routes.js";
import { authRouter } from "./auth.routes.js";
import { adminRouter } from "./admin.routes.js";
import { customerRouter } from "./customer.routes.js";

export const apiRouter = Router();

apiRouter.use(publicRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/customer", customerRouter);
apiRouter.use("/admin", adminRouter);
