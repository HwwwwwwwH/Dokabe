const asyncLocalStorage = {
      setItem: async function (key: any, value: any) {
          await null
          return localStorage.setItem(key, value)
      },
      getItem: async function (key: any) {
          await null
          return localStorage.getItem(key)
      },
      clear: async function (){
          await null
          return localStorage.clear()
      }
}

export default asyncLocalStorage