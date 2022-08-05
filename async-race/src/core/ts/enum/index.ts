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

const enum DefaultConst {
  carsCount = '4',
  defaultPage = '1',
}

export { PageIds, ErrorTypes, Url, Endpoint, Engine, DefaultConst };
