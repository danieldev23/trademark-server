const express = require('express');
const api = require ('./api');





 function router(app) {
    app.use('/api', api);
}

module.exports = router;

