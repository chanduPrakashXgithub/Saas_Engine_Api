export  const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("fisnish",()=>{
        const duration = date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    })
    next();
};