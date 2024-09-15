module.exports= (query) =>{
    let objectKeyword ={
        keyword : '',
    }
    if(query.keyword){
        objectKeyword.keyword=query.keyword
        const flags = 'gim'
        const regax= new RegExp(objectKeyword.keyword,flags)
        objectKeyword.regax=regax  
    }
    return objectKeyword
}