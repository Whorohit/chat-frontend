export const transformimage = (url = "", width = 100) => {
    return url
}

export const getorsavefromstorage = ({ key, value,get }) => {
    if(get)
        {return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):null
    
    
          }
        else{
            localStorage.setItem(key,JSON.stringify(value))
        }
    
    } 