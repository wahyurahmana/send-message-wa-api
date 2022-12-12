const express = require('express')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth} = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

const app = express()
const port = 3001
const cors = require('cors')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/send', async (req, res, next) => {
  const num = await client.getNumberId(req.body.no_hp_ortu)
  await client.sendMessage(num._serialized, req.body.message)
  res.status(200).json({message : 'Message Has Been Send '+req.body.no_hp_ortu})
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
  client.initialize();
  
  client.on('loading_screen', (percent, message) => {
      console.log('LOADING SCREEN', percent, message);
  });
  
  client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
  });
  
  client.on('authenticated', () => {
      console.log('AUTHENTICATED');
  });
  
  client.on('auth_failure', msg => {
      // Fired if session restore was unsuccessful
      console.error('AUTHENTICATION FAILURE', msg);
  });
  
  client.on('ready', () => {
      console.log('READY');
  });
  
})