const app = require('./app')
require('dotenv').config({ silent: true }) 

const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const close = () => {
  listener.close()
}

module.exports = {
  close
}