const MainPage = () => {
  return (
    <article>
      <div className="main-page" style={{ display: 'flex', marginTop: 30 }}>
        <div className="main-page-left" style={{ margin: 30 }}>
          <img src={require("../img/header/wordmark.png")} width="100%" />
        </div>
        <div className="main-page-right">
          <section style={{ margin: "5% 20% 5% 5%" }}>
            <h1 style={{ color: 'rgb(150, 150, 100)', fontSize: 35 }}><b>什麼是 Zolony？</b></h1>
            <p style={{ color: 'rgb(30, 50, 20)', margin: "0 250px 0 50px", fontSize: 20 }}>Zolony 是一個 Minecraft 紅石教學網站，這裡會從最基礎的紅石特性開始講起，一直到複雜的機械結構，一步一步帶你從新手走向專精。</p>
          </section>

          <section style={{ margin: "5% 12% 5% 35%" }}>
            <h1 style={{ color: 'rgb(150, 150, 100)', fontSize: 35 }}><b>什麼是紅石？</b></h1>
            <p style={{ color: 'rgb(30, 50, 20)', margin: "0 100px 0 50px", fontSize: 20 }}><a href="https://minecraft.fandom.com/zh/wiki/紅石粉" target="_blank">紅石</a>是 Minecraft 中專門用來建造機械結構的基礎材料，所有的自動化設施或多或少都需要紅石的幫助才能完成。</p>
          </section>

          <section style={{ margin: "5% 20% 5% 5%" }}>
            <h1 style={{ color: 'rgb(150, 150, 100)', fontSize: 35 }}><b>Zolony 標誌的由來</b></h1>
            <p style={{ color: 'rgb(30, 50, 20)', margin: "0 250px 0 50px", fontSize: 20 }}>因為 Minecraft 的世界是由方塊所組成的，而一個正方體在特定的角度下觀看，它的輪廓就會像是六角形一樣，於是這個網頁的作者就決定把六角形當作網頁的 logo 了。</p>
          </section>
        </div>
      </div>

    </article>
  );
}

export default MainPage;