# backend

## **undo**

resolver

## **schema graphql**

### **各個function的作用：**

- **checkMyMap:** 輸入user的名字、密碼與地圖名字，得到地圖。適用於user點開自己的地圖時

- **checkUser:** 輸入user的名字、密碼，得到user的一切資料。適用於user點開自己的檔案時。

- **checkMap:** 輸入地圖名字，得到某張地圖，適用於client點入一個有地圖的文章時。
    
- **createAccount:** 輸入user的名字、密碼，得到user的一切資料。適用於user創建一個帳號時。

- **editProfile:** 輸入user的名字、密碼與大頭貼時，得到user的一切資料。適用於user更改個人資料時。

- **initialMyMap:** 輸入user的名字、密碼、地圖名稱與三軸，得到空的地圖。適用於user創建地圖時。

- **editMyMap:** 輸入user的名字、密碼、地圖名稱與一張地圖，得到更改後的地圖。適用於user儲存地圖時。

- **initialMap:** call完後回傳布林，此function應在試驗時手動呼叫，會將原本的文章中的Map資訊從後端匯入database。

- **deleteUser:** 輸入user的名字、密碼，得到布林值，此function應在user delete他的資料時呼叫。

- **deleteUserMap:** 輸入user的名字、密碼與地圖名字，得到布林值。適用於user刪掉自己的地圖時