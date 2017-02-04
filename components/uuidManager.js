import ComponentBase from "./componentBase";
import noble from "noble";

export default class UUIDManager extends ComponentBase {
  constructor() {
    super();

    noble.on("stateChange", state => {
      if (state === "poweredOn") {
        noble.startScanning();
      } else {
        noble.stopScanning();
      }
    });

    noble.on("discover", peripheral => {
      this.setName(peripheral.uuid, peripheral.advertisement.localName);
    });

    this.subscribe("addSphero", this.addSpheroWithUUID.bind(this));
  }
  setName(uuid, name) {
    console.log(`name: ${name}, uuid: ${uuid}`);
    this.nameAndUUIDs[name] = uuid;
  }
  addSpheroWithUUID(name, spheroName) {
    if (typeof this.nameAndUUIDs[name] === "undefined") {
      throw new Error("The name's uuid was not found.");
    }
    this.publish("addSpheroWithUUID", name, this.nameAndUUIDs[spheroName]);
  }
}
