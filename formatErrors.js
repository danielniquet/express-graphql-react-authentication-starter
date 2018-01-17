const formatErrors = (error,otherErrors)=>{
  const errors=error.errors;
  let objErrors = []

  if(errors){
    Object.entries(errors).map(error=>{
      const {path, message} = error[1];
      objErrors.push({path,message})
    })
    objErrors = objErrors.concat(otherErrors)
    return objErrors;
  }else if(otherErrors.length){
    return otherErrors;
  }


  const uknownError = {}
  switch(error.code){
    case 11000:
      uknownError.path = "username"
      uknownError.message = "El nombre de usuario ya existe"
    break;
    default:
      uknownError.path = "Desconocido"
      uknownError.message = error.message
  }
  return [uknownError]

}


export default formatErrors;
