import { app } from './app';
import  http from 'http';


const PORT = process.env.PORT;
const server = http.createServer(app);
server.listen(PORT);
server.on('listening', async () => {
    console.log(`Server is running on http://localhost:${PORT}/docs `);
    // try {
    //     await MongoHelper.connect('mongodb://localhost:27017/calendarManagement');
    //     console.info('Connected to Mongo');

    // } catch( err ) {s
    //     console.error(err);
    // }
});