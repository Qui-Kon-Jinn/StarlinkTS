import path from "path";
const { v4: uuidv4 } = require('uuid');

const allSatellites: Satellite[] = []
type coordinatesObject = {
  latitude: number;
  longitude: number;
}

type stateObjectValue = "on" | "off"

type stateObject = {
  solarSail: stateObjectValue;
  broadcasting: stateObjectValue;
  turned: stateObjectValue;
}
class Satellite {

  readonly uuid: string = uuidv4();
  height: number;
  coordinates: coordinatesObject;
  state: stateObject;

  constructor() {
    this.height = 0;
    this.coordinates = {
      latitude: 0,
      longitude: 0
    }
    this.state = {
      solarSail: "off",
      broadcasting: "off",
      turned: "on"
    }
    allSatellites.push(this)

  }


  changeState(state: keyof stateObject, value: stateObjectValue) {
    switch (true) {
      case (state === "solarSail"):
        this.state.solarSail = value;
        break;
      case (state === "broadcasting"):
        this.state.broadcasting = value;
        break;
      case (state === "turned"):
        this.state.turned = value;
        break;
      default:
        break;
    }
  }
  //


  changeParameter(parameter: "height" | keyof coordinatesObject, value: number) {
    switch (true) {
      case (parameter === "height"):
        this.height = value;
        break;
      case (parameter === "latitude"):
        this.coordinates.latitude = value;
        break;
      case (parameter === "longitude"):
        this.coordinates.longitude = value;
        break;
      default:
        break;
    }
  }
}

class GroupOfSatellites {
  satellites: Satellite[];
  constructor(satellites: Satellite[] = []) { // []

    this.satellites = satellites;
  }
  addSatellite(satellite: Satellite) {
    this.satellites.push(satellite);
    return this
  }
  deleteSatellite(satellite: Satellite) {
    let arrCopy = [...this.satellites];
    let satToDelete = arrCopy.findIndex(sat => sat.uuid === satellite.uuid);
    arrCopy.splice(satToDelete, 1);
    this.satellites = arrCopy;
  }
  showSatelites() {
    console.table(this.satellites);
  }
}

class Operator {
  uuid;
  name;
  surname;
  constructor(name: string, surname: string) {
    this.name = name
    this.surname = surname
    this.uuid = uuidv4();
  }

  setSatelliteHeight(satellite: Satellite, height: number) {
    if (!Validator.checkIfNumberInRange(height, 0, 100000)) throw new Error("Minimal and maximal heigth is 0 and 100 000");

    satellite.changeParameter("height", height)
    return this
  }
  setSatelliteLatitude(satellite: Satellite, latitude: number) {
    if (!Validator.checkIfNumberInRange(latitude, -180, 180)) throw new Error("Minimal and maximal latitude is -180 and 180");

    satellite.changeParameter("latitude", latitude)
    return this
  }
  setSatelliteLongitude(satellite: Satellite, longitude: number) {
    if (!Validator.checkIfNumberInRange(longitude, -180, 180)) throw new Error("Minimal and maximal longitude is -180 and 180");

    satellite.changeParameter("longitude", longitude)
    return this
  }
  setSatellitePosition(satellite: Satellite, height: number, latitude: number, longitude: number) {
    this.setSatelliteHeight(satellite, height).setSatelliteLatitude(satellite, latitude).setSatelliteLongitude(satellite, longitude);
  }
  setGroupOfSatellitesPosition(satGroup: GroupOfSatellites, height: number, latitude: number, longitude: number) {
    satGroup.satellites.forEach((sat) => this.setSatellitePosition(sat, height, latitude, longitude));
  }
  setSatelliteSolarsail(satellite: Satellite, solarSail: "on" | "off") {

    satellite.changeState("solarSail", solarSail)
    return this
  }
  setSatelliteBroadcasting(satellite: Satellite, broadcasting: "on" | "off") {

    satellite.changeState("broadcasting", broadcasting)
    return this
  }
  createGroupOfSatellites(satelliteList: Satellite[] = []) {

    if (satelliteList.some(sat => satelliteList.indexOf(sat) !== satelliteList.lastIndexOf(sat))) throw new Error('The array must not contain repeated elements')
    const result = new GroupOfSatellites();
    satelliteList.forEach(satellite => result.addSatellite(satellite))
    return result
  }

}

class Overlord extends Operator {
  constructor(name: string, surname: string) {
    super(name, surname);
  }

  turnOffSatellite(satellite: Satellite) {

    satellite.changeState("turned", "off")
  }
  turnOffGroupOfSatellites(satGroup: GroupOfSatellites) {
    satGroup.satellites.forEach(sat => sat.changeState("turned", "off"))
  }
  turnOffAllSatellites() {
    allSatellites.forEach(sat => sat.changeState("turned", "off"))
  }
}

class Validator {
  static checkIfEmptyArray(array: any[]) {
    return !array.length
  }
  static ValidateEmail(email: string) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex)
  }
  static checkIfNumberInRange(number: number, min: number, max: number) {
    if (isNaN(number) || isNaN(min) || isNaN(max) || !isFinite(number) || !isFinite(min) || !isFinite(max)) throw new Error("Every input value must be a finite number")
    if (number === null || min === null || max === null) throw new Error("The input must contain the number, min and max range values");
    if (min > max) throw new Error("The min value has to be lower than the max");

    if (number > max || number < min) return false
    else true
  }
}


// const allSatellites: Satellite[] = []
// let satelita1 = new Satellite()
// let satelita2 = new Satellite()
// let grupaSatelit = new GroupOfSatellites()
// grupaSatelit.addSatellite(satelita1)
// grupaSatelit.addSatellite(satelita2)
// let operator1 = new Operator("Andrzej", "Nowak")
// let operator2 = new Overlord("Janusz", "Kowalski")



