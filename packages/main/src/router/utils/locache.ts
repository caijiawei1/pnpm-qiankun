const root = window

const supportsNativeJSON = !!root.JSON
const supportsLocalStorage = (() => {
  try {
    const test_val = '___locache___'
    root.localStorage.setItem(test_val, test_val)
    root.localStorage.getItem(test_val)
    root.localStorage.removeItem(test_val)
    return true
  } catch (e) {
    return false
  }

})()
const supportsSessionStorage = (() => {
  try {
    const test_val = '___locache___'
    root.sessionStorage.setItem(test_val, test_val)
    root.sessionStorage.getItem(test_val)
    root.sessionStorage.removeItem(test_val)
    return true
  } catch (e) {
    return false
  }
})()

class _LocacheCache {
  constructor(options?: any) {
    if (options && options.storage) {
      this.storage = options.storage
    }
  }

  VERSION = 'VERSION-PLACEHOLDER'
  cachePrefix = '___locache___'
  expirePrefix = '___locacheExpire___'
  storage = local

  get _currentTime() {
    return new Date().getTime()
  };

  key(key: string) {
    return this.cachePrefix + key
  };

  expirekey(key: string) {
    return this.expirePrefix + key
  };

  hasExpired(key: string) {

    const expireKey = this.expirekey(key)
    const expireValue = parseInt(this.storage.get(expireKey) as any, 10)
    if (expireValue && expireValue < this._currentTime) {
      return true
    }

    return false

  };

  set(key?: any, value?: any, seconds?: any) {
    if (!this.storage.enabled || !key) {
      return
    }

    const expireKey = this.expirekey(key)
    const valueKey = this.key(key)

    if (seconds) {
      const ms = seconds * 1000
      this.storage.set(expireKey, this._currentTime + ms)
    } else {
      this.storage.remove(expireKey)
    }
    value = JSON.stringify(value)
    return this.storage.set(valueKey, value)

  };

  get(key: string) {
    if (!this.storage.enabled || !key) {
      return null
    }
    if (this.hasExpired(key)) {
      this.remove(this.key(key))
      return null
    }

    const valueKey = this.key(key)
    const value = this.storage.get(valueKey)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (err) {
        return null
      }
    }
    return value

  };

  remove(key: string) {
    if (!this.storage.enabled) {
      return
    }

    const expireKey = this.expirekey(key)
    const valueKey = this.key(key)

    this.storage.remove(expireKey)
    this.storage.remove(valueKey)

  };

  incr(key: string) {
    if (!this.storage.enabled) {
      return
    }

    let current = parseInt(this.get(key), 10)
    if (!current) {
      current = 0
    }
    current++
    this.set(key, current)
    return current

  };

  decr(key: string) {
    if (!this.storage.enabled) {
      return
    }

    let current = parseInt(this.get(key), 10)
    if (!current) {
      current = 0
    }
    current--
    this.set(key, current)
    return current

  };

  setMany(properties?: any, seconds?: any) {
    if (!this.storage.enabled) {
      return
    }
    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        this.set(key, properties[key], seconds)
      }
    }
  };

  getMany(keys?: any) {
    const results = {}
    for (let i = 0; i < keys.length; i++) {
      if (this.storage.enabled) {
        results[keys[i]] = this.get(keys[i])
      } else {
        results[keys[i]] = null
      }
    }
    return results
  };

  getManyValues(keys?: any) {

    const results = []

    for (let i = 0; i < keys.length; i++) {
      if (this.storage.enabled) {
        results.push(this.get(keys[i]))
      } else {
        results.push(null)
      }
    }
    return results
  };

  removeMany(keys?: any) {
    if (!this.storage.enabled) {
      return
    }
    for (let i = 0; i < keys.length; i++) {
      this.remove(keys[i])
    }
  };

  flush() {
    if (!this.storage.enabled) {
      return
    }
    const length = this.storage.length
    const prefix = this.cachePrefix
    for (let i = length - 1; i >= 0; i--) {
      const key = this.storage.key(i)
      if (key && key.indexOf(prefix) === 0) {
        const actualKey = key.substring(prefix.length, key.length)
        this.remove(actualKey)
      }
    }

  };

  get length() {
    if (!this.storage.enabled) {
      return 0
    }

    let c = 0
    const length = this.storage.length
    const prefix = this.cachePrefix

    for (let i = 0; i < length; i++) {
      if (this.storage.key(i).indexOf(prefix) === 0) {
        c++
      }
    }

    return c

  };

  keys() {
    if (!this.storage.enabled) {
      return []
    }

    const keys = []
    const length = this.storage.length
    const prefix = this.cachePrefix

    for (let i = 0; i < length; i++) {
      const key: any = this.storage.key(i)
      if (key.indexOf(prefix) === 0) {
        const actualKey = key.substring(prefix.length, key.length)
        keys.push(actualKey)
      }
    }

    return keys

  };

  cleanup() {
    if (!this.storage.enabled) {
      return
    }

    const length = this.storage.length
    const prefix = this.cachePrefix

    for (let i = length - 1; i >= 0; i--) {
      const key = this.storage.key(i)
      if (key && key.indexOf(prefix) === 0) {
        const actualKey = key.substring(prefix.length, key.length)
        if (this.hasExpired(actualKey)) {
          this.remove(actualKey)
        }
      }
    }

  };
}

class _local {
  set(key: string, value?: any) {
    return root.localStorage.setItem(key, value)
  }

  get(key?: any) {
    return root.localStorage.getItem(key)
  }

  remove(key: string) {
    return root.localStorage.removeItem(key)
  }

  get length() {
    return root.localStorage.length
  }

  key(index: number): any {
    if (index < 0 || index >= this.length) {
      return
    }
    return root.localStorage.key(index)
  }

  get enabled() {
    return supportsNativeJSON && supportsLocalStorage
  }
}

export const local = new _local()

class _session {
  set(key: string, value?: any) {
    return root.sessionStorage.setItem(key, value)
  }

  get(key: string) {
    return root.sessionStorage.getItem(key)
  }

  remove(key: string) {
    return root.sessionStorage.removeItem(key)
  }

  get length() {
    return root.sessionStorage.length
  }

  key(index: number) {
    if (index < 0 || index >= this.length) {
      return
    }
    return root.sessionStorage.key(index)
  }

  get enabled() {
    return supportsNativeJSON && supportsSessionStorage
  }
}

export const $session = new _session()
export const LocacheCache = new _LocacheCache()

class _async {
  set(key?: any, value?: any, seconds?: any): any {
    return Promise.resolve(LocacheCache.set(key, value, seconds))
  }

  get(key: string): any {
    return Promise.resolve(LocacheCache.get(key))
  }
}

const async = new _async()

export class _locache extends _LocacheCache {
  session = new _LocacheCache({
    storage: $session,
  })
  async = async
}

export const locache = new _locache()

export const createCache = (options?: any) => {
  return new _LocacheCache(options)
}

export default locache
