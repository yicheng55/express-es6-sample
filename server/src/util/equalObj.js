function isEqual(obj1,obj2){
            if(!obj1 instanceof Object || !obj2 instanceof Object){/*  判断不是对象  */
                return obj1 === obj2;
            }
            if(Object.keys(obj1).length !== Object.keys(obj2).length){
                return false;
                //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,判断键值个数是否相等
            }
            for(var attr in obj1){//逐个值进行判断
                if(obj1[attr] instanceof Object && obj2[attr] instanceof Object){
                    return isEqual(obj1[attr],obj2[attr]);//如果值为对象再递归进行判断
                }else if(obj1[attr] !== obj2[attr]){
                    return false;
                }
            }
            return true;
        }
export default isEqual