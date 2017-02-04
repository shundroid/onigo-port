import * as publisher from "../eventPublisher";

export default class ComponentBase {
  subscribe(eventName, observeFunction) {
    publisher.subscribe(eventName, (author, ...data) => {
      if (author !== this) {
        observeFunction(...data);
      }
    });
  }
  publish(eventName, ...data) {
    publisher.publish(this, eventName, data);
  }
}
