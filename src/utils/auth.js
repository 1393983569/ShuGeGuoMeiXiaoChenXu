export const getDayNumByYearMonth = (year, month) => {
  month = parseInt(month,10);  //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
	var temp = new Date(year,month,0);
	return temp.getDate()
}

/**
 * 防抖
 */
export const debounce = (fn, wait) => {
  let timeout = null;
  return function() {
      if(timeout !== null)   clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
  }
}

/**
 * 克隆Map对象
 * @param {Map} map
 */
export const cloneMap = (map) => {
  console.log(map.size, map)
  // if (map.size === 0) return new Map()
  const obj = {}
  const mapList = new Map()
  for (let [key, value] of map) {
    mapList.set(key, value)
  }
  return mapList
}
