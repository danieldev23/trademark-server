const express =  require('express');
const router = express.Router();

router.get('/api/admin', (req, res) => {
   res.send("Welcome to my home page"); 
});


export default router;


