import Canvas from '../../components/Canvas';
import Image from '../../components/Image';
import data from "../../assets/json/levels/Official Map 1.json"

const Transmit = () => {
  return (
    <article>
      <h1>明與暗的旅程．訊號傳遞</h1><hr/>

      <section>
        <p>有了訊號的來源之後，接下來就需要透過<b>紅石粉</b>將訊號導引出來了。</p>
      </section>

      <section>
        <h2>紅石粉</h2>
        <p><b>紅石粉</b>（Redstone Dust）是一種傳輸元件，是傳遞紅石訊號最簡單也最有效率的手段，任何相鄰的紅石粉，或高低差只有一格的紅石粉都會自動連在一起，但高低差只要大於一格就無法連接了。只要紅石粉的任一個相鄰方塊被強充能（而非弱充能），該紅石粉就會被啟動，且相連的紅石粉也都會跟著被啟動，達成訊號傳遞的效果，這種訊號傳遞是沒有延遲的。</p>
        <Image src={require("../../assets/pictures/transmit/connection.png")} alt="紅石粉傳遞紅石訊號" width="50%"/>
        <p>從上圖還可以發現，距離控制桿越遠，紅石粉顏色也會越暗，這是因為當紅石訊號是透過紅石粉傳遞時，訊號強度會從 15 逐格遞減到 0，而紅石粉亮度就代表它本身的訊號強度。如果要確認某個紅石粉確切的訊號強度，你可以按下 <code>F3</code> 並將準心指向紅石粉，在右側的 <code>power</code> 欄位中就會顯示紅石粉的訊號強度了。</p>
        <Image src={require("../../assets/pictures/transmit/power-level.png")} alt="紅石粉傳遞紅石訊號" width="50%"/>
      </section>

      <section>
        <h2>充能</h2>
        <p>紅石粉雖然只是傳輸元件，但也有將其他方塊充能的能力。上一個章節提到，當電源被啟動時，最多會有兩種方塊被強充能（自身以及指向方塊），而當紅石粉被啟動時，最多也會有兩種方塊被弱充能，一個是紅石粉所附著的方塊，另一個則是紅石粉所指向的方塊。<b>注意！紅石粉本身並不會被充能！</b></p>
        <h3>附著方塊</h3>
        <p>如果某個方塊 A 被破壞後，附著在其上的另一個方塊 B 會隨之被破壞，則方塊 A 就是方塊 B 的附著方塊。</p>
        <h3>紅石粉的指向方塊</h3>
        <p>紅石粉的指向方塊可以從外觀上很輕易地辨別出來，如果有在單格內有一條紅石線從方格的中心延伸向邊緣，則該紅石粉就是指向該邊緣。因為一個方格可以有四個邊，所以一個紅石粉最多可以有四個指向。特別的是，單格的紅石粉可以透過滑鼠右鍵來調整是否指向其四周的方塊：</p>
        <Image src={require("../../assets/pictures/transmit/dust-adjust.png")} alt="滑鼠右鍵可以調整單格紅石粉的指向" width="50%"/>
        <p>左方的紅石粉指向四周，因此啟動時會觸發左方被指向的紅石燈；而右方的紅石粉沒有指向任何邊緣，因此啟動時並不會觸發任何四周的紅石燈。</p>
      </section>

      <section>
        <h2>紅石燈的亮暗情形</h2>
        <p>我們利用下面這張圖來做個總結，你可以發現：</p>
        <ul>
          <li>黃色紅石燈被啟動的紅石粉附著，因弱充能而觸發。</li>
          <li>綠色紅石燈被啟動的紅石粉指向，因弱充能而觸發。</li>
          <li>藍色紅石燈與弱充能方塊相鄰，因此也被觸發。</li>
          <li>紅色紅石燈位在啟動的紅石粉旁，但並沒有被指向，因此沒被觸發。</li>
          <li>暗紅色紅石燈雖然被紅石粉所指向，但紅石粉超過訊號傳遞距離而沒被啟動，因此也沒被觸發。</li>
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