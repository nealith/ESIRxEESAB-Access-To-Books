const mqtt = require('mqtt')

module.exports = class Voice {
  constructor(address) {
    this.address = address
    this.client = mqtt.connect(address)

    const voicepi_status = 'voicepi/status';
    const voicepi_mic0_status = 'voicepi/0/status';
    const voicepi_mic0_message = 'voicepi/0/message';

    var self = this;

    this.client.on('connect', () => {
      self.client.subscribe(voicepi_status)
      self.client.subscribe(voicepi_mic0_status)
      self.client.subscribe(voicepi_mic0_message)
    })

    this.client.on('message', (topic, message) => {
      switch (topic) {
        case voicepi_status:
          return self.processVoiceStatus(message)
        case voicepi_mic0_status:
          return self.processNewMic(message)
        case voicepi_mic0_message:
          return self.processVoiceMessage(message)
      }
      console.log('No handler for topic %s', topic)
    })
  }

  processVoiceStatus (message) {
      console.log('Voice connected status %s', message)
      data = JSON.parse(message)
  }
  processNewMic (message) {
    console.log('Mic connected status %s', message)
      data = JSON.parse(message)
  }
  processVoiceMessage (message) {
      console.log('New voice message %s', message)
      data = JSON.parse(message)
  }

  /*
    this class should use a observer patern, by registering,
    for each kind of information from voice,
    a callback function to class with the information

    so should expends this class with a function that will be called by
    the main process. This function should have 2 arguments :
    - type for information (maybe as a string)
    - callback function

  */


};
