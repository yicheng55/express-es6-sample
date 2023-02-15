function deepClone(source){
  if (typeof source!== 'object') return;
    var target = source instanceof Array ? [] : {};
    for(var item in source){
      if(source.hasOwnProperty(item)){
        // 判断被拷贝的对象的属性类型是否为Object类型
        // 若是Object类型则循环调用自身，若不是则直接赋值给新对象
        if(typeof source[item] == 'object'){
            target[item] = deepClone(source[item])
        }else{
            target[item] = source[item];
        }
      }
    }
  return target;
}
export default deepClone