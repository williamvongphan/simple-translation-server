# Simple Translation Server
Allows you to call the Neural Space API just once, and use the cached translation instead of calling the API again.

Calling this app's API is just like calling the Neural Space API, and the response is the same as well. However, the response is cached, so after the first call, the second call will be much faster.

## Usage
1. Before you start, create a .env file in this directory with the following variable: `NEURALSPACE_AUTH_TOKEN=<your access token>`
2. Build the app: `npm run build`
3. Run the app: `npm start`
4. The app will be running on port 10750. If you need to change it, you can edit the port variable in the `index.ts` file. Just make sure to rebuild the app after changing the port.
5. Usage of this app is (almost) the same as using the Neural Space API.