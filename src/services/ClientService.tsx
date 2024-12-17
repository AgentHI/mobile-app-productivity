import {Constants} from '../constants/Constants';

export const SearchClients = async (query: string, tokens: string) => {
  console.log('SearchClientsapiHIT_________');

  try {
    const response = await fetch(
      `${Constants.ClientBaseUrl}/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${tokens}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    //   console.log(data);
    return data;
  } catch (error) {
    console.error('SearchClientsError:', error);
  }
};


export const UpdateClientApi = async (clientId:string, clientData:any,token:string ) => {
  // const url = `http://api.test.agenthi.ai:3000/api/${clientId}`;
  const url = `http://api.test.agenthi.ai:3000/api/clients/${clientId}`;

  try {

    const curlCommand = `
    curl -X 'PUT' \\
      '${url}' \\
      -H 'accept: application/json' \\
      -H 'Authorization: Bearer ${token}' \\
      -H 'Content-Type: application/json' \\
      -d '${JSON.stringify(clientData)}'
  `;

  // Print the curl command to the console
  console.log('UpdateClientApi_cURL:', curlCommand.trim());


    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Client updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating client:', error);
  }
};

export const DeleteClient = async (clientId:string, token:string) => {
  const url = `http://api.test.agenthi.ai:3000/api/clients/${clientId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    console.log('Client deleted successfully',response);
    return response;
  } catch (error) {
    console.error('Error deleting client:', error);
    return false;
  }
};