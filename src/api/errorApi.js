export function errorApi(error){
   const data =error?.response?.data;
     return {
           message: data?.message || "Something went wrong.",
           fieldErrors: data?.fieldErrors || {}
       };
}