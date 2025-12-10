type Callback = (data: any) => void;

class PubSub {
  private events: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  publish(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(data));
  }
}

export const pubsub = new PubSub();
