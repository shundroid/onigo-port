import ComponentBase from "./componentBase";
import sphero from "sphero";
import Orb from "../orb";

export default class SpheroManager extends ComponentBase {
  constructor() {
    this.orbs = {};
    this.subscribe("addSpheroWithUUID", this.add.bind(this));
    this.subscribe("removeSphero", this.remove.bind(this));
    this.subscribe("runCommand", this.runCommand.bind(this));
    this.subscribe("getSpheros", this.getSpheros.bind(this));
  }
  add(name, port) {
    if (this.contains(name)) {
      this.publish("rejectName", name);
      return;
    }
    const orb = sphero(port);
    orb.connect(error => {
      if (typeof error !== "undefined") {
        throw error;
      }
      orb.configureCollisions({
        meth: 0x01,
        xt: 0x7A,
        xs: 0xFF,
        yt: 0x7A,
        ys: 0xFF,
        dead: 100
      }, () => {
        console.log("configured orb.", "success");
      });
      this.orbs[name] = new Orb(name, port, orb);
      this.publish("updateOrbs", this.orbs);
    });
  }
  remove(name) {
    if (!this.contains(name)) {
      throw new Error(`Orb: ${ name } was not found.`);
    }
    delete this.orbs[name];
    this.publish("updateOrbs", this.orbs);
  }
  contains(name) {
    return typeof this.orbs[name] !== "undefined";
  }
  runCommand(targetName, commandName, ...args) {
    if (!this.contains(targetName)) {
      throw new Error(`Orb: ${ targetName } was not found.`);
    }
    if (commandName in this.orbs[targetName]) {
      this.orbs[targetName][commandName](...args);
    }
  }
  private getSpheros() {
    this.publish("updateOrbs", this.orbs);
  }
}
