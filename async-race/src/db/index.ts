import { Endpoint } from '@core/ts/enum';
import type { TGetCars } from '@core/ts/types';

const BASE = 'http://localhost:3000';
const enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class Database {
  getCars = async (endpoint: string, page: number | string, limit: number | string = 7): Promise<TGetCars> => {
    const response = await fetch(`${BASE}/${endpoint}?_page=${page}&_limit=${limit}`);
    return {
      items: await response.json(),
      total: response.headers.get('X-Total-Count'),
    };
  };

  getCar = async (id: string) => {
    const response = await fetch(`${BASE}/${Endpoint.garage}/${id}`);
    return response.json();
  };

  createCar = async (name: string, color: string): Promise<void> => {
    await fetch(`${BASE}/${Endpoint.garage}`, {
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
  updateCar = async (name: string, color: string, id: string): Promise<void> => {
    await fetch(`${BASE}/${Endpoint.garage}/${id}`, {
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
    await fetch(`${BASE}/${Endpoint.garage}/${id}`, {
      method: Methods.DELETE,
    });
  };
}

export default Database;
