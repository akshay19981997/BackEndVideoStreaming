const asyncHandler = (func) => {
return (res,rej)=> {
Promise.resolve(func(req,res,next)).catch((err)=>{
return next(err);
})
}
}
export {asyncHandler};