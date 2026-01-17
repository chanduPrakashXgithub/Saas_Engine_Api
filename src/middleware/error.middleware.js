export const errorMiddleware = (err,req,res,next)=>{
     console.error(
        json.stringify({
            requestId:req.requestId,
            error : err.message,
            stack : err.stack,
            tenantId : req.tenantId,
        })
     )
    res.status(err.status||500).json({
        success:false,
        message:err.message||"Internal Server Error"
    });
};