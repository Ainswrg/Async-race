const enum PageIds {
  Garage = 'garage',
  Winners = 'winners',
  Default = 'current-page',
}

const enum Endpoint {
  garage = 'garage',
  winners = 'winners',
  engine = 'engine',
}

const enum ErrorTypes {
  Error_404 = 404,
}

const enum Url {
  author = 'https://github.com/Ainswrg',
  school = 'https://rs.school/',
}
const enum Engine {
  start = 'started',
  stop = 'stopped',
  drive = 'drive',
}

const enum Sort {
  id = 'id',
  wins = 'wins',
  time = 'time',
  ASC = 'ASC',
  DESC = 'DESC',
}

const enum DefaultConst {
  carsCount = '4',
  defaultPage = '1',
}

const enum Event {
  update = 'update',
  updateCars = 'update-cars',
  select = 'select',
  delete = 'delete',
  start = 'start',
  race = 'race',
  reset = 'reset',
  stop = 'stop',
}

const enum Code {
  Success = 200,
  BadRequest = 400,
  NotFound = 404,
  TooManyRequest = 429,
  InternalServerError = 500,
}

const enum Pagination {
  garage = 'paginationGarage',
  winners = 'paginationWinners',
}

export { PageIds, ErrorTypes, Url, Endpoint, Engine, DefaultConst, Sort, Pagination, Event, Code };
