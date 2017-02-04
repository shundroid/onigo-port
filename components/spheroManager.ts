import ComponentBase from "./componentBase";
import sphero from "sphero";
import Orb from "../orb";

export default class SpheroManager extends ComponentBase {
  orbs: { [key: string]: Orb };
  constructor() {
    super();
    this.orbs = {};
    this.subscribe("addSphero", this.add.bind(this));
    this.subscribe("removeSphero", this.remove.bind(this));
    this.subscribe("runCommand", this.runCommand.bind(this));
    this.subscribe("getSpheros", this.getSpheros.bind(this));
  }
  private add(name: string, port: string) {
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
  private remove(name: string) {
    if (!this.contains(name)) {
      throw new Error(`Orb: ${ name } was not found.`);
    }
    delete this.orbs[name];
    this.publish("updateOrbs", this.orbs);
  }
  private contains(name: string) {
    return typeof this.orbs[name] !== "undefined";
  }
  private runCommand(targetName: string, commandName: string, ...args: Array<any>) {
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
