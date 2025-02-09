import { logger } from "./logger";
import { toast } from "react-toastify";

export const handleError = (error: unknown) => {
    logger(error);
    if (error instanceof Error) { toast.error(error.message) };
};

