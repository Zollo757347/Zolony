import Image from '../../components/Image';
import Note from '../../components/Note';
import Table from '../../components/Table';

import tableData from "../../assets/json/tables/signal.json";

const Signal = () => {
  return (
    <article>
      <h1>一切的開端．訊號</h1><hr/>

      <section>
        <p>Minecraft 的紅石系統基本上就是利用各種紅石零件，復刻了現實生活中的各種電路。這個章節作為紅石篇的第一章，我們就需要好好介紹在紅石系統中，電力是怎麼來的？</p>
      </section>

      <section>
        <h2>電源</h2>
        <p><b>電源</b>（Power Source）是一種可以產生電力，也就是紅石訊號的方塊，就是這樣，簡單直白。如果以控制桿舉例，控制桿就像是現實生活中的開關一樣，按一下就開，再按一下就關。所以從下圖就可以看出來，右邊的控制桿被拉下了，代表它正處於開啟的狀態，所以它會提供訊號，把被它附著的紅石燈點亮。</p>

        <Image src={require("../../assets/pictures/signal/lever.png")} alt="控制桿的開與關" width="50%"/>

        <p>其實，Minecraft 裡面絕大多數的電源是不會一擺出來就會給你免費的無限能量，通常電源都需要符合特殊的條件才會啟動。以控制桿來說，你必須要親手把控制桿撥下，控制桿才會產生紅石訊號，觸發周圍的紅石機關。每一種不同的電源，說穿了就只是啟動條件不一樣而已，比如說壓力板在被實體壓住時才會啟動，而日光感測器則是在白天時才會啟動。</p>

        <Note>雖然電源會提供電力，但它們不會像現實世界的電源一樣讓你觸電！</Note>
      </section>

      <section>
        <h2>充能</h2>
        <p><b>充能</b>（Powering）可以直接從字面上理解意思——「填充能量」，雖然它的意思簡單，卻也是紅石電路中最重要的機制。當一個電源被啟動後，就會轉變為「強充能方塊」，主動提供電源，並啟動相鄰的紅石機關。</p>

        <p>這時候我們就必須岔個題，來講解一下什麼是「強充能方塊」。從紅石系統的觀點而言，所有方塊都會根據它當下充能程度的強弱而分成三種狀態：強充能方塊、弱充能方塊、一般方塊，而強充能方塊與弱充能方塊可以合稱為充能方塊。</p>

        <ul>
          <li>強充能方塊：可以啟動相鄰的紅石機關與紅石粉。</li>
          <li>弱充能方塊：只能啟動相鄰的紅石機關。</li>
          <li>一般方塊：就是一般方塊，不會啟動任何紅石元件。</li>
        </ul>

        <p>我們再回過頭來看這句話：「當一個電源被啟動後，就會轉變為『強充能方塊』。」意思就是在正常狀態下，電源就只是一般方塊，不提供任何紅石訊號，但當它被啟動時，就會轉變成強充能方塊，啟動相鄰的紅石機關。</p>
        
        <p>再搬出剛剛的那張圖，你現在已經可以解釋為什麼右邊的紅石燈會亮了：因為右邊的控制桿啟動了，所以轉換成了強充能方塊，而右邊的紅石燈因為與強充能方塊相鄰，所以被它觸發而點亮。</p>

        <Image src={require("../../assets/pictures/signal/lever.png")} alt="控制桿的開與關" width="50%"/>

        <p>不過……如果你認為電源的能力僅此而已，那你就大錯特錯了，事實上，某些電源有著更強大的影響力，可以在啟動時把自身以外的另一個方塊也變成強充能方塊。我們再次以控制桿來作為例子，當控制桿被啟動時，除了控制桿本身會變成強充能方塊，被附著的方塊也會變成強充能方塊，可以參考下圖：</p>

        <Image src={require("../../assets/pictures/signal/power.png")} alt="控制桿的充能" width="50%"/>

        <p>在圖的左側，藍色紅石燈與黃色紅石燈都因為與控制桿相鄰而被觸發。在圖的右側，啟動的控制桿把附著上的白色混凝土也變成強充能方塊，讓綠色紅石燈因為與強充能方塊相鄰而被觸發，而紅色紅石燈沒有與任何充能方塊相鄰，因此還是暗的。</p>

        <Note>現在我們只介紹了強充能方塊的來源與特性，弱充能方塊將會和紅石粉一起介紹！</Note>
      </section>

      <section>
        <h2>電源列表</h2>
        <p>大多數電源就只是提供訊號來源而已，只有少部分電源如紅石方塊、紅石火把才會有額外的特殊功能，因此每個電源的屬性（指向方塊、充能強度等）只需要看過一眼，有個大概的印象就可以了，並不是電路設計的重點。在接下來的教學中，除非遇到特殊情況，否則我們都會以控制桿來做為電源。這邊就直接粗略把所有電源分成三類，以列表的形式呈現給你參考。</p>
      </section>

      <section>
        <h3>永久電源</h3>
        <p>永久電源是無論如何都會啟動的電源。</p>
        <Table content={tableData.permanent} />
      </section>

      <section>
        <h3>條件電源</h3>
        <p>條件電源只有在滿足特定條件下才會啟動，其他時間都會處於未啟動的狀態。</p>
        <Table content={tableData.conditional} />
      </section>

      <section>
        <h3>脈衝電源</h3>
        <p>脈衝電源只有滿足特定條件時才會啟動，且啟動後只會發出一道短暫的紅石訊號，隨即消失，這種短暫的「關→開→關」訊號就稱為「<b>正脈衝</b>（On-pulse）」。</p>
        <div className="note">如果訊號是短暫的「開→關→開」，則此訊號稱為「<b>負脈衝</b>（Off-pulse）」。</div>
        <Table content={tableData.pulse} />
      </section>
    </article>
  );
}

export default Signal;