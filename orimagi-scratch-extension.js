/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

(function(ext) {
  var status = false;
  var motorPos = {
    a: 127,
    b: 127,
    c: 127,
    d: 127,
  }
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

  ext.setServo = function(con,pos) {
    motorPos[con] = pos; // Record value
    // console.log(motorPos[con]);
    $.post("http://localhost:3000",
           {
             type: 'SERVO',
             servo: con,
             value: pos
           },
           function(data, status, xhr) {
             processData(data);
           });
  };

  ext.bendMotor = function(con,bend) {
    const step = 2;
    if (bend == 'more'){
      motorPos[con] += step;
      if(motorPos[con] > 255){
        motorPos[con] = 255;
      }
    }
    if (bend == 'less'){
      motorPos[con] -= step;
      if(motorPos[con] < 0){
        motorPos[con] = 0;
      }
    }
    ext.setServo(con,motorPos[con]);
  };

  ext.stopMotor = function(con) {
    ext.setServo(con,127);
  };

  ext.resetMotors = function(con) {
    ext.setServo('a',127);
    ext.setServo('b',127);
    ext.setServo('c',127);
    ext.setServo('d',127);
  };

  ext.setLED = function(con,brightness) {
    $.post("http://localhost:3000",
           {
             type: 'LED',
             led: con,
             value: brightness
           },
           function(data, status, xhr) {
             processData(data);
           });
    // console.log(value);
  };

  ext.readSensor = function(con,callback) {
    $.post("http://localhost:3000",
           {
             type: 'SENSOR',
             sensor: con
           },
           function(data, status, xhr) {
             callback(data.value);
           });
    // console.log(value);
  };
  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      [' ', 'Set motor at %m.conList to %n', 'setServo', 'a', 127],
      [' ', 'Bend motor at %m.conList %m.bendList', 'bendMotor', 'a', 'more'],
      [' ', 'Stop motor at %m.conList', 'stopMotor', 'a'],
      [' ', 'Reset all motors', 'resetMotors'],
      [' ', 'Set LED at %m.conList to %n', 'setLED', 'a', 0],
      ['R', 'Sensor reading at %m.conList', 'readSensor', 'a'],
    ],
    menus: {
      conList:['a','b','c','d'],
      bendList:['more','less'],
    }
  };

  // Register the extension
  ScratchExtensions.register('Orimagi Extension', descriptor, ext);
})({});
