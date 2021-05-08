/* eslint-disable */
import fetch from 'cross-fetch';

export async function makeHttpCall(
  url: string,
  headers?: { [key: string]: string }
): Promise<any> {
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw Error(JSON.stringify(data));
  }
  return data;
}
