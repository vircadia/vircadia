function flee(thisEntity, target) {
  var targetPosition = Entities.getEntityProperties(target, "position").position;
  var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
  var location = properties.position;
  var velocity = properties.velocity;
  var MAX_SPEED = 1;
  var MAX_FORCE = 1;


  var desired = Vec3.subtract(location, targetPosition);
  var d = Vec3.length(desired);
  desired = Vec3.normalize(desired);
  desired = Vec3.multiply(MAX_SPEED, desired);
  if (d < 2) {
    var steer = Vec3.subtract(desired, velocity);

    var steerVector = new V3(desired.x, 0, desired.z);
    steer = steerVector.limit(MAX_FORCE);

    return steer;
  } else {
    //   print('target too far away to flee' + d);
    return
  }
}

function fleeAllAvatars(thisEntity) {
  //print('FLEE AVATARS');
  var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
  var location = properties.position;
  var velocity = properties.velocity;

  var nearbyEntities = Entities.findEntities(location, 3);
  var flightVectors = [];
  for (var entityIndex = 0; entityIndex < nearbyEntities.length; entityIndex++) {
    var entityID = nearbyEntities[entityIndex];
    var entityProps = Entities.getEntityProperties(entityID);
    if (entityProps.name === 'Hifi-Avatar-Detector') {
      //print('found an avatar to flee')

      var MAX_SPEED = 8;
      var MAX_FORCE = 8;

      var desired = Vec3.subtract(location, entityProps.position);
      var d = Vec3.length(desired);
      desired = Vec3.normalize(desired);
      desired = Vec3.multiply(MAX_SPEED, desired);
      if (d < 3) {
        var steer = Vec3.subtract(desired, velocity);
        var steerVector = new V3(desired.x, 0, desired.z);
        steer = steerVector.limit(MAX_FORCE)
        flightVectors.push(steer)
      } else {
        //  print('target too far away from this avatar to flee' + d);
      }
    }

  }

  return flightVectors
}

function fleeAvoiderBlocks(thisEntity) {
  // print('FLEE AVOIDER BLOCKS');
  var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
  var location = properties.position;
  var velocity = properties.velocity;

  var nearbyEntities = Entities.findEntities(location, 2);
  var flightVectors = [];
  for (var entityIndex = 0; entityIndex < nearbyEntities.length; entityIndex++) {
    var entityID = nearbyEntities[entityIndex];
    var entityProps = Entities.getEntityProperties(entityID);
    if (entityProps.name === 'Hifi-Rat-Avoider') {
      // print('found an avoiderblock to flee');

      var MAX_SPEED = 11;
      var MAX_FORCE = 6;

      var desired = Vec3.subtract(location, entityProps.position);
      var d = Vec3.length(desired);
      desired = Vec3.normalize(desired);
      desired = Vec3.multiply(MAX_SPEED, desired);
      if (d < 5) {
        var steer = Vec3.subtract(desired, velocity);
        var steerVector = new V3(desired.x, 0, desired.z);
        steer = steerVector.limit(MAX_FORCE)
        flightVectors.push(steer);
      } else {
        //print('target too far away from this avoider to flee' + d);
      }
    }

  }

  return flightVectors
}

function arrive(thisEntity, target) {

  var targetPosition = Entities.getEntityProperties(target, "position").position;
  var properties = Entities.getEntityProperties(thisEntity, ["position", "velocity"]);
  var location = properties.position;
  var velocity = properties.velocity;
  var MAX_SPEED = 10;
  var MAX_FORCE = 6;
  var ARRIVAL_DISTANCE = 2;

  var desired = Vec3.subtract(targetPosition, location);
  var d = Vec3.length(desired);
  desired = Vec3.normalize(desired);
  if (d < ARRIVAL_DISTANCE) {
    var m = scale(d, 0, ARRIVAL_DISTANCE, 0, MAX_SPEED);
  } else {
    desired = Vec3.multiply(MAX_SPEED, desired);

  }
  var steer = Vec3.subtract(desired, velocity);
  var steerVector = new V3(desired.x, 0, desired.z);
  steer = steerVector.limit(MAX_FORCE)

  return steer
}


function V3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return
}

V3.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

V3.prototype.limit = function(s) {
  var len = this.length();

  if (len > s && len > 0) {
    this.scale(s / len);
  }

  return this;
};

V3.prototype.scale = function(f) {
  this.x *= f;
  this.y *= f;
  this.z *= f;
  return this;
};

var v3 = new V3();

var scale = function(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

loadSteer = function() {
  return {
    flee: flee,
    fleeAllAvatars: fleeAllAvatars,
    fleeAvoiderBlocks: fleeAvoiderBlocks,
    arrive: arrive
  }
}