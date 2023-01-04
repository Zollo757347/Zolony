# backend

## **schema graphql**

### **各個function的作用：**

#### **query**

- **logIn:** 輸入user的名字、密碼，得到使用者的一切資料，如果找不到該使用者或密碼打錯會回傳null。適用於user登入時。

- **getMap:** 輸入user的名字、地圖，得到某張地圖，如果找不到該地圖會回傳null。適用於前端獲取文章地圖時。

#### **mutation**
    
- **createAccount:** 輸入user的名字、密碼，得到user的一切資料，如果已有相同的使用者會回傳null。適用於user創建一個帳號時。

- **editProfile:** 輸入user的名字、密碼、新名字、新密碼、新自介與新大頭貼網址時，得到user的一切資料。適用於user更改個人資料時。

- **initialMyMap:** 輸入user的名字、密碼、地圖名稱與三軸限制，得到空的地圖。適用於user創建地圖時。

- **editMyMap:** 輸入user的名字、密碼、地圖名稱與一張地圖，得到更改後的地圖。適用於user儲存地圖時。

- **deleteUser:** 輸入user的名字、密碼，得到布林值，若無此user會回傳null。此function應在user delete他的資料時呼叫。

- **deleteUserMap:** 輸入user的名字、密碼與地圖名字，得到布林值。若無此地圖會回傳null。適用於user刪掉自己的地圖時

## **test data**

### **createAccount:**

``` graphql
    mutation {
        createAccount(data:{
            name: "yohe",
            password: "123"
        }) {
            name
            password
            avatar
            bio
        }
    }
    mutation {
        createAccount(data:{
            name: "zollo",
            password: "456"
        }) {
            name
            password
            avatar
            bio
        }
    }
    mutation {
        createAccount(data:{
            name: "renwei",
            password: "789"
        }) {
            name
            password
            avatar
            bio
        }
    }
```

### **editProfile:**

``` graphql
    mutation {
        editProfile(data:{
            name: "yohe",
            password: "123",
            newPassword: "12"
            newBio: "modify",
        }) {
            name
            password
            avatar
            bio
        }
    }
```

### **initialMyMap:**

``` graphql
    mutation {
        initialMyMap(data:{
            name: "yohe",
            password: "12",
            mapName: "yoheMap",
            xLen: 3,
            yLen: 3,
            zLen: 3,
        }) {
            mapName
            playground {
                blockName
                type
                breakable
                states {
                    power 
                    source
                }
            }
        }
    }
```

### **logIn:**

``` graphql
    query {
        logIn(data:{
            name: "yohe",
            password: "12"
        }) {
            name
            password
            avatar
            bio
            maps {
                xLen
                yLen
                zLen
                mapName
                playground {
                    blockName
                    type
                    breakable
                    states {
                        power 
                        source
                    }
                }
            }
        }
    }
    query {
        logIn(data:{
            name: "yohe",
            password: "123"
        }) {
            name
            password
            avatar
            bio
        }
    }
```

### **getMap:**

``` graphql
    query {
        getMap(data:{
            name: "yohe",
            mapName: "yoheMap"
        }) {
            mapName
            xLen
            yLen
            zLen
            playground {
                blockName
                type
                breakable
                states {
                    power 
                    source
                }
            }
        }
    }
```

### **deleteUser:**

``` graphql
    mutation {
        deleteUser(data:{
            name: "yohe",
            password: "12",
        }) 
    }
```

### **deleteUserMap:**

``` graphql
    mutation {
        deleteUserMap(data:{
            name: "yohe",
            password: "12",
            mapName: "yoheMap"
        })
    }
```

### **editProfile:**

``` graphql
    mutation {
        editMyMap(data:{
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
                        blockName: "Concrete",
                        type: 1,
                        breakable: false,
                        states: {
                            power: 0,
                            source: false,
                        }
                    },
                    {
                        blockName: "Concrete",
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
            mapName
            xLen
            yLen
            zLen
            playground {
                blockName
                type
                breakable
                states {
                    power 
                    source
                }
            }
        }
    }
```

