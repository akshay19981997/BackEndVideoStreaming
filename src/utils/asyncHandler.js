const asyncHandler = (func) => {
return (req,res,next)=> {
Promise.resolve(func(req,res,next)).catch((err)=>{
return next(err);
})
}
}
export {asyncHandler};