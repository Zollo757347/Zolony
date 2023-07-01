import Image from "../../components/Image";

const GetStarted = () => {
  return (
    <article>
      <h1>在一切開始之前……</h1><hr />

      <section>
        <p>歡迎來到 Zolony，一個 Minecraft 紅石教學網。不過在你開始在這個網站的旅程之前，我想我需要好好跟你介紹一下 Zolony，幫助你快速融入這個世界！</p>
      </section>

      <section>
        <h2>Zolony？Minecraft？紅石？</h2>
        <p><b>Zolony</b> 是由創立這個網站的人 Zollo，還有 colony 這個單字合併而來的，至於為什麼是 colony……，礙於我不想在這裡解釋太多不相關的事情，所以之後可能會另外寫篇文章補充吧。</p>

        <p><b>Minecraft</b> 是一款自由度非常高的 3D 的沙盒遊戲，你可以在這個遊戲中以你最喜歡的方式創造與探險——<i>不過</i>——Zolony 並沒有要教你如何從零蓋出一棟中世紀皇城，也不會告訴你怎麼在一棵樹都沒有的惡地中生存，你在這裡所能看到的，就只有紅石而已。</p>

        <p><b>紅石</b>，或是你喜歡的話，可以叫它紅石系統。總之就是一個 Minecraft 中的系統，這個系統包含了很多與現實中的電路、機械相似的方塊與物品，讓你可以在遊戲中製造出各式各樣的機械結構。從小型的整人陷阱、中型的自動化農場，還是大型的電腦（像是 <a href="https://www.youtube.com/watch?v=-BP7DhHTU-I">Minecraft 裡的 Minecraft</a>），都是單靠紅石就可以做出來的。</p>

        <p>在這裡，我們會一步步從最基礎開始，由淺入深地介紹有關紅石的一切，因此就算你現在對紅石一竅不通也無妨，只要認真跟著我們的教學走，所有人都可以滿載而歸。</p>
      </section>

      <section>
        <h2>功能介紹</h2>
        <Image src={require("../../assets/pictures/general/index/layout.png")} width="90%" />

        <p>網站的左上角有一個六角形的按鈕，按下去之後會跳出文章列表，你可以快速跳轉到你想閱讀的文章；網站的右上角則是個人帳號的按鈕，點擊後會開啟下拉選單，你可以註冊／登入你的帳號，或是在登入狀態中察看帳號的狀態等等。</p>

        <p><b style={{ color: 'red' }}>注意：Zolony 的帳號系統仍然在測試階段，因此我們並不能保證所有帳號資料都能永久保存，在正式版的帳號系統啟用以前，所有資料都有可能會遺失！</b></p>
      </section>

      <section>
        <h2>我想讓這裡變得更好！</h2>
        <p>Zolony 是開源的，我們的原始碼就放在<a href="https://github.com/Zollo757347/Zolony">這裡</a>。如果你覺得這個網站有任何地方需要改進，歡迎到我們的 Github 專案上開 Issue，如果你會寫一點程式，也可以發 Pull Request 給我們。</p>
      </section>

      <section>
        <h2>時間差不多了……</h2>
        <p>該介紹的都介紹完了，如果你確定一切都沒有問題的話，整頓好你的心情，開始你在 Zolony 的冒險吧！</p>
      </section>
    </article>
  );
}

export default GetStarted;