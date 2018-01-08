/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

(function(ext) {
  var status = false;
  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {

    // Request status
    $.post("http://localhost:3000",
           {type: 'STATUS'},
           function(data, status, xhr) {
             processData(data);
           });

    if (status){
      return {status: 2, msg: 'Ready'};
    }
    else {
      return {status: 1, msg: 'Check board connection'};
    }
  };

  function processData(data){
    if (data.type == 'STATUS'){
      status = data.value;
    }
    // console.log(status);
  }

  ext.setServo = function(servo,pos) {
    $.post("http://localhost:3000",
           {
             type: 'SERVO',
             servo: servo,
             value: pos
           },
           function(data, status, xhr) {
             processData(data);
           });
    // console.log(value);
  };

  ext.setLED = function(led,brightness) {
    $.post("http://localhost:3000",
           {
             type: 'LED',
             led: led,
             value: brightness
           },
           function(data, status, xhr) {
             processData(data);
           });
    // console.log(value);
  };

  ext.readSensor = function(sensor,callback) {
    $.post("http://localhost:3000",
           {
             type: 'SENSOR',
             sensor: sensor
           },
           function(data, status, xhr) {
             callback(data.value);
           });
    // console.log(value);
  };
  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      [' ', 'Set %m.servoList to %n', 'setServo', 'Servo A', 127],
      [' ', 'Set %m.ledList to %n', 'setLED', 'LED A', 0],
      ['R', 'Read %m.sensorList', 'readSensor', 'SENSOR A'],
    ],
    menus: {
      servoList:['Servo A','Servo B','Servo C','Servo D'],
      ledList:['LED A','LED B','LED C','LED D'],
      sensorList:['SENSOR A','SENSOR B','SENSOR C','SENSOR D'],
    }
  };

  // Register the extension
  ScratchExtensions.register('Local Test Extension', descriptor, ext);
})({});
