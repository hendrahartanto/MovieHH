import http from "http";
import { port } from "./config";
import app from "./app";
import { initSocket } from "./infrastructure/socket";

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
