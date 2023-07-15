import Canvas from '../../components/Canvas';
import Image from '../../components/Image';
import data from "../../assets/json/levels/Official Map 1.json"
import Note from '../../components/Note';
import Keybind from '../../components/Keybind';

const Transmit = () => {
  return (
    <article>
      <h1>明與暗的旅程．訊號傳遞</h1><hr/>

      <section>
        <p>在上一章中，我們獲得了電力的來源是電源（嗯？好像很廢話？），也知道了被啟動的電源其實就是強充能方塊，可以觸發附近的紅石元件。在這一章中，我們將會介紹如何把產生出的電力送到你想要的任何地方，廢話不多說，就直接開始吧！</p>
      </section>

      <section>
        <h2>紅石粉</h2>
        <p><b>紅石粉</b>（Redstone Dust）是一種傳輸元件，你可以很直覺地把它看成一般的電線。紅石粉被擺出來之後，會自動與四周高低差一格以內的紅石粉相連，形成一條線路。只要紅石粉與強充能方塊相鄰，紅石粉就會被點亮，向相連的紅石粉傳送紅石訊號，就像下圖這樣。</p>

        <Image src={require("../../assets/pictures/transmit/connection.png")} alt="紅石粉傳遞紅石訊號" width="50%"/>

        <p>眼尖的你可能會注意到，距離控制桿越遠的紅石粉好像比較暗，這是因為訊號在傳送時的強度會逐漸遞減的。以上圖的例子來說，控制桿會提供強度 15 的訊號，而紅石粉的訊號強度會與點亮它的強充能方塊相同，因此與控制桿直接相鄰的紅石粉的強度也是 15。但如果訊號是透過紅石粉傳送，每移動一格，訊號強度就會降低到 1，一直到強度變成 0，也就是完全沒訊號為止。</p>

        <Note type='success' style={{ display: 'flex', flexDirection: 'column' }}>
          <p>如果想要檢查紅石粉的訊號強度的話，可以<Keybind type='showDebugScreen' />，在右側 power 欄位就是訊號強度了！</p>
          <Image src={require("../../assets/pictures/transmit/power-level.png")} alt="紅石粉傳遞紅石訊號" width="80%" style={{ alignSelf: 'center' }} />
        </Note>
      </section>

      <section>
        <h2>充能</h2>
        <p>在上一章有提到，當電源被啟動時，自身會轉變為強充能方塊，某些電源也會把附近的方塊變成強充能方塊。對紅石粉而言，它可以把兩種方塊轉換成<b>弱</b>充能方塊，第一是它正下方的方塊，第二是它指向的方塊。</p>
        
        <p>正下方的方塊很直覺，但指向的方塊是什麼意思？其實這也不難理解，從紅石粉外觀上的形狀就可以看出來了，如果那格紅石粉有從中心連接到邊緣，就代表它正指向那個邊緣的方向，所以紅石粉最多可以指向東西南北方塊。</p>

        <p>值得一提的是，單格的紅石粉剛放出來時就是指向四周的，但你可以透過與該紅石粉<Keybind type='interact' />，把它調整成沒有任何指向的紅石粉，就像下圖這樣。</p>

        <Image src={require("../../assets/pictures/transmit/dust-adjust.png")} alt="滑鼠右鍵可以調整單格紅石粉的指向" width="50%"/>

        <p>左方的紅石粉指向四周，因此啟動時會觸發左方被指向的紅石燈；而右方的紅石粉沒有指向任何邊緣，因此啟動時並不會觸發四周的任何一個紅石燈。</p>

        <Note type='danger'>注意！弱充能的方塊並不能點亮紅石粉，紅石粉本身也不會被充能！</Note>
      </section>

      <section>
        <h2>紅石燈的亮暗情形</h2>
        <p>我們利用下面這張圖來做個總結，你可以發現：</p>
        <ul>
          <li>黃色紅石燈被啟動的紅石粉附著，因弱充能而觸發。</li>
          <li>綠色紅石燈被啟動的紅石粉指向，因弱充能而觸發。</li>
          <li>藍色紅石燈與弱充能方塊相鄰，因此也被觸發。</li>
          <li>紅色紅石燈位在啟動的紅石粉旁，但並沒有被指向，因此沒被觸發。</li>
          <li>暗紅色紅石燈雖然被紅石粉指向，但這時候紅石粉的訊號已經降到 0 了，因此也沒被觸發。</li>
        </ul>
        <Image src={require("../../assets/pictures/transmit/power.png")} alt="不同情形的亮與暗" width="50%"/>
        <p></p>
      </section>

      <section>
        <h2>隨堂小考</h2>
        <p>在下面的模擬 Minecraft 中，你會需要利用鐵方塊與紅石粉把所有紅石燈串聯起來，讓角落的控制器啟動時，所有紅石燈都會被點亮。</p>
        <p>就像在玩 Minecraft 一樣，你可以使用滑鼠滾輪來切換方塊，左鍵來破壞方塊，右鍵來放置方塊，對控制器按下右鍵時可以啟動控制器，點亮相鄰的紅石粉。</p>
        <p>當你把所有紅石燈都接好時，可以按下下方的「檢查地圖」按鈕來檢查你的答案是否正確！</p>
        <Canvas canvasHeight={500} canvasWidth={500} checkable={true} preLoadData={data}></Canvas>
      </section>
    </article>
  );
}

export default Transmit;