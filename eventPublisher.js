const observeFunctions = {};

export function subscribe(eventName, observeFunction) {
  if (typeof observeFunctions[eventName] === "undefined") {
    observeFunctions[eventName] = [];
  }
  observeFunctions[eventName].push(observeFunction);
}

export function publish(author, eventName, ...eventData) {
  if (typeof this.observeFunctions[eventName] !== "undefined") {
    this.observeFunctions[eventName].forEach((observeFunction) => {
      observeFunction(author, ...eventData);
    });
  }
}
