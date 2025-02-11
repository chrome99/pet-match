import { io } from "socket.io-client";
import { config } from "../../Configs/constants";

export const socket = io(config.API_URL, {
  autoConnect: false,
});
