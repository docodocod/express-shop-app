const express=require('express');
const {default: mongoose} =require('mongoose');
const passport=require('passport');
const app=express();
const path=require('path');
const dotenv=require('dotenv');
const config=require('config');
const serverConfig=config.get('server');
const session=require('express-session');
const cookieSession=require('cookie-session');

const mainRouter=require('./routes/main');
const userRouter=require('./routes/users');
const productsRouter=require('./routes/products');
const cartRouter=require('./routes/cart');
const adminCategoryRouter=require('./routes/admin-categories');
const adminProductsRouter=require('./routes/admin-products');


const port=process.env.port;

dotenv.config();

app.use(session({
    secret:'superSecret',
    cookie:{
        httpOnly:true,
        secure:false,
    },
    name:'shop-app-cookie',
    resave:false,
    saveUninitialized:false
}))

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY]
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((err) => {
        console.log(err);
    })

app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) => {
    res.locals.cart = req.session.cart;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    next();
})

app.use('/',mainRouter);
app.use('/auth',userRouter);
app.use('/admin/category',adminCategoryRouter);
app.use('/admin/products',adminProductsRouter);
app.use('/products',productsRouter);
app.use('/cart',cartRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || '페이지를 찾을 수 없습니다.');
})

app.listen(port,()=>{
    console.log(`현재 ${port}번에서 대기중입니다.`);
})