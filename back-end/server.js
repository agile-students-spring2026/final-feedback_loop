import app from "./app.js";
import dotenv from "dotenv";


dotenv.config({ silent: true });

const PORT = process.env.PORT || 7002;

const listener = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const close = () => {
  listener.close();
};