import { TGetCars } from '@core/ts/types';

const BASE = 'http://localhost:3000';
const enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class Database {
  getCars = async (endpoint: string, page: number, limit: number = 7): Promise<TGetCars> => {
    const response = await fetch(`${BASE}/${endpoint}?_page=${page}&_limit=${limit}`);
    return {
      items: await response.json(),
      total: response.headers.get('X-Total-Count'),
    };
  };

  createCar = async (name: string, color: string): Promise<void> => {
    await fetch(`${BASE}/garage`, {
      method: Methods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    });
  };
  updateCar = async (name: string, color: string): Promise<void> => {
    await fetch(`${BASE}/garage`, {
      method: Methods.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    });
  };
  deleteCar = async (id: string): Promise<void> => {
    await fetch(`${BASE}/garage/${id}`, {
      method: Methods.DELETE,
    });
  };
}

export default Database;
