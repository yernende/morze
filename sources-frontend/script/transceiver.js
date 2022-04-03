let socket;
let transmitting = false;
let awaitConnectionAllowance;

const transceiver = {
  onReceptionStart: null,
  onReceptionEnd: null,
  transmitting: false,
  subscribe(channel) {
    awaitConnectionAllowance.then(() => {
      if (socket) {
        socket.close();
        this.onReceptionEnd();
      }

      socket = new WebSocket(`ws://${location.host}/channels/${channel}`);

      socket.onmessage = (event) => {
        switch (event.data) {
          case "0":
            if (typeof this.onReceptionEnd == "function") {
              this.onReceptionEnd();
            }
            break;

          case "1":
            if (typeof this.onReceptionGoing == "function") {
              this.onReceptionGoing();
            }
            break;
        }
      }
    });
  },
  startTransmission() {
    if (socket && !this.transmitting) {
      socket.send(1);
      this.transmitting = true;
    }
  },
  stopTransmission() {
    if (socket && this.transmitting) {
      socket.send(0);
      this.transmitting = false;
    }
  }
}

awaitConnectionAllowance = new Promise((resolve, reject) => {
  transceiver.allowConnection = function allowConnection() {
    resolve();
  }
});

export default transceiver;
