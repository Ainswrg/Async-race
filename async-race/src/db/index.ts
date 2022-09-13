import { ICar } from '@core/ts/interfaces';
import { Endpoint } from '@core/ts/enum';
import type { TGetCars } from '@core/ts/types';

const BASE = 'https://my-async-race.herokuapp.com';
const enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

class Database {
  getCars = async (endpoint: string, page: number | string, limit: number | string = 7): Promise<TGetCars> => {
    const response = await fetch(`${BASE}/${endpoint}?_page=${page}&_limit=${limit}`);
    return {
      items: await response.json(),
      total: response.headers.get('X-Total-Count'),
    };
  };

  getCar = async (id: string): Promise<ICar> => {
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
  startEngine = async (id: string, status: string): Promise<{ velocity: number; distance: number }> => {
    const response = await fetch(`${BASE}/${Endpoint.engine}?id=${id}&status=${status}`, {
      method: Methods.PATCH,
    });
    return response.json();
  };
  switchCarEngine = async (id: string, status: string): Promise<Response> => {
    const response = await fetch(`${BASE}/${Endpoint.engine}?id=${id}&status=${status}`, {
      method: Methods.PATCH,
    });
    return response;
  };
  getWinners = async (
    page: number | string,
    sort: string = '',
    order: string = '',
    limit: number | string = 10
  ): Promise<TGetCars> => {
    const response = await fetch(
      `${BASE}/${Endpoint.winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
    );
    return {
      items: await response.json(),
      total: response.headers.get('X-Total-Count'),
    };
  };
  getWinner = async (id: string): Promise<ICar> => {
    const response = await fetch(`${BASE}/${Endpoint.winners}/${id}`);
    return response.json();
  };
  updateWinner = async (id: string, body: { wins: number; time: number }): Promise<ICar> => {
    const response = await fetch(`${BASE}/${Endpoint.winners}/${id}`, {
      method: Methods.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  };
  deleteWinner = async (id: string): Promise<void> => {
    await fetch(`${BASE}/${Endpoint.winners}/${id}`, {
      method: Methods.DELETE,
    });
  };
  createWinner = async (id: number, wins: number, time: number): Promise<void> => {
    await fetch(`${BASE}/${Endpoint.winners}`, {
      method: Methods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        wins,
        time,
      }),
    });
  };
}

export default Database;
