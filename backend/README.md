# backend

## **schema graphql**

### **各個function的作用：**

#### **query**

- **login:** 輸入user的名字、密碼，得到使用者的一切資料，如果找不到該使用者或密碼打錯會回傳null。適用於user登入時。

- **getMap:** 輸入user的名字、地圖，得到某張地圖，如果找不到該地圖會回傳null。適用於前端獲取文章地圖時。

#### **mutation**

- **createUser:** 輸入user的名字、密碼，得到user的一切資料，如果已有相同的使用者會回傳null。適用於user創建一個帳號時。

- **editUser:** 輸入user的名字、密碼、新密碼、新自介、新通關數與新大頭貼網址時，得到user的一切資料。適用於user更改個人資料時。

- **createMap:** 輸入user的名字、密碼、地圖名稱與三軸限制，得到空的地圖。適用於user創建地圖時。

- **editMap:** 輸入user的名字、密碼、地圖名稱與一張地圖，得到更改後的地圖。適用於user儲存地圖時。

- **deleteUser:** 輸入user的名字、密碼，得到布林值，若無此user會回傳null。此function應在user delete他的資料時呼叫。

- **deleteMap:** 輸入user的名字、密碼與地圖名字，得到布林值。若無此地圖會回傳null。適用於user刪掉自己的地圖時

## **test data**

### **createUser:**

```graphql
mutation {
  createUser(data:{
    name: "yohe",
    password: "123"
  }) {
    name
    password
    avatar
    bio
    level
  }
}
mutation {
  createUser(data:{
    name: "zollo",
    password: "456"
  }) {
    name
    password
    avatar
    bio
    level
  }
}
mutation {
  createUser(data:{
    name: "renwei",
    password: "789"
  }) {
    name
    password
    avatar
    bio
    level
  }
}
```

### **editUser:**

```graphql
mutation {
  editUser(data:{
    name: "yohe",
    password: "123",
    newPassword: "12"
    newBio: "modify",
    newLevel: 3,
  }) {
    name
    password
    avatar
    bio
    level
  }
}
```

### **createMap:**

```graphql
mutation {
  createMap(data:{
    name: "yohe",
    password: "12",
    mapName: "yoheMap",
    xLen: 3,
    yLen: 3,
    zLen: 3,
  }) {
    xLen
    yLen
    zLen
    mapName
    validation {
      levers
      lamps
      boolFuncs
      timeout
    }
    playground {
      type
      breakable
      states {
        power 
        source

        delay
        facing
        face
        locked
        powered

        lit

        east
        south
        west
        north
      }
    }
  }
}
```

### **login:**

```graphql
query {
  login(data:{
    name: "yohe",
    password: "12"
  }) {
    name
    password
    avatar
    bio
    level
    maps {
      xLen
      yLen
      zLen
      mapName
      validation {
        levers
        lamps
        boolFuncs
        timeout
      }
      playground {
        type
        breakable
        states {
          power 
          source

          delay
          facing
          face
          locked
          powered

          lit

          east
          south
          west
          north
        }
      }
    }
  }
}
query {
  login(data:{
    name: "yohe",
    password: "123"
  }) {
    name
    password
    avatar
    bio
    level
    maps {
      xLen
      yLen
      zLen
      mapName
      validation {
        levers
        lamps
        boolFuncs
        timeout
      }
      playground {
        type
        breakable
        states {
          power 
          source

          delay
          facing
          face
          locked
          powered

          lit

          east
          south
          west
          north
        }
      }
    }
  }
}
```

### **getMap:**

```graphql
query {
  getMap(data:{
    name: "yohe",
    mapName: "yoheMap"
  }) {
    xLen
    yLen
    zLen
    mapName
    validation {
      levers
      lamps
      boolFuncs
      timeout
    }
    playground {
      type
      breakable
      states {
        power 
        source

        delay
        facing
        face
        locked
        powered

        lit

        east
        south
        west
        north
      }
    }
  }
}
```

### **deleteUser:**

```graphql
mutation {
  deleteUser(data:{
    name: "yohe",
    password: "12",
  }) 
}
```

### **deleteMap:**

```graphql
mutation {
  deleteMap(data:{
    name: "yohe",
    password: "12",
    mapName: "yoheMap"
  })
}
```

### **editMap:**

```graphql
mutation {
  editMap(data:{
    name: "yohe",
    password: "12",
    mapName: "yoheMap",
    map: {
      xLen: 1,
      yLen: 1,
      zLen: 2,
      mapName: "yoheMap10",
      playground: [[[
        {
          type: 1,
          breakable: false,
          states: {
            power: 0,
            source: false,
          }
        },
        {
          type: 1,
          breakable: false
          states: {
            power: 0,
            source: false,
          }
        }
      ]]]
    }
  }) {
    xLen
    yLen
    zLen
    mapName
    validation {
      levers
      lamps
      boolFuncs
      timeout
    }
    playground {
      type
      breakable
      states {
        power 
        source

        delay
        facing
        face
        locked
        powered

        lit

        east
        south
        west
        north
      }
    }
  }
}

mutation {
  editMap(data:{
    name: "admin",
    password: "123",
    mapName: "Map1",
    map: {
      xLen: 1,
      yLen: 1,
      zLen: 2,
      mapName: "yoheMap10",
      validation: {
        levers: [[0, 0, 0]],
        lamps: [[1, 1, 1], [2, 2, 2]],
        boolFuncs: [[[1]], [[1]]],
        timeout: 500
      }
      playground: [[[
        {
          type: 1,
          breakable: false,
          states: {
            power: 0,
            source: false,
          }
        },
        {
          type: 1,
          breakable: false
          states: {
            power: 0,
            source: false,
          }
        }
      ]]]
    }
  }) {
    xLen
    yLen
    zLen
    mapName
    validation {
      levers
      lamps
      boolFuncs
      timeout
    }
    playground {
      type
      breakable
      states {
        power 
        source

        delay
        facing
        face
        locked
        powered

        lit

        east
        south
        west
        north
      }
    }
  }
}
```