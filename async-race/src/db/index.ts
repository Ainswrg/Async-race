import { ICar } from '@core/ts/interfaces';

class Database {
  getData = async (endpoint: string): Promise<ICar[]> => {
    const response = await fetch(`http://localhost:3000/${endpoint}`);
    const res = await response.json();
    return res;
  };
  createCar = async (name: string, color: string) => {
    const response = await fetch('http://localhost:3000/garage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    });
    const res = await response.json();
    return res;
  };
}

export default Database;
