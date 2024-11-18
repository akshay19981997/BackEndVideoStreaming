const asyncHandler = function (func)  {
return function (req,res,next){
Promise.resolve(func(req,res,next)).catch((err)=>{
return next(err);
})
}
}
export {asyncHandler};