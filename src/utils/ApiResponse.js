export const ApiResponse=(res,statusCode,data=null,message=null)=>{
    if(statusCode==null || typeof(statusCode)!=='number'){
       return res.status(400).json({message:"error:Status code must be number only and it cannot be null",data:null})
    }
    if(typeof(message)!=='string' || null){
       return res.status(400).json({message:"error:message must be sent in string or can be null only.",data:null})
    }
    if(message.toLowerCase().includes('error')){
       data=null;
    }
    return res.status(statusCode).json({
     message,
     data
    });
 }