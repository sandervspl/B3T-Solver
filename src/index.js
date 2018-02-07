import express from 'express';

const app = express();
app.set('port', 3000);

app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});
