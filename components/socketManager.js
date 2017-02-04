import * as io from "socket.io";
import { createServer, Server } from "http";
import ComponentBase from "./componentBase";
import Orb from "../orb";

const subjectList = [
  "addSphero",
  "removeSphero",
  "rejectName",
  "runCommand",
  "updateOrbs",
  "getSpheros"
];

const middlewares = {
  updateOrbs(orbs) {
    return Object.keys(orbs).map(name => {
      return { name, port: orbs[name].port };
    });
  }
};

export default class SocketManager extends ComponentBase {
  constructor(port) {
    this.server = createServer();
    this.server.listen(port);

    this.io = io(this.server);

    subjectList.forEach(subjectName => {
      this.io.on(subjectName, (...data) => {
        this.publish(subjectName, ...data);
      });
      this.subscribe(subjectName, (...data) => {
        if (typeof middlewares[subjectName] !== "undefined") {
          this.io.emit(subjectName, middlewares[subjectName](...data));
        } else {
          this.io.emit(subjectName, ...data);
        }
      });
    });
  }
}
