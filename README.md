# Chat App React Frontend

This is the frontend of the real-time chat app built with Vite, ReactJs and Typescript. Users can chat, audio-call and video-call with each other see realtime update with optimistic update. Socket.io is used for real-time features and PeerJs for audio and video calls.

### [Live Site Link](https://chat-app-react-gray.vercel.app)

## Technology

- Vite
- ReacJs
- React Router Dom
- Reac Hook Form
- Tanstack Query
- Tailwind CSS
- Shadcn UI
- Axios
- Socket.io-client
- PeerJs
- Zod
- Typescript

## Run the project in your local mechine

### Requirements

- Node Js (Make sure you have node js installed on your mechine).
- MongoDB Compass (optional: if you want to use mongodb localy).

### Installation

1. Clone this repo:
   - `git clone https://github.com/NaZmuZ-SaKiB/chat-app-react.git`
2. Install all necessary dependencies:
   - `cd chat-app-react`
   - `npm install` or `yarn`
3. Create a `.env` file in current directory and add following properties:

   - `VITE_BASE_API_URL` = api url

4. Run the development server using following command:
   - `npm run dev` or `yarn dev`
5. To build the project run following command:
   - `npm run build` or `yarn build`
6. To run the build version of the project run following command:

   - `npm run start` or `yarn start`

### Deployment

1. Build the project and push to github.
2. Go to vercel and create an account or login
3. Create new project and select the github repository
4. Add necessary environment variables
5. Wait for the build to complete
