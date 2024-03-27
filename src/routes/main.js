const express=require('express');
const router=express.Router();
const {isNotLoggedIn,isLoggedIn}=require('../middleware/index');

router.get('/',(req,res)=>{
    res.redirect('/products')
})
router.get('/login',isNotLoggedIn,(req,res)=>{
    res.render('auth/login');
});

router.get('/signup',isNotLoggedIn,(req,res)=>{
    res.render('auth/signup');
})



module.exports=router;